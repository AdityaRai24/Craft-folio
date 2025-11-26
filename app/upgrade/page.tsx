"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import MainNavbar from "@/components/Shared/MainNavbar";
import BgShapes from "@/components/Shared/BgShapes";

const page = () => {
  const router = useRouter();

  const features = [
    {
      title: "Free Tier",
      price: "₹0",
      description: "Perfect for getting started",
      features: [
        "1 Subdomain Deployment",
        "Basic Templates",
        "Standard Support",
        "Basic Analytics",
        "Community Access",
      ],
      buttonText: "Current Plan",
      isPopular: false,
      isCurrent: true,
    },
    {
      title: "Premium",
      price: "Coming Soon",
      description: "Premium features launching soon",
      features: [
        "Up to 10 Subdomain Deployments",
        "All Premium Templates",
        "Priority Support",
        "Advanced Analytics",
        "Custom Domain Support",
        "Premium Features Access",
        "Early Access to New Features",
        "Dedicated Support Channel",
      ],
      buttonText: "Coming Soon",
      isPopular: true,
      isCurrent: false,
    },
  ];

  return (
    <div className="relative scrollbar custom-scrollbar">
      <BgShapes />
      <MainNavbar />

      <section className="pt-40 md:pt-40 main-bg-noise relative overflow-hidden">
        {/* Background gradients similar to main page */}
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
          <motion.div
            className="text-center mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                color: ColorTheme.primary,
                backgroundColor: ColorTheme.primaryGlow,
              }}
              whileHover={{ scale: 1.05 }}
            >
              Upgrade Your Experience
            </motion.span>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Choose Your{" "}
              <span
                style={{
                  background: `linear-gradient(15deg, ${ColorTheme.primary}, ${ColorTheme.primary}, ${ColorTheme.primaryGlow})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 10px ${ColorTheme.primaryGlow}50)`,
                }}
              >
                Plan
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
              style={{
                color: ColorTheme.textSecondary,
                textShadow: `0 0 10px ${ColorTheme.textSecondary}20`,
              }}
            >
              Unlock premium features and take your portfolio to the next level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((plan, index) => (
              <motion.div
                key={plan.title}
                className={`relative rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 ${plan.isPopular
                    ? "scale-105 border-primary"
                    : "border-border-light"
                  }`}
                style={{
                  backgroundColor: ColorTheme.bgCard,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{
                  y: -10,
                  boxShadow: `0 20px 40px rgba(0,0,0,0.2), 0 10px 20px ${ColorTheme.primaryGlow}20`,
                }}
              >
                {plan.isPopular && (
                  <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: ColorTheme.primary,
                      color: ColorTheme.textPrimary,
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <p
                    className="text-sm"
                    style={{ color: ColorTheme.textSecondary }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check
                        className="w-5 h-5"
                        style={{ color: ColorTheme.primary }}
                      />
                      <span style={{ color: ColorTheme.textSecondary }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full py-3 rounded-lg font-medium transition-all ${plan.isCurrent || plan.title === "Premium"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                    }`}
                  style={{
                    background: plan.isCurrent || plan.title === "Premium"
                      ? ColorTheme.bgCardHover
                      : `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    color: ColorTheme.textPrimary,
                  }}
                  whileHover={
                    !plan.isCurrent && plan.title !== "Premium"
                      ? {
                        boxShadow: `0 8px 25px ${ColorTheme.primaryGlow}, 0 0 30px ${ColorTheme.primaryGlow}30`,
                      }
                      : {}
                  }
                  onClick={() => {
                    if (!plan.isCurrent && plan.title !== "Premium") {
                      // Handle upgrade logic here
                    }
                  }}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "What happens after I upgrade?",
                  answer:
                    "After upgrading to Premium, you'll immediately get access to all premium features, including the ability to deploy up to 10 subdomains. Your account will be automatically updated.",
                },
                {
                  question: "Is the premium plan a subscription?",
                  answer:
                    "No, the premium plan is a one-time payment of ₹99. You'll get lifetime access to all premium features with no recurring charges.",
                },
                {
                  question: "Can I upgrade later?",
                  answer:
                    "Yes, you can upgrade to Premium at any time. Your existing portfolio and data will be preserved when you upgrade.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, debit cards, and UPI payments through our secure payment gateway.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl backdrop-blur-sm border"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p style={{ color: ColorTheme.textSecondary }}>
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;