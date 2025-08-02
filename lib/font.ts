import {
  Inter,
  Montserrat,
  Open_Sans,
  Poppins,
  Raleway,
  Geologica,
  Roboto,
  Lato,
  Playfair_Display,
  Source_Sans_3,
  Nunito,
  Merriweather,
  Ubuntu,
  Work_Sans,
  Outfit,
  Space_Grotesk,
  Plus_Jakarta_Sans,
  DM_Sans,
  Sora,
} from "next/font/google";

export type FontName =
  | "Inter"
  | "Montserrat"
  | "OpenSans"
  | "Poppins"
  | "Raleway"
  | "Geologica"
  | "Lato"
  | "PlayfairDisplay"
  | "SourceSans"
  | "Nunito"
  | "Merriweather"
  | "Ubuntu"
  | "WorkSans"
  | "Outfit"
  | "SpaceGrotesk"
  | "PlusJakartaSans"
  | "DMSans"
  | "Sora"

export const interFont = Inter({ subsets: ["latin"] });
export const montserratFont = Montserrat({ subsets: ["latin"] });
export const openSansFont = Open_Sans({ subsets: ["latin"] });
export const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const ralewayFont = Raleway({ subsets: ["latin"] });
export const geologicaFont = Geologica({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
export const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});
export const playfairDisplayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export const sourceSansFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});
export const nunitoFont = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});
export const merriweatherFont = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});
export const ubuntuFont = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});
export const workSansFont = Work_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const outfitFont = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const spaceGroteskFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const plusJakartaSansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export const dmSansFont = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const soraFont = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});


export const fontOptions = [
  "Poppins",
  "Geologica",
  "Montserrat",
  "Raleway",
  "Inter",
  "OpenSans",
  "Lato",
  "PlayfairDisplay",
  "SourceSans",
  "Nunito",
  "Merriweather",
  "Ubuntu",
  "WorkSans",
  "Outfit",
  "SpaceGrotesk",
  "PlusJakartaSans",
  "DMSans",
  "Sora",
];

export const fontClassMap: Record<string, string | undefined> = {
  Inter: interFont.className,
  Montserrat: montserratFont.className,
  OpenSans: openSansFont.className,
  Poppins: poppinsFont.className,
  Geologica: geologicaFont.className,
  Raleway: ralewayFont.className,
  Lato: latoFont.className,
  PlayfairDisplay: playfairDisplayFont.className,
  SourceSans: sourceSansFont.className,
  Nunito: nunitoFont.className,
  Merriweather: merriweatherFont.className,
  Ubuntu: ubuntuFont.className,
  WorkSans: workSansFont.className,
  Outfit: outfitFont.className,
  SpaceGrotesk: spaceGroteskFont.className,
  PlusJakartaSans: plusJakartaSansFont.className,
  DMSans: dmSansFont.className,
  Sora: soraFont.className,
};
