"use client";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// =======================================================================
//  COMPONENT DATA
// =======================================================================
export const timelineData: {
  icon: string;
  title: string;
  text: string;
}[] = [
  {
    icon: "/images/timeline/icon-planning.svg",
    title: "Planning",
    text: "Map the project's scope and architecture.",
  },
  {
    icon: "/images/timeline/icon-refinement.svg",
    title: "Refinement",
    text: "Refine and improve your solution.",
  },
  {
    icon: "/images/timeline/icon-prototype.svg",
    title: "Prototype",
    text: "Build a working prototype to test your product.",
  },
  {
    icon: "/images/timeline/icon-support.svg",
    title: "Support",
    text: "Deploy the product and ensure full support by us.",
  },
];

// =======================================================================
//  MAIN TIMELINE COMPONENT
// =======================================================================
const TimeLine = () => {
  return (
    <section className="md:pt-40 pt-9 bg-gradient-to-b from-[#1a2847] to-[#121D33]" id="development">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md lg:px-16 px-4">
        <div className="text-center">
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/70 sm:text-2xl text-lg mb-9">
              Development <span className="text-primary">Timeline</span>
            </p>
            <h2 className="text-white sm:text-4xl text-3xl font-medium lg:w-4/5 mx-auto mb-20">
              We can enter at any point or help you all the way through the
              development cycle.
            </h2>
          </motion.div>
          <motion.div
            whileInView={{ scale: 1, opacity: 1 }}
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Desktop View */}
            <div className="md:block hidden relative">
              <div>
                <Image
                  src="/images/timeline/img-timeline.png" // Updated src path
                  alt="Development Timeline"
                  width={1220}
                  height={1000}
                  className="w-4/5 mx-auto"
                />
              </div>
              <div className="absolute lg:top-40 top-36 lg:left-0 -left-20 w-72 flex items-center gap-6">
                <div className="text-right">
                  <h5 className="text-white text-2xl mb-3">Planning</h5>
                  <p className="text-lg text-white/60">
                    Map the project's scope and architecture
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 h-fit rounded-full">
                  <Image
                    src="/images/timeline/icon-planning.svg" // Updated src path
                    alt="Planning"
                    width={56}
                    height={56}
                  />
                </div>
              </div>
              <div className="absolute lg:top-40 top-36 lg:right-0 -right-20 w-72 flex items-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 h-fit rounded-full">
                  <Image
                    src="/images/timeline/icon-refinement.svg" // Updated src path
                    alt="Refinement"
                    width={44}
                    height={44}
                  />
                </div>
                <div className="text-left">
                  <h5 className="text-white text-2xl mb-3">Refinement</h5>
                  <p className="text-lg text-white/60">
                    Refine and improve your solution
                  </p>
                </div>
              </div>
              <div className="absolute lg:bottom-48 bottom-36 lg:left-0 -left-20 w-72 flex items-center gap-6">
                <div className="text-right">
                  <h5 className="text-white text-2xl mb-3">Prototype</h5>
                  <p className="text-lg text-white/60">
                    Build a working prototype to test your product
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 h-fit rounded-full">
                  <Image
                    src="/images/timeline/icon-prototype.svg" // Updated src path
                    alt="Prototype"
                    width={56}
                    height={56}
                  />
                </div>
              </div>
              <div className="absolute lg:bottom-48 bottom-36 lg:right-0 -right-20 w-72 flex items-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 h-fit rounded-full">
                  <Image
                    src="/images/timeline/icon-support.svg" // Updated src path
                    alt="Scale and support"
                    width={56}
                    height={56}
                  />
                </div>
                <div className="text-left">
                  <h5 className="text-white text-nowrap text-2xl mb-3">
                    Support
                  </h5>
                  <p className="text-lg text-white/60">
                    Deploy the product and ensure full support by us
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="grid sm:grid-cols-2 gap-8 md:hidden">
              {timelineData.map((item, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="bg-white/10 p-6 rounded-full">
                    <Image
                      src={item.icon} // Updated src path
                      alt={item.title}
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className="text-start">
                    <h4 className="text-2xl text-white mb-2">{item.title}</h4>
                    <p className="text-white/60 text-base">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TimeLine;