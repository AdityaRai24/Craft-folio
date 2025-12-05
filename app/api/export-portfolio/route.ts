import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import JSZip from 'jszip';
import path from 'path';

// Helper to fetch image data
async function fetchImage(url: string): Promise<Buffer | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.error(`Failed to fetch image: ${url}`, error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { portfolioUrl } = await req.json();

        if (!portfolioUrl) {
            return NextResponse.json({ error: 'Portfolio URL is required' }, { status: 400 });
        }

        // 1. Launch Browser
        const isLocal = process.env.NODE_ENV === 'development';
        let browser;

        if (isLocal) {
            // Local development: Use local Chrome installation
            // You might need to adjust the executablePath based on your OS
            // For Windows, it's usually:
            // C:\Program Files\Google\Chrome\Application\chrome.exe
            // or C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
            const localExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

            // Fallback to puppeteer's default if local path fails (requires full puppeteer package, 
            // but we are using puppeteer-core, so we MUST provide executablePath)
            // If you don't have Chrome installed at this path, you'll need to update it.

            browser = await puppeteer.launch({
                args: chromium.args as any,
                defaultViewport: (chromium as any).defaultViewport,
                executablePath: localExecutablePath,
                headless: true,
            } as any);
        } else {
            // Production (Vercel): Use @sparticuz/chromium
            browser = await puppeteer.launch({
                args: chromium.args as any,
                defaultViewport: (chromium as any).defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: (chromium as any).headless,
            } as any);
        }

        const page = await browser.newPage();

        // 1. Set Viewport to Desktop (prevents mobile rendering)
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(portfolioUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // 2. Wait for the actual content to load (bypassing the loading spinner)
        try {
            await page.waitForSelector('#portfolio-content', { timeout: 60000 });
        } catch (e) {
            console.warn('Timeout waiting for #portfolio-content, proceeding anyway...');
        }

        // 3. Auto-Scroll to trigger lazy loading
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100; // Scroll down 100px at a time
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    // Stop scrolling when we reach the bottom
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100); // Wait 100ms between scrolls
            });
        });

        // 4. Wait for images to finish downloading after scroll
        await new Promise(r => setTimeout(r, 2000));

        // ---------------------------------------------------------------------------
        // 🔴 REPLACEMENT CODE START
        // ---------------------------------------------------------------------------

        // 5. Clean up DOM & Extract ALL Assets (Images + Fonts + CSS Backgrounds)
        const { html, assets } = await page.evaluate(async () => {
            const assetsToDownload: { originalUrl: string, filename: string }[] = [];

            // Helper to process a URL and queue it for download
            const processAssetUrl = (url: string, prefix = 'asset') => {
                if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;

                // Resolve absolute URL
                const origin = window.location.origin;
                let absoluteUrl = url;

                // Handle relative paths (remove quotes if present)
                const cleanUrl = url.replace(/['"]/g, '');

                if (cleanUrl.startsWith('http')) {
                    absoluteUrl = cleanUrl;
                } else if (cleanUrl.startsWith('//')) {
                    absoluteUrl = `https:${cleanUrl}`;
                } else {
                    absoluteUrl = `${origin}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
                }

                // Generate filename
                const ext = absoluteUrl.split('.').pop()?.split('?')[0] || 'dat';
                // Filter for valid extensions only to avoid junk
                const validExts = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'woff', 'woff2', 'ttf', 'otf', 'eot'];
                if (!validExts.includes(ext.toLowerCase())) return url;

                const filename = `assets/${prefix}_${assetsToDownload.length}.${ext}`;
                assetsToDownload.push({ originalUrl: absoluteUrl, filename });

                return `./${filename}`; // Relative path for the ZIP structure
            };

            // 1. Cleanup Scripts & UI
            document.querySelectorAll('script').forEach(s => s.remove());
            document.querySelectorAll('link[rel="preload"]').forEach(l => l.remove()); // Remove preloads to avoid 404s
            const toasts = document.querySelector('#_rht_toaster');
            if (toasts) toasts.remove();

            // 2. Process CSS (Style Tags) - Fonts & Background Images
            const styleSheets = Array.from(document.styleSheets);
            let fullCss = '';

            styleSheets.forEach((sheet) => {
                try {
                    const rules = sheet.cssRules;
                    if (rules) {
                        Array.from(rules).forEach((rule) => {
                            fullCss += rule.cssText;
                        });
                    }
                } catch (e) {
                    console.log('Skipping external sheet');
                }
            });

            // 🔴 MAGIC REGEX: Finds all url(...) instances in CSS
            // Captures fonts (woff2) and background images
            const fixedCss = fullCss.replace(/url\((['"]?)(.*?)\1\)/g, (match, quote, url) => {
                const newPath = processAssetUrl(url, 'css_asset');
                if (newPath === url) return match; // No change
                return `url("${newPath}")`;
            });

            // Inject Clean CSS
            const styleTag = document.createElement('style');
            styleTag.textContent = fixedCss;
            document.head.appendChild(styleTag);

            // Remove old links to prevent conflicts
            document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());

            // 3. Process HTML Images (<img> tags)
            document.querySelectorAll('img').forEach((img) => {
                const newPath = processAssetUrl(img.src, 'img');
                if (newPath !== img.src) {
                    img.src = newPath;
                    img.removeAttribute('srcset'); // Break srcset to force fallback to src
                    img.removeAttribute('loading'); // Disable lazy loading on static export
                }
            });

            // 4. Process SVG <image> tags (common in charts/graphics)
            document.querySelectorAll('image').forEach((img) => {
                const href = img.getAttribute('href') || img.getAttribute('xlink:href');
                if (href) {
                    const newPath = processAssetUrl(href, 'svg_img');
                    img.setAttribute('href', newPath);
                }
            });

            return {
                html: document.documentElement.outerHTML,
                assets: assetsToDownload
            };
        });

        await browser.close();

        // 6. Create ZIP
        const zip = new JSZip();
        zip.file('index.html', html);
        const assetsFolder = zip.folder('assets');

        // 7. Download ALL assets (Parallel Processing for speed)
        if (assetsFolder && assets.length > 0) {
            await Promise.all(assets.map(async (asset) => {
                const buffer = await fetchImage(asset.originalUrl);
                if (buffer) {
                    // asset.filename is "assets/name.ext", we need just "name.ext" for the folder
                    assetsFolder.file(path.basename(asset.filename), buffer);
                }
            }));
        }

        // Add Instructions
        zip.file('README.txt', `
Your Static Portfolio
=====================
Hosted Instructions:
1. Unzip this folder.
2. Drag and drop to https://app.netlify.com/drop
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
        return NextResponse.json({ error: 'Failed to export portfolio' }, { status: 500 });
    }
}
