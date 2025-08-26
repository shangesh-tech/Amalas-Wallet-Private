"use client";
import React, { FC } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Logo from "../Header/Logo";

// =======================================================================
//  TYPE DEFINITIONS (for headerData)
// =======================================================================
export type SubmenuItem = {
  label: string;
  href: string;
};

export type HeaderItem = {
  label: string;
  href: string;
  submenu?: SubmenuItem[];
  isButton?: boolean;
};

// =======================================================================
//  NAVIGATION & FOOTER DATA
// =======================================================================
export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "Swap", href: "/swap" },
  { label: "Bridge", href: "/bridge" },
  { label: "Fiat", href: "/fiat" },
  { label: "Portfolio", href: "/portfolio" },
];

export const footerlabels: { label: string; href: string }[] = [
  { label: "Terms", href: "#" },
  { label: "Disclosures", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Latest News", href: "#" },
];

// =======================================================================
//  MAIN FOOTER COMPONENT
// =======================================================================
const Footer: FC = () => {
  return (
    <footer className="pt-16 bg-darkmode bg-gradient-to-b from-[#121D33] to-[#1a2847]">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 lg:gap-20 md:gap-6 sm:gap-12 gap-12 pb-16">
          {/* Column 1: Logo & Socials */}
          <div className="lg:col-span-4 md:col-span-6 col-span-12">
            <Logo />
            <p className="text-white/60 mt-4 max-w-xs">
              The world's leading platform for learning, buying, and trading cryptocurrency.
            </p>
            <div className="flex gap-6 items-center mt-8">
              <Link href="#" className="group">
                <Icon
                  icon="fa6-brands:facebook-f"
                  width="24"
                  height="24"
                  className="text-white transition-colors duration-300 group-hover:text-primary"
                />
              </Link>
              <Link href="#" className="group">
                <Icon
                  icon="fa6-brands:instagram"
                  width="24"
                  height="24"
                  className="text-white transition-colors duration-300 group-hover:text-primary"
                />
              </Link>
              <Link href="#" className="group">
                <Icon
                  icon="fa6-brands:x-twitter"
                  width="24"
                  height="24"
                  className="text-white transition-colors duration-300 group-hover:text-primary"
                />
              </Link>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="lg:col-span-2 md:col-span-3 col-span-6">
            <h4 className="text-white mb-4 font-medium text-2xl">Links</h4>
            <ul>
              {headerData.map((item, index) => (
                <li key={index} className="pb-4">
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-primary text-base transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="lg:col-span-2 md:col-span-3 col-span-6">
            <h4 className="text-white mb-4 font-medium text-2xl">Information</h4>
            <ul>
              {footerlabels.map((item, index) => (
                <li key={index} className="pb-4">
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-primary text-base transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div className="lg:col-span-4 md:col-span-12 col-span-12">
            <h3 className="text-white text-2xl font-medium">Subscribe</h3>
            <p className="text-white/60 text-base mt-4">
              Subscribe to get the latest news from us.
            </p>
            <div className="relative max-w-sm mt-6">
              <input
                type="email"
                name="mail"
                id="mail"
                placeholder="Enter Email"
                className="bg-transparent border border-white/20 py-3 text-white rounded-lg w-full px-4 focus:outline-none focus:border-primary"
              />
              <button
                aria-label="Subscribe"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-white"
              >
                <Icon icon="tabler:send" width="24" height="24" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/10 text-center py-8">
            <p className="text-white/50 text-sm">
              &copy; {new Date().getFullYear()} Amal | All Rights Reserved
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;