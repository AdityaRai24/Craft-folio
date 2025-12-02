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
  let subdomain = params.site as string;
  const { user } = useUser();

  const {
    portfolioData,
    templateName,
  } = useSelector((state: RootState) => state.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [finalPortfolioId, setFinalPortfolioId] = useState<string>("");
  const [portfolioNotFound, setPortfolioNotFound] = useState<boolean>(false);
  const [portfolioLink, setPortfolioLink] = useState("");

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

