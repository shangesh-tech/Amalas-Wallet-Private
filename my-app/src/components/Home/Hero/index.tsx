"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import CardSlider from "./slider";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const leftAnimation = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  const rightAnimation = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section
      className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1"
      id="main-banner"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12">
          <motion.div {...leftAnimation} className="lg:col-span-5 col-span-12">
            <div className="mt-24">
              <h1 className="font-mulish text-center lg:text-left font-medium lg:text-[56px] md:text-[70px] text-[54px] lg:text-start text-center text-white mb-1 whitespace-nowrap">
                <span className="font-bold text-[48px] text-white leading-none">
                  The best way to try
                </span>
              </h1>
              <span className="font-extrabold text-[78px] text-[#00AEEF] leading-none ml-n2">
                Cryptocurrency
              </span>
              <p className="whitespace-nowrap mt-4 text-white/90 lg:text-left text-center">
                The most popular way in the world to learn, sell, buy, and trade.
              </p>
            </div>

            <div className="mt-8 mb-4 flex items-center md:justify-start justify-center gap-6">
              <Link href="/wallet">
                <button className="bg-blue-600 border border-blue-600 rounded-lg text-xl font-medium hover:bg-blue-700 text-white py-3 px-8 transition-colors duration-300">
                  Get Started
                </button>
              </Link>

              <Link href="/fiat">
                <button className="bg-transparent border border-white/50 rounded-lg text-xl font-medium hover:bg-white/10 text-white py-3 px-8 transition-colors duration-300">
                  Buy Crypto
                </button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            {...rightAnimation}
            className="col-span-7 lg:block hidden"
          >
            <div className="ml-20 -mr-64" style={{ marginLeft: "33%" }}>
              <Image
                src={`/images/amal-coin-logo.png`}
                alt="Banner"
                width={381}
                height={404}
                style={{ marginTop: "10%", marginLeft: "10%", transform: "scaleX(-1)" }}
                priority
              />
            </div>
          </motion.div>
        </div>
        <CardSlider />
      </div>

      <div
        className={`absolute inset-0 -z-10 bg-cover bg-center ${
          isClient ? "bg-[url('/images/amal-bg.jpg')]" : "bg-[#0a0f1a]"
        }`}
      />
    </section>
  );
};

export default Hero;