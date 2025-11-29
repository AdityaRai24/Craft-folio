export interface Technology {
  name: string;
  logo: string;
}

export interface Experience {
  role?: string;
  companyName?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  techStack?: Technology[];
}

export interface Education {
  degree: string;
  endDate: string;
  location: string;
  startDate: string;
  description: string | null;
  institution: string;
}
