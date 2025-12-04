export interface Technology {
    name: string;
    logo: string;
}

export interface Experience {
    id?: string;
    role: string;
    companyName?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description: string;
    techStack?: Technology[];
    current?: boolean;
}
