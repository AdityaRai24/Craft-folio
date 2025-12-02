"use client";
import React from "react";
import MainNavbar from "@/components/Shared/MainNavbar";
import { ColorTheme } from "@/lib/colorThemes";

const RefundPolicy = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: ColorTheme.bgMain }}>
            <MainNavbar />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8" style={{ color: ColorTheme.textPrimary }}>
                        Refund Policy
                    </h1>
                    <div className="space-y-6 text-lg" style={{ color: ColorTheme.textSecondary }}>
                        <p>Last updated: December 2025</p>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>1. General Policy</h2>
                            <p>
                                At CraftFolio, we strive to provide the best possible service to our users. However, we understand that there may be circumstances where you may require a refund. This policy outlines the conditions under which refunds may be granted.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>2. Eligibility for Refunds</h2>
                            <p>
                                Refunds are generally considered under the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Technical issues that prevent you from using the core features of our service, which we are unable to resolve within a reasonable timeframe.</li>
                                <li>Billing errors where you have been charged incorrectly.</li>
                                <li>Requests made within 7 days of the initial purchase, provided the service has not been significantly utilized.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>3. Non-Refundable Items</h2>
                            <p>
                                The following are generally non-refundable:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Custom domain purchases or registrations handled through third parties.</li>
                                <li>Services that have been fully rendered or utilized.</li>
                                <li>Requests made after 7 days of the initial purchase.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>4. How to Request a Refund</h2>
                            <p>
                                To request a refund, please contact our support team at support@craftfolio.live with your order details and the reason for the request. We will review your request and notify you of the approval or rejection of your refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4" style={{ color: ColorTheme.textPrimary }}>5. Processing of Refunds</h2>
                            <p>
                                If your refund is approved, it will be processed, and a credit will automatically be applied to your original method of payment within a certain amount of days, depending on your card issuer's policies.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
