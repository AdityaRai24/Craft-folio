"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useCustomization } from "@/hooks/useCustomization";
import { defaultAcademicStyles } from "@/types/academic";

const Contact = ({ portfolioId }: { portfolioId: string }) => {
    const { portfolioData } = useSelector((state: RootState) => state.data);
    const [contactData, setContactData] = useState<any>(null);
    const { effectiveCustomization } = useCustomization("section", defaultAcademicStyles.section, portfolioId);

    useEffect(() => {
        if (portfolioData) {
            const contactSection = portfolioData.find((item: any) => item.type === "contact");
            if (contactSection && contactSection.data) {
                setContactData(contactSection.data);
            }
        }
    }, [portfolioData]);

    if (!contactData) return null;

    return (
        <section
            id="contact"
            className="px-8 md:px-16 lg:px-24 py-20 border-t bg-gray-50"
            style={{
                borderColor: effectiveCustomization.borderColor || "#e2e8f0",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl"
            >
                <h2
                    className="text-3xl font-bold mb-10"
                    style={{
                        color: effectiveCustomization.headingColor || "#1a202c",
                        fontFamily: "Merriweather, serif",
                    }}
                >
                    Contact
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {contactData.description || "I am always open to discussing new research collaborations and opportunities."}
                        </p>

                        <div className="space-y-4 mt-6">
                            {contactData.email && (
                                <a href={`mailto:${contactData.email}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                                    <Mail size={20} />
                                    <span>{contactData.email}</span>
                                </a>
                            )}
                            {contactData.location && (
                                <div className="flex items-center gap-3 text-gray-700">
                                    <MapPin size={20} />
                                    <span>{contactData.location}</span>
                                </div>
                            )}
                            {contactData.phone && (
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Phone size={20} />
                                    <span>{contactData.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                        {/* Simple form placeholder or additional info */}
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Get in Touch</h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Please feel free to reach out via email for any inquiries.
                        </p>
                        <a
                            href={`mailto:${contactData.email}`}
                            className="inline-block w-full text-center bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Send Email
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Contact;
