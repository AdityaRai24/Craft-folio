"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Slider from "react-slick";
import { CheckCircle, MousePointer2, ChevronLeft, ChevronRight, Star, Sparkles, Palette, Zap, Info } from 'lucide-react';
import { fadeInScale } from '@/lib/animations';
import TemplateDetailsModal from '@/components/Modals/TemplateDetailsModal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ThemeCardProps {
  theme: {
    id: number;
    templateName: string;
    name: string;
    category: string;
    description: string;
    previewImageUrl: string[];
    features: string[];
    liveUrl: string;
  };
  handleSelectTheme: (id: number) => void;
  selectedTheme: number;
}

const PrevArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute bottom-4 right-[52px] z-30 cursor-pointer bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all"
      style={{ ...style }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <ChevronLeft size={18} className="text-white" />
    </div>
  );
};

const NextArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute bottom-4 right-4 z-30 cursor-pointer bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all"
      style={{ ...style }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <ChevronRight size={18} className="text-white" />
    </div>
  );
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, handleSelectTheme, selectedTheme }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const previewImages = theme.previewImageUrl.length > 0
    ? theme.previewImageUrl
    : ['/placeholder-image.jpg'];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <div
        style={{
          width: "20px",
          height: "3px",
          borderRadius: "1px",
          background: i === currentSlide ? "#10b981" : "rgba(255, 255, 255, 0.3)",
          margin: "0 3px",
          transition: "all 0.3s ease"
        }}
      />
    ),
    dotsClass: "slick-dots custom-line-indicators"
  };

  return (
    <>
      <motion.div
        className={`
          rounded-2xl overflow-hidden transition-all duration-300 h-full w-full flex flex-col
          bg-zinc-900/50 backdrop-blur-xl border
          ${selectedTheme === theme.id ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-white/10 hover:border-emerald-500/30 hover:bg-zinc-800/50'}
        `}
        variants={fadeInScale}
        whileHover={{
          y: -5,
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)"
        }}
      >
        {/* Theme Tag */}
        {/* <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span
            className="text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}
          >
            {theme.name === 'NeoSpark' ? (
              <>
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400">Best Choice</span>
              </>
            ) : theme.name === 'LumenFlow' ? (
              <>
                <Zap size={12} className="text-blue-400 fill-blue-400" />
                <span className="text-blue-400">Premium</span>
              </>
            ) : theme.name === 'MonoEdge' ? (
              <>
                <Palette size={12} className="text-purple-400" />
                <span className="text-purple-400">Minimalist</span>
              </>
            ) : (
              <>
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Professional</span>
              </>
            )}
          </span>
        </div> */}

        {/* Image Section - Larger Aspect Ratio */}
        <div
          className="relative overflow-hidden group  border-b border-white/5 cursor-pointer"
          onClick={() => setIsDetailsModalOpen(true)}
        >
          <Slider {...sliderSettings} className="h-full">
            {previewImages.map((image, index) => (
              <div key={index} className=" relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                <img
                  src={image}
                  alt={`${theme.name} theme preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </Slider>

          {/* Hover Overlay with "View Details" */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Info size={16} />
              View Details
            </div>
          </div>

          {selectedTheme === theme.id && (
            <motion.div
              className="absolute top-4 right-4 p-1.5 rounded-full z-20 bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <CheckCircle className="h-5 w-5" />
            </motion.div>
          )}
        </div>

        {/* Content Section - Minimal */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{theme.name}</h3>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-1 mb-4">
            {theme.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <motion.button
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDetailsModalOpen(true)}
            >
              <Info className="h-4 w-4" />
              Preview
            </motion.button>

            <motion.button
              className={`
                flex-1 flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all
                ${selectedTheme === theme.id
                  ? 'bg-transparent text-emerald-500 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectTheme(theme.id)}
            >
              <MousePointer2 className="h-4 w-4" />
              {selectedTheme === theme.id ? 'Selected' : 'Select'}
            </motion.button>
          </div>
        </div>

        <style jsx global>{`
          .custom-line-indicators {
            position: absolute;
            bottom: 20px;
            display: flex !important;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 0;
            margin: 0;
            list-style: none;
            z-index: 20;
            pointer-events: none;
          }
          .custom-line-indicators li {
            margin: 0 3px;
            pointer-events: auto;
            cursor: pointer;
          }
          .slick-slider, .slick-list, .slick-track, .slick-slide, .slick-slide > div {
            height: 100%;
          }
        `}</style>
      </motion.div>

      <TemplateDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        theme={theme}
        onSelect={(id) => {
          handleSelectTheme(id);
          setIsDetailsModalOpen(false);
        }}
        isSelected={selectedTheme === theme.id}
      />
    </>
  );
};

export default ThemeCard;
