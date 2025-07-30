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

  // Comprehensive customization state
  const [customization, setCustomization] = useState<CustomizationState>({
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
  });

  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;

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

  // Reset customization
  const resetCustomization = () => {
    setCustomization({
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
    });
  };

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

  // Helper functions for styling
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
    return sizes[customization.cardSize];
  };

  const getCardClasses = (index: number) => {
    const isHovered = visualEditorOpen && hoveredCard === index;
    const dimensions = getCardDimensions();

    let classes = `${dimensions.width} ${dimensions.height} ${dimensions.px} flex flex-col items-center justify-center transition-all border cursor-pointer`;

    // Card style variations
    switch (customization.cardStyle) {
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
    classes += ` duration-${customization.animationSpeed}`;

    // Hover effects
    if (customization.hoverEffects) {
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
    const shadowIntensity = customization.shadowIntensity;
    const shadowColor =
      customization.cardStyle === "neon" ? titleColor : `${titleColor}10`;

    let style: any = {
      borderRadius: `${customization.cardBorderRadius}px`,
      margin: `${customization.cardSpacing * 2}px`,
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
    if (customization.cardStyle === "neon") {
      style.borderColor = titleColor;
      style.borderWidth = `${customization.borderWidth}px`;
      if (hoveredCard === index && customization.hoverEffects) {
        style.boxShadow = `0 0 20px ${titleColor}50`;
      }
    } else {
      style.borderColor = `${titleColor}30`;
      style.borderWidth = `${customization.borderWidth}px`;
    }

    // Background opacity
    if (customization.cardStyle === "default") {
      style.backgroundColor = `rgba(41, 37, 36, ${
        customization.backgroundOpacity / 100
      })`;
    }

    return style;
  };

  const getIconSize = () => {
    return {
      width: `${customization.iconSize}px`,
      height: `${customization.iconSize}px`,
    };
  };

  const getLabelClasses = () => {
    let classes = "font-medium text-center transition-all";

    switch (customization.labelPosition) {
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

    classes += ` duration-${customization.animationSpeed}`;

    if (
      customization.hoverEffects &&
      customization.labelPosition !== "overlay"
    ) {
      classes += " group-hover:font-semibold";
    }

    return classes;
  };

  const getGridClasses = () => {
    return `grid grid-cols-2 sm:grid-cols-${Math.min(
      customization.gridColumns,
      6
    )} gap-${customization.cardSpacing} max-w-6xl mx-auto px-4`;
  };

  const renderTechCard = (tech: Technology, index: number) => (
    <div
      key={`tech-${index}`}
      className={`${
        customization.labelPosition === "right"
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
        {customization.showLabels &&
          customization.labelPosition === "overlay" && (
            <p className={getLabelClasses()} style={{ color: titleColor }}>
              {tech.name}
            </p>
          )}
      </div>
      {customization.showLabels &&
        customization.labelPosition !== "overlay" && (
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
    if (customization.autoShuffle && technologiesData.length > 0) {
      const interval = setInterval(() => {
        setShuffledData(shuffleArray(technologiesData));
      }, customization.shuffleInterval);
      return () => clearInterval(interval);
    }
  }, [
    customization.autoShuffle,
    customization.shuffleInterval,
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

  const displayData = customization.autoShuffle
    ? shuffledData
    : technologiesData;

  return (
    <div
      id="tech-stack"
      className={`py-8 bg-black sm:py-12 md:py-16 text-white`}
    >
      <style>{customCSS}</style>

      <SectionHeader
        sectionName="technologies"
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        titleColor={titleColor}
      />

      {/* Visual Editor Button */}
      <div className="top-4 right-4 z-20">
        <button
          onClick={() => setVisualEditorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{
            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
          }}
        >
          <Settings className="h-4 w-4" />
          Visual Editor
        </button>
      </div>

      {/* Technology Display */}
      <div className="relative overflow-hidden px-2 sm:px-4">
        {customization.displayMode === "marquee" ? (
          <div
            className="flex flex-nowrap overflow-hidden max-w-full sm:max-w-[80%] mx-auto"
            onMouseEnter={() => customization.pauseOnHover && setIsPaused(true)}
            onMouseLeave={() =>
              customization.pauseOnHover && setIsPaused(false)
            }
          >
            <Marquee
              pauseOnHover={customization.pauseOnHover}
              loop={0}
              speed={customization.marqueeSpeed}
              direction={customization.marqueeDirection}
            >
              {displayData.map((tech, index) => renderTechCard(tech, index))}
            </Marquee>
          </div>
        ) : (
          // Carousel mode (simplified grid with centered layout)
          <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
            {displayData.map((tech, index) => renderTechCard(tech, index))}
          </div>
        )}
      </div>

      {/* Floating Visual Editor Window */}
      {visualEditorOpen && (
        <div
          ref={dragRef}
          className="fixed bg-zinc-900 shadow-2xl z-50 rounded-lg border border-zinc-700 w-96 max-h-[80vh] overflow-hidden"
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-bold text-white">
              Technology Settings
            </h3>
            <button
              onClick={() => setVisualEditorOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            {["display", "styling", "animation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-3 text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
                style={getThemeButtonStyle(activeTab === tab)}
              >
                {tab === "display" && (
                  <Grid3X3 className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab === "styling" && (
                  <Palette className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab === "animation" && (
                  <Move className="h-4 w-4 mx-auto mb-1" />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
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
                          checked={customization.displayMode === option.value}
                          onChange={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              displayMode: option.value as any,
                            }))
                          }
                          style={{ accentColor: ColorTheme.primary }}
                        />
                        <span className="text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {customization.displayMode === "marquee" && (
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
                              setCustomization((prev) => ({
                                ...prev,
                                marqueeDirection: direction as any,
                              }))
                            }
                            className={`flex-1 py-2 px-3 text-sm capitalize rounded transition-colors ${
                              customization.marqueeDirection === direction
                                ? "text-white"
                                : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                            }`}
                            style={getThemeButtonStyle(customization.marqueeDirection === direction)}
                          >
                            {direction}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Speed: {customization.marqueeSpeed}
                      </label>
                      <input
                        type="range"
                        min={20}
                        max={200}
                        value={customization.marqueeSpeed}
                        onChange={(e) =>
                          setCustomization((prev) => ({
                            ...prev,
                            marqueeSpeed: Number(e.target.value),
                          }))
                        }
                        style={{ accentColor: ColorTheme.primary }}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        Pause on Hover
                      </span>
                      <Switch
                        checked={customization.pauseOnHover}
                        onCheckedChange={(checked) =>
                          setCustomization((prev) => ({
                            ...prev,
                            pauseOnHover: checked,
                          }))
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
                          setCustomization((prev) => ({
                            ...prev,
                            cardSize: size as any,
                          }))
                        }
                        className={`flex-1 py-2 px-3 text-sm capitalize rounded transition-colors ${
                          customization.cardSize === size
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                        }`}
                        style={getThemeButtonStyle(customization.cardSize === size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Icon Size: {customization.iconSize}px
                  </label>
                  <input
                    type="range"
                    min={24}
                    max={80}
                    value={customization.iconSize}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        iconSize: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Show Labels</span>
                  <Switch
                    checked={customization.showLabels}
                    onCheckedChange={(checked) =>
                      setCustomization((prev) => ({
                        ...prev,
                        showLabels: checked,
                      }))
                    }
                  />
                </div>

                {customization.showLabels && (
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
                              customization.labelPosition === option.value
                            }
                            onChange={() =>
                              setCustomization((prev) => ({
                                ...prev,
                                labelPosition: option.value as any,
                              }))
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
                    checked={customization.autoShuffle}
                    onCheckedChange={(checked) =>
                      setCustomization((prev) => ({
                        ...prev,
                        autoShuffle: checked,
                      }))
                    }
                  />
                </div>

                {customization.autoShuffle && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Shuffle Interval: {customization.shuffleInterval / 1000}s
                    </label>
                    <input
                      type="range"
                      min={2000}
                      max={15000}
                      step={1000}
                      value={customization.shuffleInterval}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          shuffleInterval: Number(e.target.value),
                        }))
                      }
                      style={{ accentColor: ColorTheme.primary }}
                      className="w-full"
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
                          setCustomization((prev) => ({
                            ...prev,
                            cardStyle: style.value as any,
                          }))
                        }
                        className={`py-2 px-3 text-sm rounded transition-colors ${
                          customization.cardStyle === style.value
                            ? "text-white"
                            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                        }`}
                        style={getThemeButtonStyle(customization.cardStyle === style.value)}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Radius: {customization.cardBorderRadius}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={customization.cardBorderRadius}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        cardBorderRadius: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Padding: {customization.cardPadding}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={customization.cardPadding}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        cardPadding: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Card Spacing: {customization.cardSpacing}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={customization.cardSpacing}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        cardSpacing: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Shadow Intensity: {customization.shadowIntensity}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    value={customization.shadowIntensity}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        shadowIntensity: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Background Opacity: {customization.backgroundOpacity}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={customization.backgroundOpacity}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        backgroundOpacity: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Border Width: {customization.borderWidth}px
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={customization.borderWidth}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        borderWidth: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {activeTab === "animation" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Animation Speed: {customization.animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={800}
                    step={50}
                    value={customization.animationSpeed}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        animationSpeed: Number(e.target.value),
                      }))
                    }
                    style={{ accentColor: ColorTheme.primary }}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Hover Effects</span>
                  <Switch
                    checked={customization.hoverEffects}
                    onCheckedChange={(checked) =>
                      setCustomization((prev) => ({
                        ...prev,
                        hoverEffects: checked,
                      }))
                    }
                  />
                </div>

                {customization.displayMode === "marquee" && (
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
                      {customization.pauseOnHover
                        ? "Hover to pause"
                        : "Manual control only"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-700 p-4 bg-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={resetCustomization}
                className="flex items-center gap-1 flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={() => setVisualEditorOpen(false)}
                className="flex-1 py-2 px-3 text-sm text-white rounded transition-colors"
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
