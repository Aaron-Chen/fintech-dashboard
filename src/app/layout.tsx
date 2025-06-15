"use client";

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { MdNotificationsNone, MdSettings, MdAttachMoney, MdAutoGraph, MdDescription, MdStars, MdAccountBalanceWallet, MdLogout, MdClose, MdEmail, MdArrowForward } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
  sidebarLogoPadding?: string;
}

export default function RootLayout({
  children,
  sidebarLogoPadding = "px-1",
}: RootLayoutProps) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [activeTitle, setActiveTitle] = useState("Dashboard");
  const [displayTitle, setDisplayTitle] = useState("Dashboard");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLoadingVideo, setShowLoadingVideo] = useState(true);
  const [isVideoFading, setIsVideoFading] = useState(false);

  const scrambleText = (finalText: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const iterations = 15;
    let iteration = 0;
    
    const interval = setInterval(() => {
      setDisplayTitle(prev => 
        finalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return finalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= finalText.length) {
        clearInterval(interval);
        setDisplayTitle(finalText);
        setIsAnimating(false);
      }
      
      iteration += 1 / 2;
    }, 50);
  };

  const handleTitleChange = (newTitle: string) => {
    if (newTitle !== activeTitle && !isAnimating) {
      setActiveTitle(newTitle);
      scrambleText(newTitle);
    }
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsWalletModalOpen(false);
      setIsModalClosing(false);
    }, 400); // Match the animation duration
  };

  const handleVideoEnd = () => {
    setIsVideoFading(true);
    setTimeout(() => {
      setShowLoadingVideo(false);
    }, 500); // Fade duration
  };

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1A1A20]`}>
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <aside className="w-[300px] bg-white/10 backdrop-blur-lg border-r border-r-white border-r-[1px] h-screen sticky top-0 z-20 flex flex-col items-center pt-8 shadow-[4px_0_16px_0_rgba(255,255,255,0.3)]">
            {/* Logos at the top, arranged horizontally */}
            <div className={`flex flex-row items-center gap-2 mb-8 w-full ${sidebarLogoPadding}`}>
              <div className="flex items-center gap-4 ml-5">
                <Image src="/getaxal_logo.png" alt="GetAxal Logo" width={55} height={55} className="object-contain" priority />
                <Image src="/frame-logo.png" alt="Frame Logo" width={130} height={48} className="object-contain" priority />
              </div>
            </div>
            {/* Sidebar navigation */}
            <nav className="flex flex-col gap-4 w-full mt-8 px-8" style={{ fontFamily: 'Jura, sans-serif' }}>
              <button onClick={() => handleTitleChange("Dashboard")} className={`sidebar-option flex items-center gap-5 text-white text-2xl font-semibold hover:bg-gray-600/30 rounded-lg px-4 py-4 transition-all duration-300 ease-in-out -mx-4 ${activeTitle === "Dashboard" ? "bg-gray-600/20" : ""}`}>
                <div className="sidebar-content flex items-center gap-5">
                  <span className="inline-flex justify-center items-center" style={{ width: 36 }}><MdAttachMoney size={28} /></span>
                  Dashboard
                </div>
              </button>
              <button onClick={() => handleTitleChange("Strategies")} className={`sidebar-option flex items-center gap-5 text-white text-2xl font-semibold hover:bg-gray-600/30 rounded-lg px-4 py-4 transition-all duration-300 ease-in-out -mx-4 ${activeTitle === "Strategies" ? "bg-gray-600/20" : ""}`}>
                <div className="sidebar-content flex items-center gap-5">
                  <span className="inline-flex justify-center items-center" style={{ width: 36 }}><MdAutoGraph size={28} /></span>
                  Strategies
                </div>
              </button>
              <button onClick={() => handleTitleChange("Docs")} className={`sidebar-option flex items-center gap-5 text-white text-2xl font-semibold hover:bg-gray-600/30 rounded-lg px-4 py-4 transition-all duration-300 ease-in-out -mx-4 ${activeTitle === "Docs" ? "bg-gray-600/20" : ""}`}>
                <div className="sidebar-content flex items-center gap-5">
                  <span className="inline-flex justify-center items-center" style={{ width: 36 }}><MdDescription size={28} /></span>
                  Docs
                </div>
              </button>
              <button onClick={() => handleTitleChange("Points")} className={`sidebar-option flex items-center gap-5 text-white text-2xl font-semibold hover:bg-gray-600/30 rounded-lg px-4 py-4 transition-all duration-300 ease-in-out -mx-4 ${activeTitle === "Points" ? "bg-gray-600/20" : ""}`}>
                <div className="sidebar-content flex items-center gap-5">
                  <span className="inline-flex justify-center items-center" style={{ width: 36 }}><MdStars size={28} /></span>
                  Points
                </div>
              </button>
            </nav>
            
            {/* Log out at the bottom */}
            <div className="mt-auto mb-8 w-full px-8">
              <a href="#" className="sidebar-option flex items-center gap-5 text-white text-2xl font-semibold hover:bg-gray-600/30 rounded-lg px-4 py-4 transition-all duration-300 ease-in-out -mx-4" style={{ fontFamily: 'Jura, sans-serif' }}>
                <div className="sidebar-content flex items-center gap-5">
                  <span className="inline-flex justify-center items-center" style={{ width: 36 }}><MdLogout size={28} /></span>
                  Log out
                </div>
              </a>
            </div>
          </aside>
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top bar */}
            <header className="h-[107px] w-full bg-black border-b border-b-white border-b-[1px] flex items-center px-8 sticky top-0 z-10 justify-between shadow-[0_4px_16px_0_rgba(255,255,255,0.3)]">
              {/* Left: Dashboard text */}
              <span className="text-white text-4xl font-extralight flex items-center h-full" style={{ fontFamily: 'Jura, sans-serif', fontWeight: 200 }}>{displayTitle}</span>
              {/* Right: Notification, Settings, and Wallet Button */}
              <div className="flex items-center gap-8 pr-2">
                {/* Notification Icon */}
                <button className="w-[44px] h-[44px] flex items-center justify-center text-white hover:bg-white/10 rounded-full transition bell-hover">
                  <MdNotificationsNone size={36} className="bell-icon" />
                </button>
                {/* Settings Icon */}
                <button className="w-[44px] h-[44px] flex items-center justify-center text-white hover:bg-white/10 rounded-full transition settings-hover">
                  <MdSettings size={36} className="settings-icon" />
                </button>
                {/* Wallet Button (Figma style) */}
                <button 
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center gap-8 px-8 py-4 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-xl shadow-lg hover:bg-white/20 transition wallet-hover"
                >
                  <MdAccountBalanceWallet size={32} className="wallet-icon" />
                  Connect to Wallet
                </button>
              </div>
            </header>
            <main className="flex-1 p-8 w-full relative">
              {/* Loading Video */}
              {showLoadingVideo && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black z-10 transition-opacity duration-500 ${isVideoFading ? 'opacity-0' : 'opacity-100'}`}>
                  <video
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    className="w-96 h-96 object-contain"
                  >
                    <source src="/loading-sequence.mp4" type="video/mp4" />
                  </video>
                </div>
              )}
              {children}
            </main>
          </div>
        </div>

        {/* Wallet Connection Modal */}
        {isWalletModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div 
              className={`bg-black/90 backdrop-blur-lg border-[1px] border-white/30 rounded-3xl p-8 w-[480px] max-w-[90vw] relative shadow-[0_0_20px_rgba(255,255,255,0.2)] ${isModalClosing ? 'modal-hide' : 'modal-reveal'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition"
              >
                <MdClose size={24} />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-white text-2xl font-semibold mb-6">Connect to Axal</h2>
                <div className="flex justify-center mb-4">
                  <Image 
                    src="/axal1.png" 
                    alt="Axal Logo" 
                    width={128} 
                    height={128} 
                    className="object-contain"
                  />
                </div>
                <p className="text-white/80 text-lg" style={{ fontFamily: 'Jura, sans-serif' }}>
                  Ready to park your dollars in the best place?
                </p>
              </div>

              {/* Connection Options */}
              <div className="space-y-4">
                {/* MetaMask */}
                <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Image 
                        src="/MetaMask_Fox.png" 
                        alt="MetaMask Fox" 
                        width={20} 
                        height={20} 
                        className="object-contain"
                      />
                    </div>
                    <span className="text-white text-lg font-medium">MetaMask</span>
                  </div>
                  <span className="text-white/40 text-sm bg-white/10 px-3 py-1 rounded-lg">Recent</span>
                </button>

                {/* Email Input */}
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition pl-12"
                  />
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition">
                    Submit
                  </button>
                </div>

                {/* Google */}
                <button className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
                  <FaGoogle className="text-white" size={20} />
                  <span className="text-white text-lg font-medium">Google</span>
                </button>

                {/* Continue with wallet */}
                <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-white/40 rounded-lg flex items-center justify-center">
                      <MdAccountBalanceWallet className="text-white/60" size={16} />
                    </div>
                    <span className="text-white text-lg font-medium">Continue with a wallet</span>
                  </div>
                  <MdArrowForward className="text-white/40 group-hover:text-white transition" size={20} />
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-white/40 text-sm">
                  By logging in I agree to the <span className="text-white/60">Terms</span> & <span className="text-white/60">Privacy Policy</span>
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-white/40 text-sm">Protected by</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <span className="text-white font-semibold">privy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
