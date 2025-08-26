"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";

// =======================================================================
//  TYPE DEFINITIONS
// =======================================================================
export type SubmenuItem = {
  label: string;
  href: string;
};

export type HeaderItem = {
  label:string;
  href: string;
  submenu?: SubmenuItem[];
  isButton?: boolean;
};

// =======================================================================
//  NAVIGATION DATA
// =======================================================================
export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "Wallet", href: "/wallet" },
  { label: "Portfolio", href: "/portfolio" },
];

// =======================================================================
//  DESKTOP HEADER LINK COMPONENT
// =======================================================================
const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };
  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  return (
    <div
      className="relative py-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1 font-medium transition-colors duration-300 ${
          path === item.href
            ? "text-blue-500"
            : "text-white/80 hover:text-white"
        }`}
      >
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>

      {submenuOpen && item.submenu && (
        <div className="absolute py-2 left-0 mt-0 w-60 bg-white dark:bg-[#1a202c] shadow-lg rounded-lg">
          {item.submenu?.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block px-4 py-2 text-sm ${
                path === subItem.href
                  ? "bg-blue-600 text-white"
                  : "text-black dark:text-white hover:bg-blue-600/20"
              }`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// =======================================================================
//  MOBILE HEADER LINK COMPONENT
// =======================================================================
const MobileHeaderLink: React.FC<{
  item: HeaderItem;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleToggleSubmenu = (e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault();
      setSubmenuOpen(!submenuOpen);
    } else {
      onClick();
    }
  };

  return (
    <div className="w-full border-b border-white/10">
      <Link
        href={item.href}
        onClick={handleToggleSubmenu}
        className="flex items-center justify-between w-full py-3 text-white/80 hover:text-white transition-colors"
      >
        {item.label}
        {item.submenu && (
          <svg
            className={`transform transition-transform duration-300 ${
              submenuOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>
      {submenuOpen && item.submenu && (
        <div className="pl-4 mt-1 pb-2 w-full flex flex-col space-y-1">
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              onClick={onClick}
              className="block py-2 text-white/60 hover:text-white"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// =======================================================================
//  MAIN HEADER COMPONENT
// =======================================================================
const Header: React.FC = () => {
  const { data: session, status } = useSession(); // Using useSession hook from NextAuth
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen]);

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const commonLinkClasses =
    "px-5 py-2 rounded-md font-semibold transition-colors duration-300 text-sm";
  const primaryButtonClasses = `${commonLinkClasses} bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryButtonClasses = `${commonLinkClasses} bg-transparent border border-white/50 text-white hover:bg-white/10`;

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        sticky ? "shadow-lg pt-5" : "shadow-none md:pt-14 pt-5"
      }`}
    >
      <div
        className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4
             bg-opacity-50 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg"
      >
        <div className="lg:py-0 py-2 w-full flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {status === "loading" && (
              <div className="h-9 w-48 bg-white/10 rounded-md animate-pulse"></div>
            )}
            {status === "authenticated" && session && (
              <>
                <Link href="/wallet" className={secondaryButtonClasses}>
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`${commonLinkClasses} bg-red-600 text-white hover:bg-red-700`}
                >
                  Sign Out
                </button>
              </>
            )}
            {status === "unauthenticated" && (
              <>
                <Link href="/login" className={secondaryButtonClasses}>
                  Sign In
                </Link>
                <Link href="/signup" className={primaryButtonClasses}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="block lg:hidden p-2 rounded-lg"
            aria-label="Toggle mobile menu"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
            <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Mobile Menu Panel */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-full 
                    bg-[#0a0f1a]/80 backdrop-blur-lg border-l border-white/10 shadow-lg
                    transform transition-transform duration-300 max-w-xs
                    ${navbarOpen ? "translate-x-0" : "translate-x-full"} z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            className="p-2"
            aria-label="Close menu"
          >
            <div className="w-5 h-0.5 bg-white rotate-45 translate-y-[1px]"></div>
            <div className="w-5 h-0.5 bg-white -rotate-45 -translate-y-[1px]"></div>
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {headerData.map((item, index) => (
            <MobileHeaderLink
              key={index}
              item={item}
              onClick={() => setNavbarOpen(false)}
            />
          ))}

          {/* Mobile Auth Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col space-y-4 w-full">
            {status === "loading" && (
                <div className="h-10 w-full bg-white/10 rounded-md animate-pulse"></div>
            )}
            {status === "authenticated" && session && (
              <>
                <Link
                  href="/wallet"
                  onClick={() => setNavbarOpen(false)}
                  className={`${secondaryButtonClasses} text-center`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setNavbarOpen(false);
                  }}
                  className={`${commonLinkClasses} bg-red-600 text-white hover:bg-red-700`}
                >
                  Sign Out
                </button>
              </>
            )}
            {status === "unauthenticated" && (
              <>
                <Link
                  href="/login"
                  onClick={() => setNavbarOpen(false)}
                  className={`${secondaryButtonClasses} text-center`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setNavbarOpen(false)}
                  className={`${primaryButtonClasses} text-center`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;