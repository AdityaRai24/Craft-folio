import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import JSZip from 'jszip';
import path from 'path';

// Helper to fetch image data with headers (Prevents 403 Forbidden)
async function fetchImage(url: string): Promise<Buffer | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': url
            }
        });

        if (!response.ok) return null;

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.warn(`[Export] Failed to download asset: ${url}`);
        return null;
    }
}

export async function POST(req: NextRequest) {
    let browser = null;
    try {
        const { portfolioUrl } = await req.json();

        if (!portfolioUrl) {
            return NextResponse.json({ error: 'Portfolio URL is required' }, { status: 400 });
        }

        // 1. Launch Browser
        const isLocal = process.env.NODE_ENV === 'development';

        if (isLocal) {
            // Local Development
            const localExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
            browser = await puppeteer.launch({
                args: (chromium as any).args,
                defaultViewport: (chromium as any).defaultViewport,
                executablePath: localExecutablePath,
                headless: true,
            });
        } else {
            // Production (Vercel)
            browser = await puppeteer.launch({
                args: (chromium as any).args,
                defaultViewport: (chromium as any).defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: (chromium as any).headless,
            });
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // 🔍 DEBUG: Relay Browser Console to Node Console
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            // Filter out noise, keep errors/swarns
            if (type === 'error' || type === 'warn') {
                console.log(`[Browser ${type.toUpperCase()}] ${text}`);
            }
        });

        page.on('pageerror', (err: any) => {
            console.error(`[Browser CRASH] ${err.message}`);
        });

        // 🔴 FIX 1: PREVENT REACT CRASHES (Polyfills)
        // Mocks missing APIs in Headless mode that cause "Application Error"
        await page.evaluateOnNewDocument(() => {
            // Mock matchMedia
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: (query: any) => ({
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener: () => { },
                    removeListener: () => { },
                    addEventListener: () => { },
                    removeEventListener: () => { },
                    dispatchEvent: () => { },
                }),
            });

            // Mock IntersectionObserver (fixes lazy loading crashes)
            window.IntersectionObserver = class IntersectionObserver {
                observe() { }
                unobserve() { }
                disconnect() { }
            } as any;

            // Mock ResizeObserver (fixes layout crashes)
            window.ResizeObserver = class ResizeObserver {
                observe() { }
                unobserve() { }
                disconnect() { }
            } as any;
        });

        console.log(`[Export] Navigating to ${portfolioUrl}...`);

        try {
            await page.goto(portfolioUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
        } catch (navError) {
            console.error('[Export] Navigation warning:', navError);
        }

        // 🔴 FIX 2: ROBUST WAITING STRATEGY
        try {
            console.log('[Export] Waiting for content...');

            // 1. Wait for the MAIN CONTENT container to appear (Gold Standard)
            // This ID is only present when PortfolioRenderer finishes loading.
            await page.waitForSelector('#portfolio-content', { visible: true, timeout: 15000 });

            // 2. Ensure Loader is truly gone (Double check)
            try {
                await page.waitForSelector('.animate-spin', { hidden: true, timeout: 5000 });
            } catch (e) { }

            // 3. Wait a fixed time for React hydration/animations to settle
            await new Promise(r => setTimeout(r, 3000));

        } catch (e) {
            console.warn('[Export] Wait warning (Content might be incomplete):', e);
        }

        // 🔴 FIX 3: REMOVE ERROR OVERLAYS
        // If React crashed and showed the black/red error screen, remove it so we see the underlying HTML
        await page.evaluate(() => {
            const errorOverlay = document.querySelector('nextjs-portal') || document.querySelector('#__next-build-watcher');
            if (errorOverlay) errorOverlay.remove();
        });

        // 3. Auto-Scroll (Trigger Lazy Loading)
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // 🔴 FIX: SCROLL BACK TO TOP (Fixes Navbar Name Visibility)
        // The navbar hides content when scrolled. We must be at the top for the capture.
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 2000)); // Wait for scroll/nav transition

        // 🔴 FIX 5: FREEZE ANIMATIONS & FORCE VISIBILITY
        await page.evaluate(() => {
            // A. FREEZE JS EXECUTION
            const noop = () => { };
            window.requestAnimationFrame = noop as any;
            window.setTimeout = noop as any;
            window.setInterval = noop as any;

            // B. FORCE VISIBILITY AGGRESSIVELY
            const allElements = document.querySelectorAll<HTMLElement>('*');
            allElements.forEach((el) => {
                const computed = window.getComputedStyle(el);
                const opacity = parseFloat(computed.opacity);
                const hasTransform = computed.transform !== 'none';

                // 1. Force Opacity & Visibility (Catch anything not fully opaque)
                if (opacity < 1 || computed.visibility === 'hidden') {
                    el.style.cssText += '; opacity: 1 !important; visibility: visible !important; filter: none !important;';
                }

                // 2. Reset Transforms
                if (hasTransform) {
                    el.style.removeProperty('transform');
                    el.style.transform = '';
                }
            });

            // C. CONVERT HERO BUTTONS TO LINKS (Fixes Clickable Links in Static Export)
            const buttons = Array.from(document.querySelectorAll('button'));
            buttons.forEach(btn => {
                const text = btn.innerText.toLowerCase().trim();
                let href = '';

                if (text.includes('view projects')) href = '#projects';
                else if (text.includes('contact me')) href = '#contact';
                else if (text.includes('about')) href = '#about';
                else if (text.includes('tech stack')) href = '#technologies';

                if (href) {
                    const a = document.createElement('a');
                    a.href = href;
                    a.className = btn.className;
                    a.innerHTML = btn.innerHTML;
                    btn.replaceWith(a);
                }
            });

            // D. GLOBAL CSS OVERRIDE
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                    transition-delay: 0s !important;
                    animation-delay: 0s !important;
                }
                html {
                    scroll-behavior: smooth;
                }
            `;
            document.head.appendChild(style);
        });

        // 4. SCRAPE ASSETS & CLEAN DOM
        const { html, assets } = await page.evaluate(async () => {
            const assetsToDownload: { originalUrl: string, filename: string }[] = [];
            const processedUrls = new Set<string>();

            const processAssetUrl = (url: string, prefix = 'asset') => {
                if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.length > 2000) return url;

                const origin = window.location.origin;
                let absoluteUrl = url;
                const cleanUrl = url.replace(/['"]/g, '').trim();

                if (cleanUrl.startsWith('http')) {
                    absoluteUrl = cleanUrl;
                } else if (cleanUrl.startsWith('//')) {
                    absoluteUrl = `https:${cleanUrl}`;
                } else {
                    absoluteUrl = `${origin}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
                }

                if (processedUrls.has(absoluteUrl)) {
                    const existing = assetsToDownload.find(a => a.originalUrl === absoluteUrl);
                    return existing ? `./${existing.filename}` : url;
                }

                let ext = absoluteUrl.split('.').pop()?.split('?')[0]?.split('#')[0] || 'dat';
                if (ext.length > 5) ext = 'dat';

                const validExts = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'woff', 'woff2', 'ttf', 'otf', 'eot', 'css', 'ico'];
                if (!validExts.includes(ext.toLowerCase())) return url;

                const filename = `assets/${prefix}_${assetsToDownload.length}.${ext}`;
                assetsToDownload.push({ originalUrl: absoluteUrl, filename });
                processedUrls.add(absoluteUrl);

                return `./${filename}`;
            };

            // --- DOM CLEANUP ---
            document.querySelectorAll('script').forEach(s => s.remove());
            document.querySelectorAll('link[rel="preload"], link[rel="modulepreload"], noscript').forEach(el => el.remove());
            document.querySelectorAll('iframe').forEach(el => el.remove()); // Remove iframes causing issues
            const toasts = document.querySelector('#_rht_toaster');
            if (toasts) toasts.remove();

            // --- PROCESS CSS ---
            let fullCss = '';

            // Fetch external stylesheets
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            for (const link of links) {
                try {
                    // Try to fetch content, if blocked by CORS, skip
                    const href = (link as HTMLLinkElement).href;
                    if (href) {
                        const response = await fetch(href);
                        if (response.ok) {
                            const text = await response.text();
                            fullCss += text + '\n';
                        }
                    }
                } catch (e) { }
                link.remove();
            }

            // Fetch inline styles
            document.querySelectorAll('style').forEach(style => {
                fullCss += style.innerHTML + '\n';
                style.remove();
            });

            // Rewrite URLs in CSS
            const fixedCss = fullCss.replace(/url\((['"]?)(.*?)\1\)/g, (match, quote, url) => {
                const newPath = processAssetUrl(url, 'css_asset');
                if (newPath === url) return match;
                return `url("${newPath}")`;
            });

            const newStyleTag = document.createElement('style');
            newStyleTag.textContent = fixedCss;
            document.head.appendChild(newStyleTag);

            // --- PROCESS IMAGES ---
            document.querySelectorAll('img').forEach((img) => {
                const src = img.getAttribute('src') || img.getAttribute('data-src');
                if (src) {
                    const newPath = processAssetUrl(src, 'img');
                    img.setAttribute('src', newPath);
                    img.removeAttribute('srcset');
                    img.removeAttribute('loading');
                }
            });

            // --- PROCESS SVG / FAVICONS ---
            document.querySelectorAll('image').forEach((img) => {
                const href = img.getAttribute('href') || img.getAttribute('xlink:href');
                if (href) {
                    const newPath = processAssetUrl(href, 'svg_img');
                    img.setAttribute('href', newPath);
                }
            });

            document.querySelectorAll('link[rel*="icon"]').forEach((link) => {
                const linkEl = link as HTMLLinkElement;
                if (linkEl.href) {
                    const newPath = processAssetUrl(linkEl.href, 'icon');
                    linkEl.setAttribute('href', newPath);
                }
            });

            // Final Attribute Cleanup
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                el.removeAttribute('data-reactroot');
                el.removeAttribute('data-nscript');
            });

            return {
                html: document.documentElement.outerHTML,
                assets: assetsToDownload
            };
        });

        await browser.close();

        // 5. Create ZIP
        const zip = new JSZip();
        zip.file('index.html', html);
        const assetsFolder = zip.folder('assets');

        if (assetsFolder && assets.length > 0) {
            for (const asset of assets) {
                const buffer = await fetchImage(asset.originalUrl);
                if (buffer) {
                    assetsFolder.file(path.basename(asset.filename), buffer);
                }
            }
        }

        zip.file('README.txt', `
Your Static Portfolio
=====================
Exported from CraftFolio.

To Host:
1. Unzip this folder.
2. Drag and drop the folder to https://app.netlify.com/drop
        `);

        const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

        return new NextResponse(zipContent as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="portfolio-export.zip"',
            },
        });

    } catch (error) {
        console.error('Export failed:', error);
        if (browser) await browser.close();
        return NextResponse.json({ error: 'Failed to export portfolio' }, { status: 500 });
    }
}