import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PortfolioNotFound = () => {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center main-bg-noise",
      "bg-gradient-to-b from-background to-background/80"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4 relative z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl" />
          <h1 className="text-7xl font-bold text-primary mb-4 relative">404</h1>
        </div>
        <h2 className="text-3xl font-semibold text-foreground mb-6">Portfolio Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The portfolio you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className={cn(
            "inline-flex items-center px-6 py-3",
            "bg-primary text-primary-foreground font-medium rounded-lg",
            "hover:bg-primary/90 transition-colors duration-200",
            "shadow-lg shadow-primary/20"
          )}
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default PortfolioNotFound; 