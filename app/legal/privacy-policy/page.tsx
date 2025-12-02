"use client";
import React from "react";
import MainNavbar from "@/components/Shared/MainNavbar";
import { ColorTheme } from "@/lib/colorThemes";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: ColorTheme.bgMain }}>
            <MainNavbar />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8" style={{ color: ColorTheme.textPrimary }}>
                        Privacy Policy
                    </h1>
                    <div className="space-y-6 text-lg" style={{ color: ColorTheme.textSecondary }}>
                        <p>Last updated: December 2025</p>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>1. Introduction</h2>
                            <p>
                                Welcome to CraftFolio. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>2. Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Identity Data includes first name, last name, username or similar identifier.</li>
                                <li>Contact Data includes email address and telephone numbers.</li>
                                <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                                <li>Usage Data includes information about how you use our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: support@craftfolio.live
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
