"use client";
import Image from "next/image";
import { motion } from "framer-motion";

// =======================================================================
//  COMPONENT DATA
// =======================================================================
export const portfolioData: { image: string; title: string }[] = [
  {
    image: "/images/portfolio/icon-wallet.svg",
    title: "Manage your portfolio",
  },
  {
    image: "/images/portfolio/icon-vault.svg",
    title: "Vault protection",
  },
  {
    image: "/images/portfolio/icon-mobileapp.svg",
    title: "Mobile apps",
  },
];

// =======================================================================
//  MAIN PORTFOLIO COMPONENT
// =======================================================================
const Portfolio = () => {
  return (
    <section
      className="md:pt-48 sm:pt-28 pt-12 bg-gradient-to-b from-[#121D33] to-[#1a2847]"
      id="portfolio"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 items-center gap-20">
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:-ml-32"
          >
            <Image
              src="/images/portfolio/img-portfolio.png" // Updated src path
              alt="Crypto Portfolio"
              width={780}
              height={700}
            />
          </motion.div>

          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="sm:text-2xl text-lg text-white/70 mb-4">
              Cryptocurrency <span className="text-primary">Portfolio</span>
            </p>
            <h2 className="text-white sm:text-4xl text-3xl mb-4 font-medium">
              Create Your Crypto Portfolio Today with Amal
              <span className="text-primary">Wallet</span>!
            </h2>
            <p className="text-white/60 text-lg">
              Amal has a variety of features that make it the best
              <br className="md:block hidden" /> place to start trading.
            </p>

            <table className="w-full sm:w-[80%] mt-8">
              <tbody>
                {portfolioData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10"
                  >
                    <td className="py-5">
                      <div className="bg-primary p-4 rounded-full bg-opacity-20 w-fit">
                        <Image
                          src={item.image} // Updated src path
                          alt={item.title}
                          width={35}
                          height={35}
                        />
                      </div>
                    </td>
                    <td className="py-5">
                      <h4 className="text-white sm:text-2xl text-xl ml-5">
                        {item.title}
                      </h4>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;