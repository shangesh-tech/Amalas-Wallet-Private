import Image from "next/image";

// =======================================================================
//  COMPONENT DATA
// =======================================================================
export const perksData: {
  icon: string;
  title: string;
  text: string;
  space: string;
}[] = [
  {
    icon: "/images/perks/icon-support.svg",
    title: "24/7 Support",
    text: "Need help? Get your requests solved quickly via our support team.",
    space: "lg:mt-8",
  },
  {
    icon: "/images/perks/icon-community.svg",
    title: "Community",
    text: "Join the conversations on our worldwide Amal communities.",
    space: "lg:mt-14",
  },
  {
    icon: "/images/perks/icon-academy.svg",
    title: "Academy",
    text: "Learn blockchain and<br /> crypto for free.",
    space: "lg:mt-4",
  },
];

// =======================================================================
//  MAIN PERKS COMPONENT
// =======================================================================
const Perks = () => {
  return (
    <section className="pb-28 relative bg-gradient-to-b from-[#1a2847] to-[#121D33]">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="text-center">
          <p className="text-white/70 sm:text-2xl text-lg mb-4 pb-6 relative after:content-[''] after:w-8 after:h-0.5 after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2">
            Always By <span className="text-primary">Your Side</span>
          </p>
          <h2 className="text-white sm:text-4xl text-3xl font-medium">
            Be the First to Use Our Amal<span className="text-primary">Wallet</span>
            !
          </h2>
          <div className="mt-16 border border-white/10 grid lg:grid-cols-3 sm:grid-cols-2 gap-10 lg:px-20 px-8 py-16 rounded-3xl sm:bg-perk bg-dark_grey bg-opacity-35 lg:bg-bottom bg-center bg-no-repeat">
            {perksData.map((item, index) => (
              <div
                key={index}
                className="text-center flex items-center justify-start flex-col"
              >
                <div className="bg-primary bg-opacity-25 backdrop-blur-sm p-4 rounded-full w-fit">
                  <Image
                    src={item.icon} // Updated src path
                    alt={item.title}
                    width={44}
                    height={44}
                  />
                </div>
                <h4 className={`text-white text-2xl mb-4 ${item.space}`}>
                  {item.title}
                </h4>
                <div
                  className="text-white/60"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-teal-500 to-gray-800 sm:w-96 w-80 sm:h-96 h-80 rounded-full sm:-bottom-80 bottom-0 blur-[200px] z-0 absolute sm:-left-48 opacity-40"></div>
    </section>
  );
};

export default Perks;