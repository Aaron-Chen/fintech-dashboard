"use client";

import { MdCalendarToday, MdTrendingUp, MdAccountBalance, MdBarChart, MdSearch, MdArrowOutward, MdAccountBalanceWallet, MdArrowBack, MdMenuBook, MdArrowForward } from "react-icons/md";
import Image from "next/image";
import { useState, useEffect } from "react";

interface DashboardPageProps {
  onWalletModalOpen?: () => void;
  showLoadingVideo?: boolean;
  isWalletConnected?: boolean;
}

export default function DashboardPage({ 
  onWalletModalOpen,
  showLoadingVideo = false,
  isWalletConnected = false
}: DashboardPageProps) {
  // Debug: Log what props are being received
  console.log('DashboardPage received isWalletConnected:', isWalletConnected);

  const [balance, setBalance] = useState(8992.98);
  const [performanceTab, setPerformanceTab] = useState("Performance");
  const [investingTab, setInvestingTab] = useState("Conservative");
  const [strategiesTab, setStrategiesTab] = useState("Strategies");
  const [strategiesFilter, setStrategiesFilter] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [animatingDigit, setAnimatingDigit] = useState<number | null>(null);
  const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null);
  const [hoveredPerformanceLine, setHoveredPerformanceLine] = useState<string | null>(null);
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);
  const [chartHover, setChartHover] = useState<{x: number, date: string, values: {conservative: number, balanced: number, aggressive: number}} | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSecondExplanation, setShowSecondExplanation] = useState(false);
  const [showThirdExplanation, setShowThirdExplanation] = useState(false);

  // Strategy data - always use disconnected state initially to match server render
  const strategies = {
    total: { amount: isWalletConnected && isClient ? "8,992.98" : "------", percentage: isWalletConnected && isClient ? "100" : "---" },
    conservative: { amount: isWalletConnected && isClient ? "4,946.14" : "------", percentage: isWalletConnected && isClient ? "55" : "--" },
    balanced: { amount: isWalletConnected && isClient ? "2,248.25" : "------", percentage: isWalletConnected && isClient ? "25" : "--" },
    aggressive: { amount: isWalletConnected && isClient ? "1,798.59" : "------", percentage: isWalletConnected && isClient ? "20" : "--" }
  };

  // Get current display values based on hover state
  const currentData = hoveredStrategy ? strategies[hoveredStrategy as keyof typeof strategies] : strategies.total;

  // Handle legend hover
  const handleLegendHover = (strategy: string | null) => {
    setHoveredStrategy(strategy);
  };

  // Handle performance legend hover
  const handlePerformanceLegendHover = (line: string | null) => {
    setHoveredPerformanceLine(line);
  };

  // Handle protocol hover
  const handleProtocolHover = (protocol: string | null) => {
    setHoveredProtocol(protocol);
  };

  // Sample chart data points for the performance chart - static paths with more variation
  const aggressivePath = "M 0 112.5 L 8.47 98.2 L 16.95 125.8 L 25.42 85.1 L 33.9 95.7 L 42.37 68.3 L 50.85 112.9 L 59.32 75.1 L 67.8 58.6 L 76.27 92.4 L 84.75 48.9 L 93.22 105.2 L 101.7 39.8 L 110.17 83.5 L 118.64 28.1 L 127.12 91.7 L 135.59 15.3 L 144.07 78.9 L 152.54 32.4 L 161.02 95.8 L 169.49 19.2 L 177.97 82.6 L 186.44 6.1 L 194.92 89.7 L 203.39 23.2 L 211.86 96.8 L 220.34 10.4 L 228.81 103.9 L 237.29 17.5 L 245.76 91.1 L 254.24 4.6 L 262.71 88.2 L 271.19 31.8 L 279.66 95.3 L 288.14 18.9 L 296.61 82.5 L 305.08 36.0 L 313.56 92.4 L 322.03 28.8 L 330.51 85.3 L 338.98 41.7 L 347.46 98.1 L 355.93 54.6 L 364.41 91.0 L 372.88 67.4 L 381.36 103.9 L 389.83 80.3 L 398.31 96.7 L 406.78 73.2 L 415.25 89.6 L 423.73 66.0 L 432.2 82.5 L 440.68 58.9 L 449.15 75.3 L 457.63 51.8 L 466.1 68.2 L 474.58 44.6 L 483.05 61.1 L 491.53 37.5 L 500 53.9";
  
  const balancedPath = "M 0 112.5 L 8.47 108.2 L 16.95 115.1 L 25.42 104.8 L 33.9 111.5 L 42.37 98.2 L 50.85 104.9 L 59.32 91.6 L 67.8 98.3 L 76.27 85.0 L 84.75 91.7 L 93.22 78.4 L 101.7 85.1 L 110.17 71.8 L 118.64 78.5 L 127.12 65.2 L 135.59 71.9 L 144.07 58.6 L 152.54 65.3 L 161.02 52.0 L 169.49 58.7 L 177.97 45.4 L 186.44 52.1 L 194.92 38.8 L 203.39 45.5 L 211.86 32.2 L 220.34 38.9 L 228.81 25.6 L 237.29 32.3 L 245.76 19.0 L 254.24 25.7 L 262.71 12.4 L 271.19 19.1 L 279.66 5.8 L 288.14 12.5 L 296.61 26.2 L 305.08 19.9 L 313.56 33.6 L 322.03 27.9 L 330.51 41.2 L 338.98 35.5 L 347.46 48.8 L 355.93 43.1 L 364.41 56.4 L 372.88 50.7 L 381.36 64.0 L 389.83 58.3 L 398.31 71.6 L 406.78 65.9 L 415.25 79.2 L 423.73 73.5 L 432.2 86.8 L 440.68 81.1 L 449.15 94.4 L 457.63 88.7 L 466.1 102.0 L 474.58 96.3 L 483.05 109.6 L 491.53 103.9 L 500 117.2";
  
  const conservativePath = "M 0 127.5 L 8.47 125.8 L 16.95 129.1 L 25.42 123.4 L 33.9 126.7 L 42.37 121.0 L 50.85 124.3 L 59.32 118.6 L 67.8 121.9 L 76.27 116.2 L 84.75 119.5 L 93.22 113.8 L 101.7 117.1 L 110.17 111.4 L 118.64 114.7 L 127.12 109.0 L 135.59 112.3 L 144.07 106.6 L 152.54 109.9 L 161.02 104.2 L 169.49 107.5 L 177.97 101.8 L 186.44 105.1 L 194.92 99.4 L 203.39 102.7 L 211.86 97.0 L 220.34 100.3 L 228.81 94.6 L 237.29 97.9 L 245.76 92.2 L 254.24 95.5 L 262.71 89.8 L 271.19 93.1 L 279.66 87.4 L 288.14 90.7 L 296.61 85.0 L 305.08 88.3 L 313.56 82.6 L 322.03 85.9 L 330.51 80.2 L 338.98 83.5 L 347.46 77.8 L 355.93 81.1 L 364.41 75.4 L 372.88 78.7 L 381.36 73.0 L 389.83 76.3 L 398.31 70.6 L 406.78 73.9 L 415.25 68.2 L 423.73 71.5 L 432.2 65.8 L 440.68 69.1 L 449.15 63.4 L 457.63 66.7 L 466.1 61.0 L 474.58 64.3 L 483.05 58.6 L 491.53 61.9 L 500 56.2";

  // Chart data points extracted from actual SVG path coordinates
  const chartDataPoints = [
    // x=0: aggressive=112.5, balanced=112.5, conservative=127.5
    { x: 0, date: "01/01", aggressive: ((150-112.5)/150)*100, balanced: ((150-112.5)/150)*100, conservative: ((150-127.5)/150)*100 },
    // Interpolated points at even intervals matching X-axis labels
    { x: 38.46, date: "01/22", aggressive: ((150-105)/150)*100, balanced: ((150-110)/150)*100, conservative: ((150-125)/150)*100 },
    { x: 76.92, date: "02/12", aggressive: ((150-95)/150)*100, balanced: ((150-105)/150)*100, conservative: ((150-122)/150)*100 },
    { x: 115.38, date: "03/04", aggressive: ((150-85)/150)*100, balanced: ((150-100)/150)*100, conservative: ((150-120)/150)*100 },
    { x: 153.85, date: "03/25", aggressive: ((150-75)/150)*100, balanced: ((150-95)/150)*100, conservative: ((150-118)/150)*100 },
    { x: 192.31, date: "04/15", aggressive: ((150-65)/150)*100, balanced: ((150-90)/150)*100, conservative: ((150-115)/150)*100 },
    { x: 230.77, date: "05/06", aggressive: ((150-55)/150)*100, balanced: ((150-85)/150)*100, conservative: ((150-113)/150)*100 },
    { x: 269.23, date: "05/27", aggressive: ((150-45)/150)*100, balanced: ((150-80)/150)*100, conservative: ((150-110)/150)*100 },
    { x: 307.69, date: "06/17", aggressive: ((150-35)/150)*100, balanced: ((150-75)/150)*100, conservative: ((150-108)/150)*100 },
    { x: 346.15, date: "07/08", aggressive: ((150-25)/150)*100, balanced: ((150-70)/150)*100, conservative: ((150-105)/150)*100 },
    { x: 384.62, date: "07/29", aggressive: ((150-15)/150)*100, balanced: ((150-65)/150)*100, conservative: ((150-103)/150)*100 },
    { x: 423.08, date: "08/19", aggressive: ((150-10)/150)*100, balanced: ((150-60)/150)*100, conservative: ((150-100)/150)*100 },
    { x: 461.54, date: "09/09", aggressive: ((150-5)/150)*100, balanced: ((150-55)/150)*100, conservative: ((150-98)/150)*100 },
    { x: 500, date: "09/30", aggressive: ((150-53.9)/150)*100, balanced: ((150-117.2)/150)*100, conservative: ((150-56.2)/150)*100 }
  ];

  // Handle chart mouse movement
  const handleChartMouseMove = (event: React.MouseEvent<SVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 500; // Scale to SVG viewBox width
    
    // Find closest data point
    let closestPoint = chartDataPoints[0];
    let minDistance = Math.abs(x - closestPoint.x);
    
    for (const point of chartDataPoints) {
      const distance = Math.abs(x - point.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    
    setChartHover({
      x: closestPoint.x,
      date: closestPoint.date,
      values: {
        conservative: closestPoint.conservative,
        balanced: closestPoint.balanced,
        aggressive: closestPoint.aggressive
      }
    });
  };

  // Handle chart mouse leave
  const handleChartMouseLeave = () => {
    setChartHover(null);
  };

  // Fix hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset explanation view when wallet disconnects
  useEffect(() => {
    if (!isWalletConnected) {
      setShowExplanation(false);
      setShowSecondExplanation(false);
      setShowThirdExplanation(false);
    }
  }, [isWalletConnected]);

  // Dynamic balance counter with animation
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setBalance(prev => {
        const newBalance = prev + 0.01;
        
        // Trigger digit animation for the last digit
        const lastDigit = Math.floor((newBalance * 100) % 10);
        setAnimatingDigit(lastDigit);
        setTimeout(() => setAnimatingDigit(null), 600);
        
        return newBalance;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient) {
    // Server-side render with static values - always show disconnected state
    return (
      <div className="text-white w-full relative">
        {/* Black overlay - always visible on server render */}
        <div className="fixed inset-0 top-[107px] left-[300px] bg-black/60 backdrop-blur-sm z-40 pointer-events-none">
          {/* Overlay content - only show axal cards view */}
          <div className="flex flex-col items-center justify-center h-full px-8 relative">
            <div className="flex flex-col items-center">
              <h2 
                className="text-white text-4xl font-medium mb-8 text-center" 
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                Connect with your wallet to start earning!
              </h2>
              <Image 
                src="/axalcards.png" 
                alt="Axal Cards" 
                width={600} 
                height={450} 
                className="object-contain mb-8"
                priority
              />
              <button
                className="flex items-center gap-4 px-8 py-4 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-xl shadow-lg hover:bg-white/20 transition pointer-events-auto mb-4"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                <MdAccountBalanceWallet size={32} />
                Connect with your wallet
              </button>
              <button
                className="text-white text-base underline hover:text-white/80 transition pointer-events-auto"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                How does this work?
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-white text-3xl font-medium" style={{ fontFamily: 'Jura, sans-serif' }}>
                    Wallet Balance
                  </h2>
                </div>
                <button className="text-white/60 hover:text-white transition p-2">
                  <Image 
                    src="/download-icon.svg" 
                    alt="Download" 
                    width={24} 
                    height={24} 
                    className="filter brightness-0 invert opacity-60 hover:opacity-100 transition"
                  />
                </button>
              </div>
              <div className="mb-6">
                <h1 className="text-white text-8xl font-light mb-4" style={{ fontFamily: 'Jura, sans-serif' }}>
                  $------
                </h1>
                <div className="flex items-center justify-between">
                  <span className="text-white text-2xl font-medium" style={{ fontFamily: 'Jura, sans-serif' }}>
                    +$--- (<span className="text-white/40">---%</span>)
                  </span>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-2xl" style={{ fontFamily: 'Jura, sans-serif' }}>Jun 1 to July 31 2025</span>
                    <button className="text-white/60 hover:text-white transition p-2">
                      <MdCalendarToday size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#181717] border border-white/20 rounded-2xl p-6 h-80">
              <p className="text-white/60 text-lg">Connect wallet to view performance</p>
            </div>
          </div>
          <div className="bg-[#181717] border border-white/20 rounded-2xl p-6 h-full">
            <p className="text-white/60 text-lg">Connect wallet to view investing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white w-full relative">
      {/* Black overlay when wallet not connected - smooth transition */}
      <div 
        className={`fixed inset-0 top-[107px] left-[300px] bg-black/60 backdrop-blur-sm z-40 pointer-events-none transition-opacity duration-300 ${
          !isWalletConnected ? 'opacity-100' : 'opacity-0'
        }`} 
      >
        {/* Overlay content - text and image */}
        <div className="flex flex-col items-center justify-center h-full px-8 relative overflow-hidden">
          {/* Connect view */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${showExplanation ? 'transform -translate-x-full pointer-events-none' : 'transform translate-x-0'}`}>
            <h2 
              className="text-white text-4xl font-medium mb-8 text-center" 
              style={{ fontFamily: 'Jura, sans-serif' }}
            >
              Connect with your wallet to start earning!
            </h2>
            <Image 
              src="/axalcards.png" 
              alt="Axal Cards" 
              width={600} 
              height={450} 
              className="object-contain mb-8"
              priority
            />
            <button
              onClick={onWalletModalOpen}
              className="flex items-center gap-4 px-8 py-4 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-xl shadow-lg hover:bg-white/20 transition pointer-events-auto mb-4"
              style={{ fontFamily: 'Jura, sans-serif' }}
            >
              <MdAccountBalanceWallet size={32} />
              Connect with your wallet
            </button>
            <button
              onClick={() => setShowExplanation(true)}
              className="text-white text-base underline hover:text-white/80 transition pointer-events-auto"
              style={{ fontFamily: 'Jura, sans-serif' }}
            >
              How does this work?
            </button>
          </div>

          {/* Explanation view */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out overflow-hidden ${!showExplanation ? 'transform translate-x-full pointer-events-none' : 'transform translate-x-0'}`}>
            {/* First explanation page */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${showSecondExplanation || showThirdExplanation ? 'transform -translate-x-full pointer-events-none' : 'transform translate-x-0'}`}>
              {/* Back button */}
              <button
                onClick={() => setShowExplanation(false)}
                className="absolute top-12 left-8 flex items-center gap-2 text-white/60 hover:text-white transition pointer-events-auto z-50"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                <MdArrowBack size={48} />
                <span className="text-3xl">Back</span>
              </button>

              {/* Next button */}
              <button
                onClick={() => setShowSecondExplanation(true)}
                className="absolute top-12 right-8 flex items-center gap-2 text-white/60 hover:text-white transition pointer-events-auto z-50"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                <span className="text-3xl">Next</span>
                <MdArrowForward size={48} />
              </button>

              {/* Explanation content */}
              <div className="flex flex-col items-center">
                <h2 
                  className="text-white text-4xl font-medium -mb-25 text-center" 
                  style={{ fontFamily: 'Jura, sans-serif' }}
                >
                  How does Axal work?
                </h2>
                <Image 
                  src="/axal1.png" 
                  alt="Axal Logo" 
                  width={300} 
                  height={300} 
                  className="object-contain -mb-20"
                  priority
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="max-w-2xl text-center space-y-4 mb-8">
                  <p 
                    className="text-white text-lg leading-relaxed" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Axal leverages verifiable agents built on blockchain infrastructure to ensure complete transparency and security. Every transaction is cryptographically verified, eliminating counterparty risk while maximizing your earning potential across DeFi protocols.
                  </p>
                </div>
                
                {/* Financial Disclaimer */}
                <div className="max-w-2xl text-center mb-6">
                  <p 
                    className="text-white/40 text-xs leading-relaxed border-t border-white/10 pt-4" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <strong>Financial Disclaimer:</strong> All investments involve risk and may result in loss. Past performance does not guarantee future results. DeFi protocols are experimental and unregulated. Please invest responsibly and only what you can afford to lose.
                  </p>
                </div>

                <button
                  onClick={() => window.open('https://docs.getaxal.com/getting-started/', '_blank')}
                  className="flex items-center gap-4 px-8 py-4 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-xl shadow-lg hover:bg-white/20 transition pointer-events-auto"
                  style={{ fontFamily: 'Jura, sans-serif' }}
                >
                  <MdMenuBook size={32} />
                  Read the docs
                </button>
              </div>
            </div>

            {/* Second explanation page */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
              !showSecondExplanation ? 'transform translate-x-full pointer-events-none' : 
              showThirdExplanation ? 'transform -translate-x-full pointer-events-none' : 
              'transform translate-x-0'
            }`}>
              {/* Back button */}
              <button
                onClick={() => setShowSecondExplanation(false)}
                className="absolute top-12 left-8 flex items-center gap-2 text-white/60 hover:text-white transition pointer-events-auto z-50"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                <MdArrowBack size={48} />
                <span className="text-3xl">Back</span>
              </button>

              {/* Next button */}
              <button
                onClick={() => setShowThirdExplanation(true)}
                className="absolute top-12 right-8 flex items-center gap-2 text-white/60 hover:text-white transition pointer-events-auto z-50"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                <span className="text-3xl">Next</span>
                <MdArrowForward size={48} />
              </button>

              {/* Explanation content */}
              <div className="flex flex-col items-center mb-8">
                <h2 
                  className="text-white text-4xl font-medium mb-8 text-center" 
                  style={{ fontFamily: 'Jura, sans-serif' }}
                >
                  How are my funds managed?
                </h2>
                <Image 
                  src="/axal4.png" 
                  alt="Axal Logo" 
                  width={450} 
                  height={450} 
                  className="object-contain mb-8"
                  priority
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="max-w-2xl text-center space-y-4 mb-8">
                  <p 
                    className="text-white text-lg leading-relaxed" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Our smart contract architecture provides immutable execution of your chosen strategy - Conservative, Balanced, or Aggressive. All fund movements are auditable on-chain, giving you complete visibility into how your portfolio is managed and secured.
                  </p>
                </div>
                
                {/* Financial Disclaimer */}
                <div className="max-w-2xl text-center mb-6">
                  <p 
                    className="text-white/40 text-xs leading-relaxed border-t border-white/10 pt-4" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <strong>Financial Disclaimer:</strong> All investments involve risk and may result in loss. Past performance does not guarantee future results. DeFi protocols are experimental and unregulated. Please invest responsibly and only what you can afford to lose.
                  </p>
                </div>

                <button
                  onClick={onWalletModalOpen}
                  className="flex items-center gap-4 px-8 py-4 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-xl shadow-lg hover:bg-white/20 transition pointer-events-auto"
                  style={{ fontFamily: 'Jura, sans-serif' }}
                >
                  <MdAccountBalanceWallet size={32} />
                  Start Now
                </button>
              </div>
            </div>

            {/* Third explanation page */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${!showThirdExplanation ? 'transform translate-x-full pointer-events-none' : 'transform translate-x-0'}`}>
              {/* Back button */}
              <button
                onClick={() => setShowThirdExplanation(false)}
                className="absolute top-12 left-8 flex items-center gap-2 text-white/60 hover:text-white transition pointer-events-auto z-50"
                style={{ fontFamily: 'Jura, sans-serif' }}
              >
                <MdArrowBack size={48} />
                <span className="text-3xl">Back</span>
              </button>

              {/* Explanation content */}
              <div className="flex flex-col items-center mb-8">
                <h2 
                  className="text-white text-4xl font-medium mb-8 text-center" 
                  style={{ fontFamily: 'Jura, sans-serif' }}
                >
                  Is my money secure?
                </h2>
                <Image 
                  src="/axal3.png" 
                  alt="Axal Security" 
                  width={450} 
                  height={450} 
                  className="object-contain mb-8"
                  priority
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="max-w-2xl text-center space-y-4 mb-8">
                  <p 
                    className="text-white text-lg leading-relaxed" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Advanced multi-signature security and time-locked contracts protect your assets, while automated monitoring systems detect and respond to potential threats in real-time across all integrated protocols.
                  </p>
                </div>
                
                {/* Financial Disclaimer */}
                <div className="max-w-2xl text-center mb-6">
                  <p 
                    className="text-white/40 text-xs leading-relaxed border-t border-white/10 pt-4" 
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <strong>Financial Disclaimer:</strong> All investments involve risk and may result in loss. Past performance does not guarantee future results. DeFi protocols are experimental and unregulated. Please invest responsibly and only what you can afford to lose.
                  </p>
                </div>

                <button
                  onClick={onWalletModalOpen}
                  className="flex items-center gap-4 px-8 py-4 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-xl shadow-lg hover:bg-white/20 transition pointer-events-auto"
                  style={{ fontFamily: 'Jura, sans-serif' }}
                >
                  <MdAccountBalanceWallet size={32} />
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Wallet Balance + Performance */}
        <div className="space-y-4 flex flex-col h-full">
          {/* Wallet Balance Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-white text-3xl font-medium" style={{ fontFamily: 'Jura, sans-serif' }}>
                  Wallet Balance
                </h2>
              </div>
              <button className="text-white/60 hover:text-white transition p-2">
                <Image 
                  src="/download-icon.svg" 
                  alt="Download" 
                  width={24} 
                  height={24} 
                  className="filter brightness-0 invert opacity-60 hover:opacity-100 transition"
                />
              </button>
            </div>
            
            {/* Balance Amount */}
            <div className="mb-4">
              <div className="text-white text-8xl font-light mb-2 -ml-2" style={{ fontFamily: 'Jura, sans-serif' }}>
                {isWalletConnected ? (
                  isClient ? (
                    <span className="inline-flex">
                      ${balance.toFixed(2).split('').map((char, index) => (
                        <span 
                          key={index} 
                          className={`inline-block relative overflow-hidden ${
                            animatingDigit !== null && index === balance.toFixed(2).length - 1 
                              ? 'animate-pulse' 
                              : ''
                          }`}
                          style={{ 
                            minWidth: char === '.' ? '0.3em' : '0.6em',
                            height: '1.2em'
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span>$8992.98</span>
                  )
                ) : (
                  <span>$------</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-2xl font-medium" style={{ fontFamily: 'Jura, sans-serif' }}>
                  {isWalletConnected ? (
                    <>+$9.8 (<span className="text-green-400">+1.7%</span>)</>
                  ) : (
                    <>+$--- (<span className="text-white/40">---%</span>)</>
                  )}
                </span>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="text-2xl" style={{ fontFamily: 'Jura, sans-serif' }}>Jun 1 to July 31 2025</span>
                  <button className="text-white/60 hover:text-white transition p-2">
                    <MdCalendarToday size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-[#181717] border border-white/20 rounded-2xl p-6 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MdTrendingUp className="text-white" size={28} />
                <h3 className="text-white text-2xl font-semibold" style={{ fontFamily: 'Jura, sans-serif' }}>
                  Performance
                </h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPerformanceTab("Performance")}
                  className={`px-4 py-2 rounded-lg text-lg border ${performanceTab === "Performance" ? "bg-white/10 text-white border-white" : "text-white/60 border-white/20 hover:border-white/40"}`}
                >
                  Performance
                </button>
                <button 
                  onClick={() => setPerformanceTab("Positions")}
                  className={`px-4 py-2 rounded-lg text-lg border ${performanceTab === "Positions" ? "bg-white/10 text-white border-white" : "text-white/60 border-white/20 hover:border-white/40"}`}
                >
                  Positions
                </button>
              </div>
            </div>
            <p className="text-white/60 mb-6 text-lg" style={{ fontFamily: 'Jura, sans-serif' }}>
              {performanceTab === "Performance" ? "Track returns over time." : "View your current positions."}
            </p>

            {/* Performance Chart */}
            <div className="flex-1 bg-black/20 rounded-lg flex flex-col justify-center mb-4 min-h-32 p-4">
              <div className="relative w-full h-40">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-white/40 text-sm">
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                </div>
                
                {/* Chart area - full width */}
                <div className="ml-8 mr-4 h-full relative">
                  {isWalletConnected ? (
                    <svg 
                      className="w-full h-full" 
                      viewBox="0 0 500 150"
                      onMouseMove={handleChartMouseMove}
                      onMouseLeave={handleChartMouseLeave}
                    >
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="50" height="37.5" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 37.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="500" height="150" fill="url(#grid)" />
                      
                      {/* Chart lines */}
                      <path 
                        d={aggressivePath} 
                        stroke="#EAB308" 
                        strokeWidth="2" 
                        fill="none"
                        opacity={hoveredPerformanceLine && hoveredPerformanceLine !== 'aggressive' ? 0.2 : 1}
                        className="transition-opacity duration-200"
                      />
                      <path 
                        d={balancedPath} 
                        stroke="#10B981" 
                        strokeWidth="2" 
                        fill="none"
                        opacity={hoveredPerformanceLine && hoveredPerformanceLine !== 'balanced' ? 0.2 : 1}
                        className="transition-opacity duration-200"
                      />
                      <path 
                        d={conservativePath} 
                        stroke="#8B5CF6" 
                        strokeWidth="2" 
                        fill="none"
                        opacity={hoveredPerformanceLine && hoveredPerformanceLine !== 'conservative' ? 0.2 : 1}
                        className="transition-opacity duration-200"
                      />
                      
                      {/* Hover line and points */}
                      {chartHover && (
                        <g>
                          {/* Vertical line */}
                          <line
                            x1={chartHover.x}
                            y1="0"
                            x2={chartHover.x}
                            y2="150"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                          
                          {/* Data points */}
                          <circle
                            cx={chartHover.x}
                            cy={150 - (chartHover.values.aggressive / 100) * 150}
                            r="4"
                            fill="#EAB308"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx={chartHover.x}
                            cy={150 - (chartHover.values.balanced / 100) * 150}
                            r="4"
                            fill="#10B981"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx={chartHover.x}
                            cy={150 - (chartHover.values.conservative / 100) * 150}
                            r="4"
                            fill="#8B5CF6"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      )}
                    </svg>
                  ) : (
                    // Empty chart state
                    <svg className="w-full h-full" viewBox="0 0 500 150">
                      <defs>
                        <pattern id="grid" width="50" height="37.5" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 37.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="500" height="150" fill="url(#grid)" />
                      <text x="250" y="75" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="14" fontFamily="Jura, sans-serif">
                        Connect wallet to view performance
                      </text>
                    </svg>
                  )}
                  
                  {/* Hover tooltip */}
                  {chartHover && isWalletConnected && (
                    <div 
                      className="absolute bg-black/90 border border-white/20 rounded-lg p-3 pointer-events-none z-50"
                      style={{
                        left: `${(chartHover.x / 500) * 100}%`,
                        top: -10,
                        transform: 'translateX(-50%) translateY(-100%)'
                      }}
                    >
                      <div className="text-white text-sm font-medium mb-2">{chartHover.date}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-400 text-sm">Aggressive: {chartHover.values.aggressive.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-400 text-sm">Balanced: {chartHover.values.balanced.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-purple-400 text-sm">Conservative: {chartHover.values.conservative.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* X-axis labels */}
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-white/40 text-xs">
                    <span>01/01</span>
                    <span>01/22</span>
                    <span>02/12</span>
                    <span>03/04</span>
                    <span>03/25</span>
                    <span>04/15</span>
                    <span>05/06</span>
                    <span>05/27</span>
                    <span>06/17</span>
                    <span>07/08</span>
                    <span>07/29</span>
                    <span>08/19</span>
                    <span>09/09</span>
                    <span>09/30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend - moved inside panel and positioned at bottom */}
            <div className="flex justify-center gap-4 text-sm mt-auto">
              <div 
                className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                onMouseEnter={() => isWalletConnected && handlePerformanceLegendHover('conservative')}
                onMouseLeave={() => isWalletConnected && handlePerformanceLegendHover(null)}
              >
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-white/60">Conservative</span>
              </div>
              <div 
                className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                onMouseEnter={() => isWalletConnected && handlePerformanceLegendHover('balanced')}
                onMouseLeave={() => isWalletConnected && handlePerformanceLegendHover(null)}
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/60">Balanced</span>
              </div>
              <div 
                className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                onMouseEnter={() => isWalletConnected && handlePerformanceLegendHover('aggressive')}
                onMouseLeave={() => isWalletConnected && handlePerformanceLegendHover(null)}
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-white/60">Aggressive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Investing Card (aligned with Fund Balance) */}
        <div>
          <div className="bg-[#181717] border border-white/20 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MdAccountBalance className="text-white" size={28} />
                <h3 className="text-white text-2xl font-semibold" style={{ fontFamily: 'Jura, sans-serif' }}>
                  Investing
                </h3>
              </div>
            </div>
            <p className="text-white/60 mb-6 text-lg" style={{ fontFamily: 'Jura, sans-serif' }}>
              View and adjust your strategy.
            </p>

            {/* Stats Row - Horizontal Layout */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white/60 text-sm">Estimated APY</p>
                  <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                    <span className="text-white/60 text-xs">i</span>
                  </div>
                </div>
                <p className="text-purple-400 font-semibold text-lg">{isWalletConnected ? "0.00%" : "---%"}</p>
              </div>
              <div className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white/60 text-sm">Invested</p>
                  <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                    <span className="text-white/60 text-xs">i</span>
                  </div>
                </div>
                <p className="text-white font-semibold text-lg">{isWalletConnected ? "$0.00" : "$------"}</p>
              </div>
              <div className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white/60 text-sm">Available</p>
                  <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                    <span className="text-white/60 text-xs">i</span>
                  </div>
                </div>
                <p className="text-white font-semibold text-lg">{isWalletConnected ? "$0.00" : "$------"}</p>
              </div>
              <div className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white/60 text-sm">Earned</p>
                  <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                    <span className="text-white/60 text-xs">i</span>
                  </div>
                </div>
                <p className="text-white/40 text-lg">{isWalletConnected ? "Coming Soon" : "------"}</p>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-64 h-64">
                {isWalletConnected ? (
                  <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 120 120">
                    {/* Conservative - Purple segment */}
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke={hoveredStrategy === 'conservative' ? "#A855F7" : "#8B5CF6"} 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray={hoveredStrategy === 'conservative' ? "314 0" : "173 314"}
                      strokeDashoffset="0"
                      className="transition-all duration-500"
                      opacity={hoveredStrategy && hoveredStrategy !== 'conservative' ? 0.3 : 1}
                    />
                    {/* Balanced - Green segment */}
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke={hoveredStrategy === 'balanced' ? "#34D399" : "#10B981"} 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray={hoveredStrategy === 'balanced' ? "314 0" : "79 314"}
                      strokeDashoffset={hoveredStrategy === 'balanced' ? "0" : "-173"}
                      className="transition-all duration-500"
                      opacity={hoveredStrategy && hoveredStrategy !== 'balanced' ? 0.3 : 1}
                    />
                    {/* Aggressive - Yellow segment */}
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke={hoveredStrategy === 'aggressive' ? "#FBBF24" : "#EAB308"} 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray={hoveredStrategy === 'aggressive' ? "314 0" : "63 314"}
                      strokeDashoffset={hoveredStrategy === 'aggressive' ? "0" : "-252"}
                      className="transition-all duration-500"
                      opacity={hoveredStrategy && hoveredStrategy !== 'aggressive' ? 0.3 : 1}
                    />
                  </svg>
                ) : (
                  /* Empty pie chart */
                  <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray="314 0"
                    />
                  </svg>
                )}
                
                {/* Total Amount in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center" style={{ width: '140px', minHeight: '80px' }}>
                    <div className="text-white/60 text-sm mb-1" style={{ height: '20px', lineHeight: '20px' }}>
                      {isWalletConnected ? (hoveredStrategy ? (hoveredStrategy.charAt(0).toUpperCase() + hoveredStrategy.slice(1)) : 'Total') : 'Total'}
                    </div>
                    <div className="text-white text-2xl font-bold font-mono mb-1" style={{ height: '32px', lineHeight: '32px' }}>
                      ${isWalletConnected ? (hoveredStrategy ? strategies[hoveredStrategy as keyof typeof strategies].amount : strategies.total.amount) : "------"}
                    </div>
                    <div className="text-white/60 text-lg" style={{ height: '28px', lineHeight: '28px' }}>
                      {isWalletConnected ? (hoveredStrategy ? strategies[hoveredStrategy as keyof typeof strategies].percentage : strategies.total.percentage) : "---"}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Legend with Values */}
            <div className="flex justify-center gap-8">
              <div 
                className="text-center cursor-pointer"
                onMouseEnter={() => isWalletConnected && handleLegendHover('conservative')}
                onMouseLeave={() => isWalletConnected && handleLegendHover(null)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-400 text-sm font-medium">Conservative</span>
                </div>
                <div className={`bg-black/30 rounded-lg px-3 py-2 transition-all duration-200 ${hoveredStrategy === 'conservative' && isWalletConnected ? 'bg-purple-500/20 scale-105' : ''}`}>
                  <span className="text-white text-lg font-medium">${strategies.conservative.amount}</span>
                </div>
              </div>
              <div 
                className="text-center cursor-pointer"
                onMouseEnter={() => isWalletConnected && handleLegendHover('balanced')}
                onMouseLeave={() => isWalletConnected && handleLegendHover(null)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm font-medium">Balanced</span>
                </div>
                <div className={`bg-black/30 rounded-lg px-3 py-2 transition-all duration-200 ${hoveredStrategy === 'balanced' && isWalletConnected ? 'bg-green-500/20 scale-105' : ''}`}>
                  <span className="text-white text-lg font-medium">${strategies.balanced.amount}</span>
                </div>
              </div>
              <div 
                className="text-center cursor-pointer"
                onMouseEnter={() => isWalletConnected && handleLegendHover('aggressive')}
                onMouseLeave={() => isWalletConnected && handleLegendHover(null)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-400 text-sm font-medium">Aggressive</span>
                </div>
                <div className={`bg-black/30 rounded-lg px-3 py-2 transition-all duration-200 ${hoveredStrategy === 'aggressive' && isWalletConnected ? 'bg-yellow-500/20 scale-105' : ''}`}>
                  <span className="text-white text-lg font-medium">${strategies.aggressive.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategies Card - Full Width Bottom */}
      <div className="mt-6">
        <div className="bg-[#181717] border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <MdBarChart className="text-white" size={28} />
            <h3 className="text-white text-2xl font-semibold" style={{ fontFamily: 'Jura, sans-serif' }}>
              Strategies
            </h3>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/60 text-lg" style={{ fontFamily: 'Jura, sans-serif' }}>
              {strategiesTab === "Strategies" ? "View and filter available yield strategies." : "View your transaction history."}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setStrategiesTab("Strategies")}
                className={`px-4 py-2 rounded-lg text-lg border ${strategiesTab === "Strategies" ? "bg-white/10 text-white border-white" : "text-white/60 border-white/20 hover:border-white/40"}`}
              >
                Strategies
              </button>
              <button 
                onClick={() => setStrategiesTab("Transactions")}
                className={`px-4 py-2 rounded-lg text-lg border ${strategiesTab === "Transactions" ? "bg-white/10 text-white border-white" : "text-white/60 border-white/20 hover:border-white/40"}`}
              >
                Transactions
              </button>
            </div>
          </div>

          {/* Filter Tabs and Search */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {["All Levels", "Conservative", "Balanced", "Aggressive"].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setStrategiesFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-lg border ${strategiesFilter === filter ? "bg-white/10 text-white border-white" : "text-white/60 border-white/20 hover:border-white/40"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search protocols"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/20 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-white/40 w-64 text-lg"
              />
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            </div>
          </div>

          {/* Strategies Table */}
          {strategiesTab === "Strategies" && (
            <div className="space-y-3">
              <div 
                className={`flex items-center justify-between p-4 bg-black/20 rounded-lg transition-all duration-300 cursor-pointer group ${hoveredProtocol === 'kamino' ? 'transform translate-x-2' : ''}`}
                onMouseEnter={() => handleProtocolHover('kamino')}
                onMouseLeave={() => handleProtocolHover(null)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">K</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">Kamino Vault: JUP-SOL</p>
                    <p className="text-white/60 text-lg">Balanced • Liquidity Pool</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-green-400 font-semibold text-lg">29.58%</p>
                    <p className="text-white/60 text-lg">7D Fees APY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg">$2,834,616.7</p>
                    <p className="text-white/60 text-lg">TVL</p>
                  </div>
                  <div className={`transition-all duration-300 ${hoveredProtocol === 'kamino' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <MdArrowOutward className="text-white/60" size={20} />
                  </div>
                </div>
              </div>

              <div 
                className={`flex items-center justify-between p-4 bg-black/20 rounded-lg transition-all duration-300 cursor-pointer group ${hoveredProtocol === 'hypurr' ? 'transform translate-x-2' : ''}`}
                onMouseEnter={() => handleProtocolHover('hypurr')}
                onMouseLeave={() => handleProtocolHover(null)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">H</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">Hypurr feUSD Deposit Pool</p>
                    <p className="text-white/60 text-lg">Balanced • Deposit LP</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-green-400 font-semibold text-lg">20.11%</p>
                    <p className="text-white/60 text-lg">7D Fees APY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg">$23,423,000</p>
                    <p className="text-white/60 text-lg">TVL</p>
                  </div>
                  <div className={`transition-all duration-300 ${hoveredProtocol === 'hypurr' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <MdArrowOutward className="text-white/60" size={20} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Content */}
          {strategiesTab === "Transactions" && (
            <div className="text-center py-8">
              <p className="text-white/60 text-lg">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
