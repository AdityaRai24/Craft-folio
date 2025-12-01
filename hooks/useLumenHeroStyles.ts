export const useLumenHeroStyles = () => {
    const hexToRgba = (hex: string, alpha: number) => {
        if (!hex) return "rgba(0,0,0,0)";
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 4) {
            r = parseInt("0x" + hex[1] + hex[1]);
            g = parseInt("0x" + hex[2] + hex[2]);
            b = parseInt("0x" + hex[3] + hex[3]);
        } else if (hex.length === 7) {
            r = parseInt("0x" + hex[1] + hex[2]);
            g = parseInt("0x" + hex[3] + hex[4]);
            b = parseInt("0x" + hex[5] + hex[6]);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    };

    return { hexToRgba };
};
