export const clerkAppearance = {
    layout: {
        socialButtonsPlacement: "bottom",
        socialButtonsVariant: "iconButton",
    },
    variables: {
        colorPrimary: "#10b981", // Emerald-500 matching --primary
        colorText: "#f3f4f6", // --foreground
        colorBackground: "#18181b00", // Transparent for glass effect
        colorInputBackground: "#27272a", // zinc-800
        colorInputText: "white",
        colorTextSecondary: "#a1a1aa", // zinc-400
        borderRadius: "0.5rem",
    },
    elements: {
        card: "bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-emerald-500/10",
        headerTitle: "text-2xl font-bold text-white tracking-tight",
        headerSubtitle: "text-zinc-400",
        dividerLine: "bg-white/10",
        dividerText: "text-zinc-500",
        formFieldLabel: "text-zinc-300 font-medium",
        formFieldInput:
            "bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200",
        footerActionLink: "text-emerald-400 hover:text-emerald-300 transition-colors",
        identityPreviewText: "text-zinc-300",
        identityPreviewEditButton: "text-emerald-400 hover:text-emerald-300",
        formButtonPrimary:
            "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200",
        socialButtonsIconButton:
            "bg-zinc-800/50 border-white/10 hover:bg-zinc-800 hover:border-emerald-500/50 text-white transition-all duration-200",
        alert: "bg-red-900/20 border border-red-500/20 text-red-200",
        alertText: "text-red-200",
    }
} as const;
