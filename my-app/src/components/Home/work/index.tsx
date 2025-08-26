"use client";
import Image from "next/image";

const Work = () => {
  return (
    <section
      className="md:pt-28 mt-5 bg-gradient-to-b from-[#121D33] to-[#1a2847] text-white py-24"
      id="work"
    >
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h1 className="font-mulish font-extrabold text-3xl md:text-5xl leading-snug">
            A Smarter Way to Own Web3 Security You Can Trust
          </h1>
        </div>

        <div className="text-center mt-24">
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto">
            AMAL Wallet keeps your assets safe with social recovery, phishing
            protection, and face + gesture verification. Plus, our 24/7
            integrated support ensures you’re never alone in Web3.
          </p>
          <div className="mt-8">
            <button className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg">
              Get Started
            </button>
          </div>
        </div>

        {/* Divider for spacing */}
        <div className="my-24 h-px bg-white/10" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center items-center">
            <div className="bg-white/5 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
              <Image
                src="/images/security.png"
                alt="Security Shield"
                width={240}
                height={240}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <h2 className="font-mulish font-extrabold text-2xl md:text-4xl leading-snug">
              24/7 Access to <br /> Full-Service Support
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/70">
              Get instant help whenever you need it. Our integrated support
              system includes live chat, guided tutorials, and smart
              troubleshooting — ensuring you stay confident while navigating
              Web3.
            </p>
            <div className="mt-8">
              <button className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;