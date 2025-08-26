// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { ethers } from "ethers";
// import WalletDashboard from "@/components/Wallet/WalletDashboard";
// import UnlockWallet from "@/components/Wallet/UnlockWallet";
// import CreateWallet from "@/components/Wallet/CreateWallet";

// export default function WalletPage() {
//   const { data: session, status } = useSession({
//     required: true,
//     onUnauthenticated() {
//       router.push("/login");
//     },
//   });
//   const router = useRouter();

//   const [wallet, setWallet] = useState(null);
//   const [currentView, setCurrentView] = useState("loading");

//   useEffect(() => {
//     if (status === "authenticated") {
//       const checkWalletStatus = async () => {
//         try {
//           const res = await fetch("/api/wallet/status");
//           const data = await res.json();
//           setCurrentView(data.hasWallet ? "unlock" : "create");
//         } catch (error) {
//           console.error("Failed to check wallet status:", error);
//           setCurrentView("create");
//         }
//       };
//       checkWalletStatus();
//     }
//   }, [status]);

//   const handleWalletReady = (data) => {
//     const newWallet = ethers.Wallet.fromPhrase(data.mnemonic);
//     setWallet(newWallet);
//     setCurrentView("dashboard");
//   };

//   if (status === "loading" || currentView === "loading") {
//     return (
//       <div className="pt-20 min-h-screen bg-gradient-to-br from-[#121D33] to-[#1a2847] flex items-center justify-center text-white">
//         Loading Wallet...
//       </div>
//     );
//   }

//   return (
//     <div className="pt-20 min-h-screen bg-gradient-to-br from-[#121D33] via-[#15223b] to-[#1a2847] relative overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
//         </div>
//       </div>

//       <div className="relative z-10">
//         {currentView === "unlock" && (
//           <UnlockWallet onWalletReady={handleWalletReady} />
//         )}
//         {currentView === "create" && (
//           <CreateWallet onWalletReady={handleWalletReady} />
//         )}
//         {currentView === "dashboard" && wallet && (
//           <WalletDashboard wallet={wallet} />
//         )}
//       </div>
//     </div>
//   );
// }