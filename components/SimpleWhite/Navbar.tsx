import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
// import { usePortfolioConfig } from "../../hooks/usePortfolioConfig.tsx";
import { FaArrowRight } from "react-icons/fa6";

// @ts-ignore
import { Link } from 'react-scroll';  // Importing Link component from react-scroll

const menuItems = [
  { title: "About Me", href: "hero" },
  { title: "Projects", href: "projects" },
  { title: "Skills", href: "skills" },
  { title: "Experience", href: "experience" },
];

 const Navbar = ({ currentPortTheme }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Theme color variables (if theme is available)
  const primaryColor = "#2563EB"; // Default fallback
  const textPrimaryColor = "#1F2937"; // Default fallback
  const textSecondaryColor = "#6B7280"; // Default fallback
  // const { personal } = usePortfolioConfig();

  const toggleSidebar = () => setIsOpen((state) => !state);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const menuItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const containerVariants = {
    open: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {/* <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 bg-black cursor-pointer z-[99999] p-2 bg-primary-900 rounded-full shadow drop-shadow-lg
        hover:drop-shadow-xl hover:scale-110 group
        transition-all duration-300 ease-out"
        whileHover={{
          rotate: 180,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "menu"}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
            className=" text-white
            transition-colors duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button> */}

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-white md:bg-black/50 z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed top-0 left-0 h-full text-black bg-white z-50 w-full 
          md:w-64 md:transform-none md:opacity-100 md:pointer-events-auto md:shadow-lg px-8 py-12
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* LogoName */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900">
            Aditya Rai{/* {personal.name} Aditya Rai */}
          </h1>
          <p className="text-primary-600 mt-1 sm:mt-2 font-title text-sm sm:text-base">
            {/* {personal.role} */}
            Software Developer
            </p>
        </motion.div>

        {/* Navigation Items */}
        <motion.ul variants={containerVariants} className="space-y-3 sm:space-y-4 md:space-y-5 text-black">
          {menuItems.map((item) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isHovered, setIsHovered] = useState(false);
            return (
              <motion.li
                key={item.title}
                variants={menuItemVariants}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative cursor-pointer"
              >
                <Link
                    to={item.href}
                    smooth={true}
                    duration={500}
                  onClick={() => setIsOpen(false)}
                  className="block text-base sm:text-lg font-title text-primary-800 hover:text-white hover:bg-black hover:font-semibold transition-all duration-200 py-3 sm:py-4 px-3 sm:px-4 relative overflow-hidden"
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-between"
                    animate={{
                      x: isHovered ? 15 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.span className="relative inline-block">
                      {item.title}
                      {/* Underline */}
                      <motion.span
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          scaleX: isHovered ? 1 : 0,
                        }}
                        initial={{ scaleX: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bg-white h-[2px] bottom-0 left-0 origin-left"
                        style={{ width: "100%" }}
                      />
                    </motion.span>

                    <motion.span
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? -8 : -50,
                        transition: { delay: 0.1 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                    >
                      <FaArrowRight size={18} className="sm:w-[22px] sm:h-[22px]" />
                    </motion.span>
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-primary-900"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: isHovered ? 1 : 0,
                    }}
                    transition={{ type: "tween", duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.nav>
    </>
  );
};

export default Navbar