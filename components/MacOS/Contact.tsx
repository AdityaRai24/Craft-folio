"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import EditButton, { shouldShowEditButtons } from "@/components/EditButton";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

const Contact = ({
  currentPortTheme,
  customCSS,
  portfolioId,
  theme = "light",
}: {
  currentPortTheme?: string;
  customCSS?: string;
  portfolioId?: string;
  theme?: "light" | "dark";
}) => {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const portfolioData = useSelector((state: RootState) => state.data.portfolioData);
  const portfolioUserId = useSelector((state: RootState) => state.data.portfolioUserId);
  const currentlyEditing = useSelector((state: RootState) => state.editMode.currentlyEditing);
  
  const userInfoData = portfolioData?.find((item: any) => item.type === "userInfo")?.data || {};
  const showEdit = shouldShowEditButtons(portfolioUserId, user, isLoaded);
  const isEditing = currentlyEditing === "userInfo";

  const [editedData, setEditedData] = useState(userInfoData);
  const isDark = theme === "dark";

  useEffect(() => {
    setEditedData(userInfoData);
  }, [userInfoData]);

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: userInfoData.github,
      color: isDark ? "from-gray-800 to-gray-900" : "from-gray-900 to-gray-800",
      hoverColor: isDark ? "hover:from-gray-700 hover:to-gray-800" : "hover:from-gray-800 hover:to-gray-700",
      iconBg: isDark ? "bg-gray-700" : "bg-gray-800",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: userInfoData.linkedin,
      color: isDark ? "from-blue-700 to-blue-800" : "from-blue-600 to-blue-700",
      hoverColor: isDark ? "hover:from-blue-600 hover:to-blue-700" : "hover:from-blue-500 hover:to-blue-600",
      iconBg: isDark ? "bg-blue-600" : "bg-blue-500",
    },
    {
      name: "Email",
      icon: Mail,
      url: userInfoData.email ? `mailto:${userInfoData.email}` : null,
      color: isDark ? "from-red-600 to-red-700" : "from-red-500 to-red-600",
      hoverColor: isDark ? "hover:from-red-500 hover:to-red-600" : "hover:from-red-400 hover:to-red-500",
      iconBg: isDark ? "bg-red-600" : "bg-red-500",
    },
  ].filter((link) => link.url);

  return (
    <div className={`w-full h-full ${isDark ? "bg-gray-800" : "bg-white"} overflow-y-auto`}>
      <div className="max-w-5xl mx-auto p-8">
        {showEdit && (
          <div className="absolute top-4 right-4">
            <EditButton sectionName="userInfo" />
          </div>
        )}

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} border rounded-xl p-8 shadow-sm space-y-5`}
          >
            <div>
              <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-2`}>GitHub</label>
              <input
                type="url"
                value={editedData.github || ""}
                onChange={(e) => setEditedData({ ...editedData, github: e.target.value })}
                placeholder="https://github.com/username"
                className={`w-full ${isDark ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"} border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-2`}>LinkedIn</label>
              <input
                type="url"
                value={editedData.linkedin || ""}
                onChange={(e) => setEditedData({ ...editedData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className={`w-full ${isDark ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"} border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-2`}>Email</label>
              <input
                type="email"
                value={editedData.email || ""}
                onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                placeholder="your.email@example.com"
                className={`w-full ${isDark ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"} border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className={`text-4xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-3`}>
                Get In Touch
              </h1>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
                Let's connect and build something amazing
              </p>
            </motion.div>

            {socialLinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={index}
                      href={link.url || "#"}
                      target={link.url?.startsWith("http") ? "_blank" : undefined}
                      rel={link.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${link.color} ${link.hoverColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center gap-6 group relative overflow-hidden`}
                    >
                      {/* Decorative background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Icon container */}
                      <div className={`${link.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      
                      {/* Label */}
                      <span className="text-white text-xl font-bold relative z-10">
                        {link.name}
                      </span>
                      
                      {/* External link indicator */}
                      {link.url?.startsWith("http") && (
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={16} className="text-white/80" />
                        </div>
                      )}
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className={`w-24 h-24 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center mb-6`}>
                  <Mail size={40} className={isDark ? "text-gray-400" : "text-gray-400"} />
                </div>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg font-medium`}>
                  No contact information available
                </p>
                <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm mt-2`}>
                  Add your contact details to get started
                </p>
              </div>
            )}

            {userInfoData.email && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm mb-3`}>
                  Or reach me directly at
                </p>
                <a
                  href={`mailto:${userInfoData.email}`}
                  className={`inline-block ${isDark ? "text-white hover:text-blue-400 bg-gray-700 hover:bg-gray-600 border-gray-600" : "text-gray-900 hover:text-blue-600 bg-gray-50 hover:bg-gray-100 border-gray-200"} text-lg font-medium transition-colors px-6 py-3 rounded-xl border hover:border-gray-300`}
                >
                  {userInfoData.email}
                </a>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;
