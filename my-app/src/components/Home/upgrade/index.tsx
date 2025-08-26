"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";

// =======================================================================
//  COMPONENT DATA
// =======================================================================
export const upgradeData: { title: string }[] = [
  { title: "100% Secure" },
  { title: "A Fraction of the Cost" },
  { title: "More Durable" },
  { title: "Easier to Use" },
];

// =======================================================================
//  MAIN UPGRADE COMPONENT
// =======================================================================
const Upgrade = () => {
  return (
    <section
      className="md:py-40 py-20 bg-gradient-to-b from-[#121D33] to-[#1a2847]"
      id="upgrade"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid lg:grid-cols-2 sm:gap-0 gap-10 items-center">
          <div>
            <p className="text-primary sm:text-2xl text-lg mb-3">Upgrade</p>
            <h2 className="text-white sm:text-4xl text-3xl font-medium mb-5">
              Upgrade Your Storage Layer
            </h2>
            <p className="text-white/60 text-lg mb-7">
              Get faster, safer, more affordable cloud object storage with no
              central point of failure.
            </p>
            <div className="grid sm:grid-cols-2 lg:w-4/5 text-nowrap sm:gap-10 gap-5">
              {upgradeData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Icon
                    icon="la:check-circle-solid"
                    width="24"
                    height="24"
                    className="text-primary flex-shrink-0"
                  />
                  <h4 className="text-lg text-white/80">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="">
              <Image
                src="/images/upgrade/img-upgrade.png" // Updated src path
                alt="Upgrade your storage layer"
                width={625}
                height={580}
                className="-mr-5"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upgrade;