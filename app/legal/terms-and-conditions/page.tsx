"use client";
import React from "react";
import MainNavbar from "@/components/Shared/MainNavbar";
import { ColorTheme } from "@/lib/colorThemes";

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: ColorTheme.bgMain }}>
            <MainNavbar />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8" style={{ color: ColorTheme.textPrimary }}>
                        Terms and Conditions
                    </h1>
                    <div className="space-y-6 text-lg" style={{ color: ColorTheme.textSecondary }}>
                        <p>Last updated: December 2025</p>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>1. Agreement to Terms</h2>
                            <p>
                                By accessing our website at CraftFolio, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>2. Use License</h2>
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software) on CraftFolio's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>modify or copy the materials;</li>
                                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>attempt to decompile or reverse engineer any software contained on CraftFolio's website;</li>
                                <li>remove any copyright or other proprietary notations from the materials; or</li>
                                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>3. Disclaimer</h2>
                            <p>
                                The materials on CraftFolio's website are provided on an 'as is' basis. CraftFolio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>4. Limitations</h2>
                            <p>
                                In no event shall CraftFolio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CraftFolio's website, even if CraftFolio or a CraftFolio authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>5. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
