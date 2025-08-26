"use client";

import { useState, useEffect, FC } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartOptions,
} from "chart.js";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

// Define the data structure for a cryptocurrency
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}

// =======================================================================
//  SKELETON CARD COMPONENT (for loading state)
// =======================================================================
const SkeletonCard: FC = () => (
  <div className="p-3">
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[196px] animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/10"></div>
        <div>
          <div className="h-5 w-12 rounded-md bg-white/10 mb-1"></div>
          <div className="h-3 w-16 rounded-md bg-white/10"></div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-24 rounded-md bg-white/10"></div>
        <div className="h-5 w-14 rounded-md bg-white/10"></div>
      </div>
      <div className="h-16 w-full rounded-md bg-white/10"></div>
    </div>
  </div>
);

// =======================================================================
//  CRYPTO CARD COMPONENT (for displaying data)
// =======================================================================
const CryptoCard: FC<{ crypto: CryptoData }> = ({ crypto }) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  const chartData = {
    labels: crypto.sparkline_in_7d?.price.map(() => "") || [],
    datasets: [
      {
        data: crypto.sparkline_in_7d?.price || [],
        borderColor: isPositive ? "#10B981" : "#EF4444",
        backgroundColor: isPositive
          ? "rgba(16, 185, 129, 0.1)"
          : "rgba(239, 68, 68, 0.1)",
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 } },
    animation: false as const,
  };

  return (
    <div className="p-3">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 group backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={crypto.image}
            alt={crypto.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-white font-bold text-lg">
              {crypto.symbol.toUpperCase()}
            </p>
            <p className="text-xs text-white/60">{crypto.name}</p>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <p className="text-xl font-bold text-white">
            $
            {crypto.current_price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
            })}
          </p>
          <div
            className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
              isPositive
                ? "text-green-400 bg-green-500/10"
                : "text-red-400 bg-red-500/10"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownLeft size={14} />
            )}
            <span>{crypto.price_change_percentage_24h.toFixed(2)}%</span>
          </div>
        </div>

        <div className="h-16">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// =======================================================================
//  MAIN SLIDER COMPONENT
// =======================================================================
const CardSlider = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets" +
            "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1" +
            "&sparkline=true&price_change_percentage=24h"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data. Please try again later.");
        }
        const data = await response.json();
        setCryptoData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setError("Could not load market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const settings = {
    autoplay: true,
    dots: false,
    arrows: false,
    infinite: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 640, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
    ],
  };

  if (error) {
    return (
      <div className="mt-10 text-center text-red-400 bg-red-500/10 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-16 -mx-3">
      {loading ? (
        <Slider {...settings}>
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </Slider>
      ) : (
        <Slider {...settings}>
          {cryptoData.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CardSlider;