import { motion } from "framer-motion";
import { ReactNode } from "react";

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const textVariants = {
  rest: { y: 0 },
  hover: { y: -30 },
};

const newTextVariants = {
  rest: { y: 20, opacity: 0 },
  hover: { y: 0, opacity: 1 },
};

interface AnimatedButtonProps {
  text: string;
  icon: ReactNode;
  link?: string;
  onClick?: () => void;
}

export default function AnimatedButton({ text = "Button", icon, link, onClick }: AnimatedButtonProps) {
  const ButtonComponent = ({ children }: { children: ReactNode }) => {
    if (link) {
      return (
        <motion.a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative cursor-pointer inline-flex bg-black hover:text-black hover:border-black items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 overflow-hidden font-semibold text-white hover:bg-white border hover:border-primary-900 hover:text-primary-900 bg-primary-900 transition-all duration-300 text-sm sm:text-base"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {children}
        </motion.a>
      );
    } else {
      return (
        <motion.button
          onClick={onClick}
          className="group relative cursor-pointer inline-flex bg-black hover:text-black hover:border-black items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 overflow-hidden font-semibold text-white hover:bg-white border hover:border-primary-900 hover:text-primary-900 bg-primary-900 transition-all duration-300 text-sm sm:text-base"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {children}
        </motion.button>
      );
    }
  };

  return (
    <div className="mt-8 sm:mt-10 md:mt-12">
      <ButtonComponent>
        <motion.span className="relative hover:text-black hover:border-black font-title flex items-center overflow-hidden">
          <motion.span
            className="flex items-center justify-center"
            variants={textVariants}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {text}
            <motion.span
              className="ml-2"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.span>
          </motion.span>
          <motion.span
            className="flex items-center justify-center absolute"
            variants={newTextVariants}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {text}
            <motion.span
              className="ml-2"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.span>
          </motion.span>
        </motion.span>
      </ButtonComponent>
    </div>
  );
}