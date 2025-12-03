"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Check, Star, Zap, Palette, Sparkles } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TemplateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: any;
    onSelect: (id: number) => void;
    isSelected: boolean;
}

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({
    isOpen,
    onClose,
    theme,
    onSelect,
    isSelected,
}) => {
    if (!theme) return null;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
    };

    const previewImages = theme.previewImageUrl && theme.previewImageUrl.length > 0
        ? theme.previewImageUrl
        : ['/placeholder-image.jpg'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Side: Image Slider */}
                        <div className="w-full md:w-3/5 bg-black relative flex flex-col justify-center p-4 md:p-0">
                            <div className="relative w-full h-full min-h-[300px] md:min-h-full">
                                <Slider {...sliderSettings} className="h-full template-modal-slider">
                                    {previewImages.map((image: string, index: number) => (
                                        <div key={index} className="h-full flex items-center justify-center outline-none">
                                            <div className="relative w-full h-full aspect-video md:aspect-auto md:h-full">
                                                <img
                                                    src={image}
                                                    alt={`${theme.name} preview ${index + 1}`}
                                                    className="w-full h-full object-contain bg-zinc-900"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/* Right Side: Details */}
                        <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto bg-zinc-900/50 flex flex-col">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    {theme.name === 'NeoSpark' && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                                    {theme.name === 'LumenFlow' && <Zap size={16} className="text-blue-400 fill-blue-400" />}
                                    {theme.name === 'MonoEdge' && <Palette size={16} className="text-purple-400" />}
                                    {!['NeoSpark', 'LumenFlow', 'MonoEdge'].includes(theme.name) && <Sparkles size={16} className="text-emerald-400" />}
                                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{theme.category || "Portfolio"}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">{theme.name}</h2>
                                <p className="text-gray-300 leading-relaxed text-base">
                                    {theme.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {theme.features.map((feature: string, index: number) => (
                                        <span
                                            key={index}
                                            className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={() => onSelect(theme.id)}
                                    className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2
                    ${isSelected
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500'
                                            : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'}
                  `}
                                >
                                    {isSelected ? (
                                        <>
                                            <Check size={20} />
                                            Selected
                                        </>
                                    ) : (
                                        "Select This Template"
                                    )}
                                </button>

                                <a
                                    href={theme.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                >
                                    <ExternalLink size={18} />
                                    View Live Demo
                                </a>
                            </div>
                        </div>
                    </motion.div>
                    <style jsx global>{`
            .template-modal-slider .slick-dots {
                bottom: 20px;
            }
            .template-modal-slider .slick-dots li button:before {
                color: white;
            }
            .template-modal-slider .slick-prev, .template-modal-slider .slick-next {
                z-index: 10;
                width: 40px;
                height: 40px;
            }
            .template-modal-slider .slick-prev {
                left: 20px;
            }
            .template-modal-slider .slick-next {
                right: 20px;
            }
          `}</style>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TemplateDetailsModal;
