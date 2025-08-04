import { useEffect, useState, useRef } from "react";
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { ColorTheme } from "@/lib/colorThemes";
import {
  Settings,
  Palette,
  Move,
  Grid3X3,
  RotateCcw,
  Play,
  Pause,
  Shuffle,
  X,
} from "lucide-react";
import EditButton from "@/components/EditButton";
import SectionHeader from "./SectionHeader";
import { Switch } from "@/components/ui/switch";
import { getComponentCustomization, saveComponentCustomization, deleteComponentCustomization } from "@/app/actions/portfolio";
import toast from "react-hot-toast";

interface Technology {
  name: string;
  logo: string;
}

interface CustomizationState {
  displayMode: "marquee" | "carousel";
  marqueeDirection: "left" | "right";
  marqueeSpeed: number;
  pauseOnHover: boolean;
  gridColumns: number;
  cardSize: "small" | "medium" | "large";
  cardStyle: "default" | "minimal" | "glassmorphism" | "neon";
  cardBorderRadius: number;
  cardPadding: number;
  cardSpacing: number;
  iconSize: number;
  showLabels: boolean;
  labelPosition: "bottom" | "overlay" | "right";
  animationSpeed: number;
  hoverEffects: boolean;
  shadowIntensity: number;
  backgroundOpacity: number;
  borderWidth: number;
  gradientDirection: "none" | "to-r" | "to-br" | "to-b";
  autoShuffle: boolean;
  shuffleInterval: number;
}

