"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  fetchContent,
  getIdThroughSlug,
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
} from "@/slices/dataSlice";
import { templatesConfig } from "@/lib/templateConfig";
import Sidebar from "../Sidebar";
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
import { useUser } from "@clerk/nextjs";
import GuestWarningModal from "@/components/GuestWarningModal";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { user, isLoaded } = useUser();
  let portfolioId = params.portfolioId as string;

  const isUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str
    );

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
  const [finalPortfolioId, setFinalPortfolioId] = useState<string>(portfolioId);
  const [portfolioNotFound, setPortfolioNotFound] = useState<boolean>(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [showGuestModal, setShowGuestModal] = useState(false);

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
        let currentPortfolioId = portfolioId;

        // First check if it's a UUID
        if (isUUID(portfolioId)) {
          if (!isLoaded) {
            return; // Wait for auth to load
          }

          // Fetch portfolio data to check userId
          const themeResult = await getThemeNameApi({
            portfolioId: currentPortfolioId,
          });

          if (!themeResult.success || !themeResult.data) {
            setPortfolioNotFound(true);
            return;
          }

          // If portfolio belongs to guest, only allow access if portfolioId is in sessionStorage.guestPortfolioIds
          if (themeResult.data.userId === "guest") {
            if (typeof window !== 'undefined') {
              const guestIds = JSON.parse(sessionStorage.getItem('guestPortfolioIds') || '[]');
              if (!guestIds.includes(portfolioId)) {
                setPortfolioNotFound(true);
                return;
              }
            } else {
              setPortfolioNotFound(true);
              return;
            }
          } else {
            // For non-guest portfolios, require authentication and ownership
            if (!user || themeResult.data.userId !== user.id) {
              setPortfolioNotFound(true);
              return;
            }
          }

          currentPortfolioId = portfolioId;
        } else {
          // If not UUID, try to get ID through slug
          const response = await getIdThroughSlug({ slug: portfolioId });
          if (!response.success && response.error) {
            toast.error(response.error);
            setPortfolioNotFound(true);
            return;
          }
          if (response.success && response.portfolioId) {
            currentPortfolioId = response.portfolioId;
          }
        }

        setFinalPortfolioId(currentPortfolioId);

        // Fetch theme data
        const themeResult = await getThemeNameApi({
          portfolioId: currentPortfolioId,
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
          portfolioId: currentPortfolioId,
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
          portfolioId: currentPortfolioId,
        });
        if (customizationsResult.success) {
          // Store customizations in Redux or pass to components
          console.log("Loaded component customizations:", customizationsResult.data);
        }

        // Mark data as loaded only after both fetches complete
        setDataLoaded(true);
      } catch (error) {
        console.error("Error initializing portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePortfolio();
  }, [portfolioId, dispatch, finalPortfolioId, isLoaded, user]);

  // Show guest modal on first load if in guest mode
  useEffect(() => {
    if (dataLoaded && portfolioUserId === "guest") {
      setShowGuestModal(true);
    }
  }, [dataLoaded, portfolioUserId]);

  // Don't try to access template config until we have template name
  const Template =
    dataLoaded && templateName
      ? (templatesConfig[
          templateName as keyof typeof templatesConfig
        ] as TemplateType)
      : null;

  // Log all per-section data once fully loaded (for setting defaults)
  useEffect(() => {
    if (dataLoaded && templateName && portfolioData) {
      const sectionData = portfolioData.reduce((acc: Record<string, any>, item: any) => {
        // Ignore global items
        if (item.type !== "themes" && item.type !== "userInfo") {
          acc[item.type] = item.data;
        }
        return acc;
      }, {} as Record<string, any>);

      console.log(`Customisation snapshot for template: ${templateName}`, sectionData);
    }
  }, [dataLoaded, templateName, portfolioData]);

  const getComponentForSection = (sectionType: string) => {
    if (!Template || !Template.sections || !Template.sections[sectionType]) {
      return null;
    } 
    const SectionComponent: any = Template.sections[sectionType];
    return SectionComponent ? (
      <SectionComponent
        currentPortTheme={themeName}
        customCSS={customCSSState}
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
    <>
      <GuestWarningModal open={showGuestModal} onClose={() => setShowGuestModal(false)} />
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
    </>
  );
};

export default Page;
