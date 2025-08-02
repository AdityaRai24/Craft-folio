import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();
  const isDev = host.includes("localhost");

  
  // 👇 Skip system routes
  const isSystemPath =
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/.well-known");

  if (isSystemPath) return NextResponse.next();

  // 🌐 SUBDOMAIN HANDLING
  let subdomain = "";
  if (isDev) {
    const hostWithoutPort = host.split(":")[0];
    if (hostWithoutPort.endsWith(".localhost")) {
      subdomain = hostWithoutPort.replace(".localhost", "");
    }
  } else if (host.endsWith("craftfolio.live")) {
    subdomain = host.split(".")[0];
  }

  if (subdomain && subdomain !== "www" && subdomain !== "craftfolio") {
    url.pathname = `/portfolio-sites/${subdomain}`;
    console.log("[Middleware] Subdomain rewrite:", {
      subdomain,
      path: url.pathname,
    });
    return NextResponse.rewrite(url);
  }



  // 🌐 CUSTOM DOMAIN HANDLING
  if (!host.endsWith("craftfolio.live")) {
    // Check if host is a mapped custom domain
    const { data, error } = await supabase
      .from("custom_domains")
      .select("portfolio_id")
      .eq("domain", host)
      .single();

    if (data && !error) {
      url.pathname = `/render/${data.portfolio_id}`;
      console.log("[Middleware] Custom domain rewrite:", {
        domain: host,
        portfolioId: data.portfolio_id,
        path: url.pathname,
      });
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
