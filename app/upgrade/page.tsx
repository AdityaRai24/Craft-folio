"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Phone, Mail, MapPin } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import MainNavbar from "@/components/Shared/MainNavbar";
import BgShapes from "@/components/Shared/BgShapes";
import { handleUpgrade } from "@/lib/razorpay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const page = () => {
  const router = useRouter();

  return (
    <div className="relative scrollbar custom-scrollbar min-h-screen flex flex-col">
      <BgShapes />
      <MainNavbar />

      <section className="pt-32 md:pt-40 pb-20 main-bg-noise relative overflow-hidden flex-grow">
        {/* Background gradients */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 70%)`,
          }}
          animate={{
            opacity: [1, 1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-6 relative">
          {/* Hero Section */}
          <motion.div
            className="text-center mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: ColorTheme.textPrimary }}>
              Upgrade to{" "}
              <span
                style={{
                  background: `linear-gradient(15deg, ${ColorTheme.primary}, ${ColorTheme.primary}, ${ColorTheme.primaryGlow})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 10px ${ColorTheme.primaryGlow}50)`,
                }}
              >
                CraftFolio Pro
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
              style={{
                color: ColorTheme.textSecondary,
                textShadow: `0 0 10px ${ColorTheme.textSecondary}20`,
              }}
            >
              Unlock premium templates, advanced customization, and powerful features.
            </p>
            <motion.button
              onClick={handleUpgrade}
              className="px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                color: ColorTheme.textPrimary,
                boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>

          {/* Pricing Section */}
          <div className="max-w-md mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 relative overflow-hidden" style={{ backgroundColor: ColorTheme.bgCard, borderColor: ColorTheme.primary }}>
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  RECOMMENDED
                </div>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold" style={{ color: ColorTheme.textPrimary }}>CraftFolio Pro</CardTitle>
                  <CardDescription style={{ color: ColorTheme.textSecondary }}>Everything you need to grow</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-4">
                  <div className="text-4xl font-bold mb-6" style={{ color: ColorTheme.textPrimary }}>
                    ₹199 <span className="text-lg font-normal text-gray-400">/ month</span>
                  </div>
                  <ul className="space-y-3 text-left max-w-xs mx-auto">
                    {[
                      "All premium templates",
                      "Unlimited exports",
                      "Custom CSS editor",
                      "Priority support",
                      "Custom Domain Support",
                      "10 Subdomain Deployments"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 flex-shrink-0" style={{ color: ColorTheme.primary }} />
                        <span style={{ color: ColorTheme.textSecondary }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <motion.button
                    onClick={handleUpgrade}
                    className="w-full py-3 rounded-lg font-bold"
                    style={{
                      backgroundColor: ColorTheme.primary,
                      color: "#000",
                    }}
                    whileHover={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Upgrade Now
                  </motion.button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: ColorTheme.textPrimary }}>Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 rounded-xl border border-gray-800 bg-opacity-50" style={{ backgroundColor: ColorTheme.bgCard }}>
                <Phone className="w-8 h-8 mb-4" style={{ color: ColorTheme.primary }} />
                <h3 className="font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>Phone</h3>
                <p style={{ color: ColorTheme.textSecondary }}>+91-8369703972</p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-xl border border-gray-800 bg-opacity-50" style={{ backgroundColor: ColorTheme.bgCard }}>
                <Mail className="w-8 h-8 mb-4" style={{ color: ColorTheme.primary }} />
                <h3 className="font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>Email</h3>
                <p style={{ color: ColorTheme.textSecondary }}>support@craftfolio.live</p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-xl border border-gray-800 bg-opacity-50" style={{ backgroundColor: ColorTheme.bgCard }}>
                <MapPin className="w-8 h-8 mb-4" style={{ color: ColorTheme.primary }} />
                <h3 className="font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>Address</h3>
                <p style={{ color: ColorTheme.textSecondary }}>Dadar, Mumbai, India</p>
              </div>
            </div>
          </div>

          {/* About Block */}
          <div className="max-w-3xl mx-auto text-center mb-20 p-8 rounded-2xl border border-gray-800" style={{ backgroundColor: ColorTheme.bgCard }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: ColorTheme.textPrimary }}>About CraftFolio</h2>
            <p className="text-lg leading-relaxed" style={{ color: ColorTheme.textSecondary }}>
              CraftFolio is a no-code portfolio builder that helps users create beautiful, professional portfolios using dynamic templates.
              We offer free and premium plans with advanced customization, enabling creators, developers, and professionals to showcase their work
              with stunning, responsive designs in minutes.
            </p>
          </div>

        </div>
      </section>

      {/* Footer / Legal Links */}
      <footer className="py-8 border-t border-gray-800" style={{ backgroundColor: ColorTheme.bgNav }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: ColorTheme.textSecondary }}>
              © 2025 CraftFolio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/legal/privacy-policy" className="hover:text-white transition-colors" style={{ color: ColorTheme.textSecondary }}>Privacy Policy</a>
              <a href="/legal/terms-and-conditions" className="hover:text-white transition-colors" style={{ color: ColorTheme.textSecondary }}>Terms & Conditions</a>
              <a href="/legal/refund-policy" className="hover:text-white transition-colors" style={{ color: ColorTheme.textSecondary }}>Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;