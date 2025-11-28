"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Slider from "react-slick";
import { CheckCircle, GripHorizontalIcon, MousePointer2, ChevronLeft, ChevronRight, ChevronDown, Star, Sparkles, Palette, Zap } from 'lucide-react';
import { fadeInScale } from '@/lib/animations';
import { useRouter } from 'next/navigation';
import CardImageModal from '@/components/Modals/CardImageModal';
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
  isExpanded: boolean;
  handleCardClick: (id: number) => void;
}

const PrevArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute bottom-4 right-[52px] z-30 cursor-pointer bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all"
      style={{ ...style }}
      onClick={onClick}
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
      onClick={onClick}
    >
      <ChevronRight size={18} className="text-white" />
    </div>
  );
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, handleSelectTheme, selectedTheme, isExpanded, handleCardClick }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleImageClick = (index: number) => {
    if (!isMobile) {
      setSelectedImageIndex(index);
      setIsImageModalOpen(true);
    }
  };

  return (
    <motion.div
      className={`
        rounded-2xl overflow-hidden transition-all duration-300 h-full w-full
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
      <div className="absolute top-4 left-4 z-20">
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
      </div>

      {/* Image Section */}
      <div className="relative overflow-hidden group aspect-[16/9] border-b border-white/5">
        <Slider {...sliderSettings} className="h-full">
          {previewImages.map((image, index) => (
            <div key={index} className="aspect-[16/9] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src={image}
                alt={`${theme.name} theme preview ${index + 1}`}
                className={`w-full h-full object-cover ${!isMobile ? 'cursor-pointer' : ''}`}
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </Slider>

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

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">{theme.name}</h3>
        </div>

        <p className="mb-6 text-gray-400 text-sm leading-relaxed min-h-[40px]">
          {isExpanded ? theme.description : truncateDescription(theme.description)}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mb-4">
          <motion.button
            className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(`${theme.liveUrl}`, '_blank')}
          >
            <GripHorizontalIcon className="h-4 w-4" />
            Preview
          </motion.button>

          <motion.button
            className={`
              flex-1 flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all
              ${selectedTheme === theme.id
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-white text-black hover:bg-gray-100'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectTheme(theme.id)}
          >
            <MousePointer2 className="h-4 w-4" />
            {selectedTheme === theme.id ? 'Selected' : 'Select'}
          </motion.button>
        </div>

        {/* Show More Button */}
        <button
          className="w-full flex items-center justify-center gap-1 text-xs font-medium text-gray-500 hover:text-emerald-400 transition-colors py-2"
          onClick={() => handleCardClick(theme.id)}
        >
          {isExpanded ? 'Show Less' : 'Show Details'}
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/10 mt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {theme.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {!isMobile && (
        <CardImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={previewImages}
          theme={theme}
          initialIndex={selectedImageIndex}
        />
      )}

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
  );
};

export default ThemeCard;