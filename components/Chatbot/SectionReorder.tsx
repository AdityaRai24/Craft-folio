import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { updatePortfolio } from "@/app/actions/portfolio";
import { useDispatch } from "react-redux";
import { newPortfolioData } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import { ColorTheme } from "@/lib/colorThemes";

interface SectionReorderProps {
  portfolioData: any;
  portfolioId: string;
  onClose: () => void;
  themeColors: any;
  onReset?: () => void;
  onApply?: () => void;
  reorderedSections: string[];
  setReorderedSections: (sections: string[]) => void;
}

const SectionItem = ({
  section,
  index,
  themeColors,
}: {
  section: string;
  index: number;
  themeColors: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center gap-2 p-3 rounded-lg cursor-move"
      style={{
        backgroundColor: themeColors.bgCardHover,
        border: `1px solid ${themeColors.borderLight}`,
      }}
    >
      <GripVertical
        size={16}
        style={{
          color: themeColors.textSecondary,
        }}
      />
      <span
        className="font-medium capitalize"
        style={{ color: themeColors.textPrimary }}
      >
        {section}
      </span>
    </motion.div>
  );
};

const SectionReorder = ({
  portfolioData,
  portfolioId,
  onClose,
  themeColors,
  onReset,
  onApply,
  reorderedSections,
  setReorderedSections,
}: SectionReorderProps) => {
  const dispatch = useDispatch();

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  // Initialize sections from portfolio data
  useState(() => {
    if (portfolioData) {
      let mainSections: any = [];
      portfolioData.forEach((item: any) => {
        if (
          item.type === "hero" ||
          item.type === "userInfo" ||
          item.type === "themes" ||
          item.type === "seo"
        ) {
          // Skip these sections
        } else {
          mainSections.push(item.type);
        }
      });
      setReorderedSections(mainSections);
    }
  });

  const handleSectionReorder = async () => {
    try {
      const sectionOrder: any = [];
      portfolioData.map((item: any) => sectionOrder.push(item.type));
      const updatedOrder: any = [];
      let idx = 0;
      sectionOrder.forEach((section: any) => {
        if (
          section === "hero" ||
          section === "userInfo" ||
          section === "themes" ||
          section === "seo"
        ) {
          updatedOrder.push(section);
        } else {
          updatedOrder.push(reorderedSections[idx]);
          idx++;
        }
      });
      const finalSections: any = [];
      updatedOrder.forEach((item: any) => {
        const found = portfolioData.find((it: any) => it.type === item);
        if (found) {
          finalSections.push({ type: item, data: found.data });
        } else {
          toast.error("Error while re ordering sections");
          return;
        }
      });

      await updatePortfolio({
        portfolioId: portfolioId,
        newPortfolioData: finalSections,
      });

      dispatch(newPortfolioData(finalSections));
      setReorderedSections(reorderedSections);
      toast.success("Sections reordered successfully!");
      onClose();
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Failed to reorder sections");
    }
  };

  const resetSectionOrder = () => {
    if (portfolioData) {
      let mainSections: any = [];
      portfolioData.forEach((item: any) => {
        if (
          item.type === "hero" ||
          item.type === "userInfo" ||
          item.type === "themes" ||
          item.type === "seo"
        ) {
          // Skip these sections
        } else {
          mainSections.push(item.type);
        }
      });
      setReorderedSections(mainSections);
    }
  };

  return (
    <div className="space-y-4">
     
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: themeColors.bgCard }}
      >
        <p
          className="text-sm mb-4"
          style={{ color: themeColors.textSecondary }}
        >
          Drag and drop sections to reorder them. The order will be applied to your portfolio.
        </p>

        <div className="space-y-2">
          <Reorder.Group
            axis="y"
            values={reorderedSections}
            onReorder={setReorderedSections}
            className="space-y-2"
          >
            {reorderedSections.map((section, index) => (
              <Reorder.Item
                key={section}
                value={section}
                className="cursor-move"
              >
                <SectionItem section={section} index={index} themeColors={themeColors} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
};

export default SectionReorder; 