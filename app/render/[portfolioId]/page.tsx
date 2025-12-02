"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  fetchContent,
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
import PortfolioRenderer from "@/components/Portfolio/PortfolioRenderer";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const {
    portfolioData,
    templateName,
  } = useSelector((state: RootState) => state.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [portfolioNotFound, setPortfolioNotFound] = useState<boolean>(false);
  const [portfolioLink, setPortfolioLink] = useState("");

  useEffect(() => {
    const initializePortfolio = async () => {
      setIsLoading(true);
      setDataLoaded(false);

      try {
        // Fetch theme data
        const themeResult = await getThemeNameApi({
          portfolioId: portfolioId,
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
          portfolioId: portfolioId,
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
          portfolioId: portfolioId,
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
  }, [portfolioId, dispatch]);

  return (
    <PortfolioRenderer
      isLoading={isLoading}
      dataLoaded={dataLoaded}
      portfolioNotFound={portfolioNotFound}
      portfolioId={portfolioId}
      portfolioLink={portfolioLink}
    />
  );
};

export default Page;