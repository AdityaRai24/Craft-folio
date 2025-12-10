"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportButtonProps {
    portfolioUrl: string;
    className?: string;
    iconOnly?: boolean;
}

import ExportingModal from './Modals/ExportingModal';

const ExportButton = ({ portfolioUrl, className, iconOnly = false }: ExportButtonProps) => {
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setShowModal(true);

            const response = await fetch('/api/export-portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ portfolioUrl }),
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Handle Blob response for download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "portfolio-export.zip";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Portfolio downloaded successfully!", { id: "export-toast" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to export portfolio. Please try again.", { id: "export-toast" });
        } finally {
            setIsExporting(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <ExportingModal
                isOpen={showModal}
                onOpenChange={(open) => {
                    // Prevent closing via outside click/escape if strictly exporting
                    if (!isExporting) setShowModal(open);
                }}
            />
            <Button
                onClick={handleExport}
                disabled={isExporting}
                className={`gap-2 ${className}`}
                variant="outline"
                title="Download Static Site"
            >
                {isExporting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {!iconOnly && "Generating..."}
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        {!iconOnly && "Download Static Site"}
                    </>
                )}
            </Button>
        </>
    );
};

export default ExportButton;
