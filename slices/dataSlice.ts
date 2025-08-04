import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  portfolioData: any[];
  templateName: string;
  themeName: string;
  fontName: string;
  customCSSState : string;
  portfolioUserId : string;
  sectionTitle: string;
  sectionDescription: string;
  componentCustomizations: Record<string, any>;
}

const initialState: PortfolioState = {
  portfolioData: [],
  templateName: "",
  themeName: "",
  fontName: "",
  customCSSState : "",
  portfolioUserId : "",
  sectionTitle: "",
  sectionDescription: "",
  componentCustomizations: {},
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setPortfolioData: (state, action: PayloadAction<any[]>) => {
      state.portfolioData = action.payload;
    },
    setPortFolioUserId: (state, action: PayloadAction<string>) => {
      state.portfolioUserId = action.payload;
    },
    setTemplateName: (state, action: PayloadAction<string>) => {
      state.templateName = action.payload;
    },

     setThemeName: (state, action: PayloadAction<string>) => {
      state.themeName = action.payload;
    },

     setFontName: (state, action: PayloadAction<string>) => {
      state.fontName = action.payload;
    },

    setCustomCSSState: (state, action: PayloadAction<string>) => {
      state.customCSSState = action.payload;
    },

    setComponentCustomizations: (state, action: PayloadAction<Record<string, any>>) => {
      state.componentCustomizations = action.payload;
    },

    updatePortfolioData: (
      state,
      action: PayloadAction<{ sectionType: string; newData: any; sectionTitle: string; sectionDescription: string }>
    ) => {
      if (!state.portfolioData) return;

      const { sectionType, newData, sectionTitle, sectionDescription } = action.payload;
      state.portfolioData = state.portfolioData.map((section: any) => 
        section.type === sectionType ? {...section, data: newData, sectionTitle: sectionTitle, sectionDescription: sectionDescription } : section
      );
    },
    
    newPortfolioData: (state, action: PayloadAction<any[]>) => {
      // Replace the entire portfolio data array with the new one
      state.portfolioData = action.payload;
    },
    

  },
});

export const { 
  setPortfolioData, 
  setTemplateName, 
  setThemeName,
  setFontName,
  setPortFolioUserId,
  updatePortfolioData, 
  newPortfolioData,
  setCustomCSSState,
  setComponentCustomizations
} = dataSlice.actions;

export default dataSlice.reducer;