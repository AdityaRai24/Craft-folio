import { type Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/Providers";

export const runtime = "nodejs";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "CraftFolio - Build Stunning Portfolio in minutes.",
  description:
    "CraftFolio is a modern portfolio builder that helps creators, developers, and professionals showcase their work with stunning, customizable templates. Create your professional portfolio in minutes with our intuitive drag-and-drop interface, responsive designs, and seamless deployment options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/images/icons/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/images/icons/favicon.svg" />
        <link rel="shortcut icon" href="/images/icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/icons/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${raleway.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
