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
import { useParams } from "next/navigation";
import {
  setCustomCSSState,
  setFontName,
  setPortfolioData,
  setPortFolioUserId,
  setTemplateName,
  setThemeName,
  setComponentCustomizations,
} from "@/slices/dataSlice";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import PortfolioRenderer from "@/components/Portfolio/PortfolioRenderer";

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
  } = useSelector((state: RootState) => state.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [finalPortfolioId, setFinalPortfolioId] = useState<string>(portfolioId);
  const [portfolioNotFound, setPortfolioNotFound] = useState<boolean>(false);
  const [portfolioLink, setPortfolioLink] = useState("");

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
          // Store customizations in Redux
          dispatch(setComponentCustomizations(customizationsResult.data || {}));
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

    }
  }, [dataLoaded, templateName, portfolioData]);

  return (
    <PortfolioRenderer
      isLoading={isLoading}
      dataLoaded={dataLoaded}
      portfolioNotFound={portfolioNotFound}
      portfolioId={finalPortfolioId}
      portfolioLink={portfolioLink}
    />
  );
};

export default Page;