const Technologies = ({ currentPortTheme, customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

  const techSection = portfolioData?.find(
    (item: any) => item.type === "technologies"
  );
  const sectionTitle = techSection?.sectionTitle || "My Tech Stack";
  const sectionDescription =
    techSection?.sectionDescription || "Technologies I Worked On.";

  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<Technology[]>([]);
  const [shuffledData, setShuffledData] = useState<Technology[]>([]);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "display" | "styling" | "animation"
  >("display");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Dragging state for floating window
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Default styles for Technologies
  const defaultTechnologiesStyles: CustomizationState = {
    displayMode: "marquee",
    marqueeDirection: "left",
    marqueeSpeed: 100,
    pauseOnHover: true,
    gridColumns: 6,
    cardSize: "medium",
    cardStyle: "default",
    cardBorderRadius: 12,
    cardPadding: 6,
    cardSpacing: 4,
    iconSize: 48,
    showLabels: true,
    labelPosition: "bottom",
    animationSpeed: 300,
    hoverEffects: true,
    shadowIntensity: 1,
    backgroundOpacity: 80,
    borderWidth: 1,
    gradientDirection: "none",
    autoShuffle: false,
    shuffleInterval: 5000,
  };

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>(defaultTechnologiesStyles);
  const [draftCustomization, setDraftCustomization] = useState<CustomizationState | null>(null);

  // Use effectiveCustomization for preview - shows draft when editor is open, otherwise main state
  const effectiveCustomization = visualEditorOpen && draftCustomization ? draftCustomization : customization;

  // Helper function to get theme-based button style
  const getThemeButtonStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
        color: 'white'
      };
    }
    return {};
  };

  // Helper function to calculate slider percentage
  const getSliderPercentage = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  // Helper function to get slider background style
  const getSliderBackground = (value: number, min: number, max: number) => {
    const percentage = getSliderPercentage(value, min, max);
    return `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`;
  };

  const dispatch = useDispatch();

  // Load customizations from database on component mount
  useEffect(() => {
    const loadCustomizations = async () => {
      try {
        const result = await getComponentCustomization({
          portfolioId,
          componentType: "technologies",
        });
        if (result.success && result.data) {
          setCustomization(result.data as any);
        } else {
          setCustomization(defaultTechnologiesStyles);
        }
      } catch (error) {
        setCustomization(defaultTechnologiesStyles);
      }
    };

    if (portfolioId) {
      loadCustomizations();
    }
  }, [portfolioId]);

  // When opening the editor, copy customization to draft
  const openVisualEditor = () => {
    setDraftCustomization({ ...customization });
    setVisualEditorOpen(true);
  };

  // All visual editor controls update draftCustomization
  const updateDraftCustomization = (key: keyof CustomizationState, value: any) => {
    if (!draftCustomization) return;
    setDraftCustomization({ ...draftCustomization, [key]: value });
  };

  // When 'Done' is clicked, save draft to DB and update main state
  const saveDraftCustomization = async () => {
    if (!draftCustomization) return;
    setCustomization(draftCustomization);
    setVisualEditorOpen(false);
    try {
      const result = await saveComponentCustomization({
        portfolioId,
        componentType: "technologies",
        settings: draftCustomization,
      });
      if (!result.success) toast.error("Failed to save customization");
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  // On reset, delete from DB, set both states to default, and close editor
  const resetCustomization = async () => {
    try {
      await deleteComponentCustomization({
        portfolioId,
        componentType: "technologies",
      });
      setCustomization(defaultTechnologiesStyles);
      setDraftCustomization(defaultTechnologiesStyles);
      setVisualEditorOpen(false);
      toast.success("Customization reset successfully");
    } catch (error) {
      toast.error("Failed to reset customization");
    }
  };

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Shuffle function
  const shuffleArray = (array: Technology[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Manual shuffle trigger
  const handleShuffle = () => {
    setShuffledData(shuffleArray(technologiesData));
  };

  // Helper functions for styling - update all to use effectiveCustomization
  const getCardDimensions = () => {
    const sizes = {
      small: {
        width: "w-20 sm:w-24",
        height: "py-3 sm:py-4",
        px: "px-3 sm:px-4",
      },
      medium: {
        width: "w-24 sm:w-32 md:w-40",
        height: "py-4 sm:py-6",
        px: "px-4 sm:px-8",
      },
      large: {
        width: "w-32 sm:w-40 md:w-48",
        height: "py-6 sm:py-8",
        px: "px-6 sm:px-10",
      },
    };
    return sizes[effectiveCustomization.cardSize];
  };

  const getCardClasses = (index: number) => {
    const isHovered = visualEditorOpen && hoveredCard === index;
    const dimensions = getCardDimensions();

    let classes = `${dimensions.width} ${dimensions.height} ${dimensions.px} flex flex-col items-center justify-center transition-all border cursor-pointer`;

    // Card style variations
    switch (effectiveCustomization.cardStyle) {
      case "minimal":
        classes += " bg-transparent border-gray-600 hover:border-gray-400";
        break;
      case "glassmorphism":
        classes +=
          " bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20";
        break;
      case "neon":
        classes += ` bg-black/50 border-2 hover:shadow-lg`;
        break;
      default:
        classes +=
          " bg-stone-800/80 hover:bg-gradient-to-br from-stone-900 to-stone-900 border-transparent hover:border-current";
    }

    // Animation duration
    classes += ` duration-${effectiveCustomization.animationSpeed}`;

    // Hover effects
    if (effectiveCustomization.hoverEffects) {
      classes += " hover:scale-105 hover:shadow-xl";
    }

    // Visual editor highlight
    if (isHovered) {
      classes += " ring-2";
      classes += ` ring-[${ColorTheme.primary}]`;
    }

    return classes;
  };

  const getCardStyle = (index: number) => {
    const shadowIntensity = effectiveCustomization.shadowIntensity;
    const shadowColor =
      effectiveCustomization.cardStyle === "neon" ? titleColor : `${titleColor}10`;

    let style: any = {
      borderRadius: `${effectiveCustomization.cardBorderRadius}px`,
      margin: `${effectiveCustomization.cardSpacing * 2}px`,
    };

    // Shadow styling
    if (shadowIntensity > 0) {
      const shadowSize =
        shadowIntensity === 1
          ? "10px 15px -3px"
          : shadowIntensity === 2
          ? "20px 25px -5px"
          : "25px 35px -7px";
      style.boxShadow = `${shadowSize} ${shadowColor}, 0 4px 6px -4px ${shadowColor}`;
    }

    // Border styling
    if (effectiveCustomization.cardStyle === "neon") {
      style.borderColor = titleColor;
      style.borderWidth = `${effectiveCustomization.borderWidth}px`;
      if (hoveredCard === index && effectiveCustomization.hoverEffects) {
        style.boxShadow = `0 0 20px ${titleColor}50`;
      }
    } else {
      style.borderColor = `${titleColor}30`;
      style.borderWidth = `${effectiveCustomization.borderWidth}px`;
    }

    // Background opacity
    if (effectiveCustomization.cardStyle === "default") {
      style.backgroundColor = `rgba(41, 37, 36, ${
        effectiveCustomization.backgroundOpacity / 100
      })`;
    }

    return style;
  };

  const getIconSize = () => {
    return {
      width: `${effectiveCustomization.iconSize}px`,
      height: `${effectiveCustomization.iconSize}px`,
    };
  };

  const getLabelClasses = () => {
    let classes = "font-medium text-center transition-all";

    switch (effectiveCustomization.labelPosition) {
      case "overlay":
        classes +=
          " absolute bottom-2 left-0 right-0 bg-black/70 rounded px-2 py-1 text-xs";
        break;
      case "right":
        classes += " ml-3 text-sm";
        break;
      default:
        classes += " mt-2 text-xs sm:text-base";
    }

    classes += ` duration-${effectiveCustomization.animationSpeed}`;

    if (
      effectiveCustomization.hoverEffects &&
      effectiveCustomization.labelPosition !== "overlay"
    ) {
      classes += " group-hover:font-semibold";
    }

    return classes;
  };

  const getGridClasses = () => {
    return `grid grid-cols-2 sm:grid-cols-${Math.min(
      effectiveCustomization.gridColumns,
      6
    )} gap-${effectiveCustomization.cardSpacing} max-w-6xl mx-auto px-4`;
  };

  const renderTechCard = (tech: Technology, index: number) => (
    <div
      key={`tech-${index}`}
      className={`${
        effectiveCustomization.labelPosition === "right"
          ? "flex items-center"
          : "flex-none"
      } group relative`}
      onMouseEnter={() => visualEditorOpen && setHoveredCard(index)}
      onMouseLeave={() => visualEditorOpen && setHoveredCard(null)}
    >
      <div className={getCardClasses(index)} style={getCardStyle(index)}>
        <img
          src={
            tech.logo ||
            `https://placehold.co/100x100?text=${tech.name}&font=montserrat&fontsize=18`
          }
          alt={tech.name}
          style={getIconSize()}
          className="object-contain"
        />
        {effectiveCustomization.showLabels &&
          effectiveCustomization.labelPosition === "overlay" && (
            <p className={getLabelClasses()} style={{ color: titleColor }}>
              {tech.name}
            </p>
          )}
      </div>
      {effectiveCustomization.showLabels &&
        effectiveCustomization.labelPosition !== "overlay" && (
          <p className={getLabelClasses()} style={{ color: titleColor }}>
            {tech.name}
          </p>
        )}
    </div>
  );

  useEffect(() => {
    if (portfolioData) {
      const techData = portfolioData.find(
        (section: any) => section.type === "technologies"
      )?.data;
      if (techData) {
        setTechnologiesData(techData);
        setShuffledData(techData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  // Auto shuffle effect
  useEffect(() => {
    if (effectiveCustomization.autoShuffle && technologiesData.length > 0) {
      const interval = setInterval(() => {
        setShuffledData(shuffleArray(technologiesData));
      }, effectiveCustomization.shuffleInterval);
      return () => clearInterval(interval);
    }
  }, [
    effectiveCustomization.autoShuffle,
    effectiveCustomization.shuffleInterval,
    technologiesData,
  ]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-tech-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, technologiesData]);

  const handleSectionEdit = () => {
    dispatch(setCurrentEdit("technologies"));
  };

  if (isLoading || !technologiesData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const displayData = effectiveCustomization.autoShuffle
    ? shuffledData
    : technologiesData;

  return (
    <div
      id="tech-stack"
      className="text-white bg-black p-2 sm:p-4 md:p-8 relative"    >
      <style>{customCSS}</style>

      <SectionHeader
        sectionName="project"
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        titleColor={titleColor}
        onVisualEditorOpen={openVisualEditor}
      />

      {/* Technology Display */}
      <div className="relative overflow-hidden px-2 sm:px-4">
        {effectiveCustomization.displayMode === "marquee" ? (
          <div
            className="flex flex-nowrap overflow-hidden max-w-full mx-auto relative"
            onMouseEnter={() => effectiveCustomization.pauseOnHover && setIsPaused(true)}
            onMouseLeave={() =>
              effectiveCustomization.pauseOnHover && setIsPaused(false)
            }
          >
            {/* Left gradient edge */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
            
            {/* Right gradient edge */}
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent"></div>
            
            <Marquee
              pauseOnHover={effectiveCustomization.pauseOnHover}
              loop={0}
              speed={effectiveCustomization.marqueeSpeed}
              direction={effectiveCustomization.marqueeDirection}
            >
              {displayData.map((tech, index) => renderTechCard(tech, index))}
            </Marquee>
          </div>
        ) : (
          // Carousel mode (simplified grid with centered layout)
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 max-w-4xl mx-auto">
            {displayData.map((tech, index) => renderTechCard(tech, index))}
          </div>
        )}
      </div>

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <div
          ref={dragRef}
          className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-[90vw] sm:w-96 max-h-[80vh] overflow-hidden"
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-base sm:text-lg font-bold text-white">
              Technology Settings
            </h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["display", "styling", "animation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
                style={getThemeButtonStyle(activeTab === tab)}
              >
                {tab === "display" && (
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                {tab === "styling" && (
                  <Palette className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                {tab === "animation" && (
                  <Move className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1" />
                )}
                <span className="hidden sm:inline">{tab}</span>
                <span className="sm:hidden">{tab.charAt(0)}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-96">
            {activeTab === "display" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Display Mode
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "marquee", label: "Scrolling Marquee" },
                      { value: "carousel", label: "Centered Carousel" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="display"
                          checked={(draftCustomization?.displayMode ?? customization.displayMode) === option.value}
                          onChange={() =>
                            updateDraftCustomization("displayMode", option.value as any)
                          }
                          style={{ accentColor: ColorTheme.primary }}
                        />
                        <span className="text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {(draftCustomization?.displayMode ?? customization.displayMode) === "marquee" && (
                  <>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Direction
                      </label>
                      <div className="flex gap-2">
                        {["left", "right"].map((direction) => (
                          <button
                            key={direction}
                            onClick={() =>
                              updateDraftCustomization("marqueeDirection", direction as any)
                            }
                            className={`flex-1 py-2 px-3 text-sm capitalize rounded transition-colors ${
                              (draftCustomization?.marqueeDirection ?? customization.marqueeDirection) === direction
                                ? "text-white"
                                : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                            }`}
                            style={getThemeButtonStyle((draftCustomization?.marqueeDirection ?? customization.marqueeDirection) === direction)}
                          >
                            {direction}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Speed: {draftCustomization?.marqueeSpeed ?? customization.marqueeSpeed}
                      </label>
                      <input
                        type="range"
                        min={20}
                        max={200}
                        value={draftCustomization?.marqueeSpeed ?? customization.marqueeSpeed}
                        onChange={(e) =>
                          updateDraftCustomization("marqueeSpeed", Number(e.target.value))
                        }
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.marqueeSpeed ?? customization.marqueeSpeed, 20, 200)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.marqueeSpeed ?? customization.marqueeSpeed, 20, 200)}%, #3f3f46 100%)`
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        Pause on Hover
                      </span>
                      <Switch
                        checked={draftCustomization?.pauseOnHover ?? customization.pauseOnHover}
                        onCheckedChange={(checked) =>
                          updateDraftCustomization("pauseOnHover", checked)
                        }
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Size
                  </label>
                  <div className="flex gap-1">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          updateDraftCustomization("cardSize", size as any)
                        }
                        className={`flex-1 py-2 px-3 text-sm capitalize rounded transition-colors ${
                          (draftCustomization?.cardSize ?? customization.cardSize) === size
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                        }`}
                        style={getThemeButtonStyle((draftCustomization?.cardSize ?? customization.cardSize) === size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Icon Size: {draftCustomization?.iconSize ?? customization.iconSize}px
                  </label>
                  <input
                    type="range"
                    min={24}
                    max={80}
                    value={draftCustomization?.iconSize ?? customization.iconSize}
                    onChange={(e) =>
                      updateDraftCustomization("iconSize", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.iconSize ?? customization.iconSize, 24, 80)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.iconSize ?? customization.iconSize, 24, 80)}%, #3f3f46 100%)`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Labels</span>
                  <Switch
                    checked={draftCustomization?.showLabels ?? customization.showLabels}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("showLabels", checked)
                    }
                  />
                </div>

                {(draftCustomization?.showLabels ?? customization.showLabels) && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Label Position
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "bottom", label: "Below Card" },
                        { value: "overlay", label: "Overlay" },
                        { value: "right", label: "Right Side" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="labelPosition"
                            checked={
                              (draftCustomization?.labelPosition ?? customization.labelPosition) === option.value
                            }
                            onChange={() =>
                              updateDraftCustomization("labelPosition", option.value as any)
                            }
                            style={{ accentColor: ColorTheme.primary }}
                          />
                          <span className="text-white">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Auto Shuffle</span>
                  <Switch
                    checked={draftCustomization?.autoShuffle ?? customization.autoShuffle}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("autoShuffle", checked)
                    }
                  />
                </div>

                {(draftCustomization?.autoShuffle ?? customization.autoShuffle) && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Shuffle Interval: {(draftCustomization?.shuffleInterval ?? customization.shuffleInterval) / 1000}s
                    </label>
                    <input
                      type="range"
                      min={2000}
                      max={15000}
                      step={1000}
                      value={draftCustomization?.shuffleInterval ?? customization.shuffleInterval}
                      onChange={(e) =>
                        updateDraftCustomization("shuffleInterval", Number(e.target.value))
                      }
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.shuffleInterval ?? customization.shuffleInterval, 2000, 15000)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.shuffleInterval ?? customization.shuffleInterval, 2000, 15000)}%, #3f3f46 100%)`
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "styling" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "default", label: "Default" },
                      { value: "minimal", label: "Minimal" },
                      { value: "glassmorphism", label: "Glass" },
                      { value: "neon", label: "Neon" },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() =>
                          updateDraftCustomization("cardStyle", style.value as any)
                        }
                        className={`py-2 px-3 text-sm rounded transition-colors ${
                          (draftCustomization?.cardStyle ?? customization.cardStyle) === style.value
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                        }`}
                        style={getThemeButtonStyle((draftCustomization?.cardStyle ?? customization.cardStyle) === style.value)}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Radius: {draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius}
                    onChange={(e) =>
                      updateDraftCustomization("cardBorderRadius", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius, 0, 24)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.cardBorderRadius ?? customization.cardBorderRadius, 0, 24)}%, #3f3f46 100%)`
                    }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Padding: {draftCustomization?.cardPadding ?? customization.cardPadding}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={draftCustomization?.cardPadding ?? customization.cardPadding}
                    onChange={(e) =>
                      updateDraftCustomization("cardPadding", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.cardPadding ?? customization.cardPadding, 2, 12)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.cardPadding ?? customization.cardPadding, 2, 12)}%, #3f3f46 100%)`
                    }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Spacing: {draftCustomization?.cardSpacing ?? customization.cardSpacing}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={draftCustomization?.cardSpacing ?? customization.cardSpacing}
                    onChange={(e) =>
                      updateDraftCustomization("cardSpacing", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.cardSpacing ?? customization.cardSpacing, 1, 8)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.cardSpacing ?? customization.cardSpacing, 1, 8)}%, #3f3f46 100%)`
                    }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Shadow Intensity: {draftCustomization?.shadowIntensity ?? customization.shadowIntensity}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    value={draftCustomization?.shadowIntensity ?? customization.shadowIntensity}
                    onChange={(e) =>
                      updateDraftCustomization("shadowIntensity", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: getSliderBackground(draftCustomization?.shadowIntensity ?? customization.shadowIntensity, 0, 3)
                    }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Background Opacity: {draftCustomization?.backgroundOpacity ?? customization.backgroundOpacity}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={draftCustomization?.backgroundOpacity ?? customization.backgroundOpacity}
                    onChange={(e) =>
                      updateDraftCustomization("backgroundOpacity", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: getSliderBackground(draftCustomization?.backgroundOpacity ?? customization.backgroundOpacity, 10, 100)
                    }}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Width: {draftCustomization?.borderWidth ?? customization.borderWidth}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={draftCustomization?.borderWidth ?? customization.borderWidth}
                    onChange={(e) =>
                      updateDraftCustomization("borderWidth", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.borderWidth ?? customization.borderWidth, 0, 4)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.borderWidth ?? customization.borderWidth, 0, 4)}%, #3f3f46 100%)`,
                    }}
                  />
                </div>
              </>
            )}

            {activeTab === "animation" && (   
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Animation Speed: {draftCustomization?.animationSpeed ?? customization.animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={800}
                    step={50}
                    value={draftCustomization?.animationSpeed ?? customization.animationSpeed}
                    onChange={(e) =>
                      updateDraftCustomization("animationSpeed", Number(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary} 0%, ${ColorTheme.primary} ${getSliderPercentage(draftCustomization?.animationSpeed ?? customization.animationSpeed, 100, 800)}%, #3f3f46 ${getSliderPercentage(draftCustomization?.animationSpeed ?? customization.animationSpeed, 100, 800)}%, #3f3f46 100%)`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Hover Effects</span>
                  <Switch
                    checked={draftCustomization?.hoverEffects ?? customization.hoverEffects}
                    onCheckedChange={(checked) =>
                      updateDraftCustomization("hoverEffects", checked)
                    }
                  />
                </div>

                {(draftCustomization?.displayMode ?? customization.displayMode) === "marquee" && (
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">
                        Playback Control
                      </span>
                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                      >
                        {isPaused ? (
                          <Play className="h-3 w-3" />
                        ) : (
                          <Pause className="h-3 w-3" />
                        )}
                        {isPaused ? "Play" : "Pause"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      {(draftCustomization?.pauseOnHover ?? customization.pauseOnHover)
                        ? "Hover to pause"
                        : "Manual control only"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-700 p-3 sm:p-4 bg-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={resetCustomization}
                className="flex items-center gap-1 flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={saveDraftCustomization}
                className="flex-1 py-2 px-2 sm:px-3 text-xs sm:text-sm text-white rounded transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for floating window */}
      {visualEditorOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setVisualEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default Technologies;
