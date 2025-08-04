"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  fetchContent,
  getIdThroughSubdomain,
  getThemeNameApi,
  getAllComponentCustomizations,
} from "@/app/actions/portfolio";
import { redirect, useParams } from "next/navigation";
import {
  setCustomCSSState,
  setFontName,
  setPortfolioData,
  setPortFolioUserId,
  setTemplateName,
  setThemeName,
  setComponentCustomizations,
} from "@/slices/dataSlice";
import { templatesConfig } from "@/lib/templateConfig";
import { Spotlight } from "@/components/NeoSpark/Spotlight";
import Chatbot from "@/components/Chatbot/Chatbot";
import { motion } from "framer-motion";
import { fontClassMap } from "@/lib/font";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import PortfolioNotFound from "@/components/PortfolioNotFound";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CheckCircle, Layout, Palette } from "lucide-react";
import Head from "next/head";
import Sidebar from "@/app/p/Sidebar";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  let subdomain = params.site as string;
  const { user } = useUser();

  const {
    portfolioData,
    portfolioUserId,
    templateName,
    themeName,
    fontName,
    customCSSState,
  } = useSelector((state: RootState) => state.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [finalPortfolioId, setFinalPortfolioId] = useState<string>("");
  const [portfolioNotFound, setPortfolioNotFound] = useState<boolean>(false);
  const [portfolioLink, setPortfolioLink] = useState("");

  type TemplateType = {
    navbar: React.ComponentType;
    spotlight?: boolean;
    sections: {
      [key: string]: React.ComponentType;
    };
  };

  const allSections = dataLoaded
    ? portfolioData?.map((item: any) => item.type)
    : [];

  const themes = dataLoaded
    ? portfolioData?.find((item: any) => item.type === "themes")?.data
    : undefined;

  useEffect(() => {
    const initializePortfolio = async () => {
      setIsLoading(true);
      setDataLoaded(false);

      try {
        // Get portfolio ID through subdomain
        const response = await getIdThroughSubdomain({ subdomain });
        if (!response.success && response.error) {
          toast.error(response.error);
          setPortfolioNotFound(true);
          return;
        }
        if (response.success && response.portfolioId) {
          setFinalPortfolioId(response.portfolioId);
          
          // Fetch theme data
          const themeResult = await getThemeNameApi({
            portfolioId: response.portfolioId,
          });
          if (!themeResult.success) {
            setPortfolioNotFound(true);
            return;
          }
          if (themeResult.success) {
            setPortfolioLink(themeResult?.data?.PortfolioLink?.subdomain 
              ? `https://${themeResult?.data?.PortfolioLink?.subdomain}.craftfolio.live`
              : themeResult?.data?.PortfolioLink?.slug 
                ? `https://craftfolio.live/p/${themeResult?.data?.PortfolioLink?.slug}`
                : "");
            dispatch(setPortFolioUserId(themeResult?.data?.userId || ""));
            dispatch(
              setTemplateName(themeResult?.data?.templateName || "default")
            );
            dispatch(setThemeName(themeResult?.data?.themeName || "default"));
            dispatch(setFontName(themeResult?.data?.fontName || "Raleway"));
            dispatch(setCustomCSSState(themeResult?.data?.customCSS || ""));
          }

          // Fetch content data
          const contentResult: any = await fetchContent({
            portfolioId: response.portfolioId,
          });
          if (!contentResult.success) {
            setPortfolioNotFound(true);
            return;
          }
          if (contentResult.success) {
            dispatch(setPortfolioData(contentResult?.data?.sections));
          }

          // Fetch component customizations
          const customizationsResult = await getAllComponentCustomizations({
            portfolioId: response.portfolioId,
          });
          if (customizationsResult.success) {
            // Store customizations in Redux
            dispatch(setComponentCustomizations(customizationsResult.data || {}));
            console.log("Loaded component customizations:", customizationsResult.data);
          }
        }

        // Mark data as loaded only after both fetches complete
        setDataLoaded(true);
      } catch (error) {
        console.error("Error initializing portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize portfolio immediately without waiting for user auth
    initializePortfolio();
  }, [subdomain, dispatch]);

  // Don't try to access template config until we have template name
  const Template =
    dataLoaded && templateName
      ? (templatesConfig[
          templateName as keyof typeof templatesConfig
        ] as TemplateType)
      : null;

  const getComponentForSection = (sectionType: string) => {
    if (!Template || !Template.sections || !Template.sections[sectionType]) {
      return null;
    } 
    const SectionComponent: any = Template.sections[sectionType];
    return SectionComponent ? (
      <SectionComponent
        currentPortTheme={themeName}
        customCSS={customCSSState}
        portfolioId={finalPortfolioId}
        key={`${sectionType}`}
      />
    ) : null;
  };

  if (portfolioNotFound) {
    return <PortfolioNotFound />;
  }

  if (isLoading || !dataLoaded || !Template) {
    const portfolioMessages: any = [
      { text: "Loading the portfolio", icon: Palette },
      { text: "Fetching data", icon: Layout },
      { text: "Almost there", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={portfolioMessages} />;
  }

  // By this point, we guarantee the data is loaded
  const NavbarComponent: any = Template.navbar;
  const hasSpotlight = Template.spotlight;
  const selectedFontClass = fontClassMap[fontName] || fontClassMap["raleway"];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {hasSpotlight && (
        <div className="absolute inset-0">
          <Spotlight
            className="-top-40 left-0 md:-top-80 md:left-5"
            fill="white"
          />
        </div>
      )}

      {/* Responsive layout: on md+ if chat is open, add right margin to main content */}
      <div
        className={
          isChatOpen
            ? "w-full md:w-[80%] md:mr-[20%] transition-all duration-300"
            : "w-full transition-all duration-300"
        }
      >
        <motion.div
          className={cn(" min-h-screen w-full", selectedFontClass)}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {NavbarComponent && (
            <NavbarComponent
              customCSS={customCSSState}
              currentPortTheme={themeName}
              portfolioId={finalPortfolioId}
            />
          )}
          <Sidebar />

          {allSections && allSections.length > 0 ? (
            allSections.map((section: string) =>
              getComponentForSection(section)
            )
          ) : (
            <div className={cn("flex items-center justify-center h-screen")}>
              <p className="text-xl">Portfolio content not found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Only render Chatbot after data is loaded */}
      {dataLoaded && (
        <Chatbot
          portfolioData={portfolioData}
          themeOptions={themes}
          setCurrentFont={(font) => dispatch(setFontName(font))}
          setCurrentPortTheme={(theme) => dispatch(setThemeName(theme))}
          portfolioId={finalPortfolioId}
          currentPortTheme={themeName}
          currentFont={fontName}
          portfolioLink={portfolioLink}
          onOpenChange={setIsChatOpen}
          setCustomCSS={(css) => dispatch(setCustomCSSState(css))}
          customCSSState={customCSSState}
        />
      )}
    </div>
  );
};

export default Page;
