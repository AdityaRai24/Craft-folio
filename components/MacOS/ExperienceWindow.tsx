"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Edit2 } from "lucide-react";
import { ColorTheme } from "@/lib/colorThemes";
import { useUser } from "@clerk/nextjs";
import { shouldShowEditButtons } from "@/components/EditButton";
import { setCurrentEdit } from "@/slices/editModeSlice";

const ExperienceWindow = ({ theme = "light", portfolioId }: { theme?: "light" | "dark"; portfolioId?: string }) => {
    const isDark = theme === "dark";
    const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
    const experienceData = portfolioData?.find((item: any) => item.type === "experience")?.data || [];

    const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
    const { user, isLoaded } = useUser();
    const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);
    const currentlyEditing = useSelector((state: RootState) => state.editMode.currentlyEditing);
    const dispatch = useDispatch();
    const isEditing = currentlyEditing === "experience";

    return (
        <div className={`w-full h-full flex flex-col ${isDark ? "bg-gray-900" : "bg-gray-50"} relative`}>
            {/* Header Actions */}
            {showEdit && !isEditing && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => dispatch(setCurrentEdit("experience"))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-white`}
                        style={{
                            background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                        }}
                        title="Edit Experience"
                    >
                        <Edit2 size={14} />
                        <span>Edit</span>
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                            Work Experience
                        </h1>
                        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            My professional journey and career highlights
                        </p>
                    </div>

                    {experienceData.length > 0 ? (
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {experienceData.map((exp: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                >
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <Briefcase size={18} />
                                    </div>

                                    {/* Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-4">
                                            <div>
                                                <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                                                    {exp.role}
                                                </h3>
                                                <div className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                                                    {exp.companyName}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start sm:items-end gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {exp.location}
                                                </span>
                                            </div>
                                        </div>

                                        <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                            {exp.description}
                                        </p>

                                        {exp.techStack && exp.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                {exp.techStack.map((tech: any, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className={`text-xs px-2 py-1 rounded-md ${isDark
                                                                ? "bg-gray-700 text-gray-300"
                                                                : "bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        {typeof tech === 'string' ? tech : tech.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-gray-800 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
                                <Briefcase size={32} />
                            </div>
                            <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                                No Experience Added
                            </h3>
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                Add your work experience to showcase your professional journey.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceWindow;
