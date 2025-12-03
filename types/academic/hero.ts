import { defaultAcademicStyles } from ".";

export const defaultAcademicHeroStyles = defaultAcademicStyles.hero;

export interface AcademicHeroCustomization {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    titleSize?: string;
    titleWeight?: string;
    summarySize?: string;
    summaryWeight?: string;
    lineHeight?: string;
}
