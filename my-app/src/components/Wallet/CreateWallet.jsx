"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Wallet, LoaderCircle } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder, onKeyPress }) => (
  <div className="relative">
    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
    <input
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-lg text-white placeholder-white/40 bg-white/5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
  </div>
);

export default function CreateWallet({ onWalletReady }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateAndUnlock = async () => {
    setLoading(true);
    setError("");
    try {
      // Step 1: Create the wallet
      const createRes = await fetch("/api/wallet/create", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!createRes.ok) {
        setError("Somethings went wrong while create wallet!!");
      }

      // Step 2: Automatically unlock the newly created wallet
      const UnlockRes = await fetch("/api/wallet/unlock", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });
      const UnlockData = await UnlockRes.json();

      if (!UnlockRes.ok) {
        setError(data.error);
      } else {
        onWalletReady(UnlockData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !loading) {
      handleCreateAndUnlock();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 pt-20">
      <motion.div
        layout
        className="w-full max-w-sm bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden"
      >
        <div className="p-8 text-center">
          <motion.div
            animate={{ scale: loading ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wallet size={48} className="mx-auto text-blue-400" />
          </motion.div>
        </div>

        <div className="px-8 pb-8">
          <h2 className="mb-2 text-2xl font-bold text-center text-white">
            Create Wallet
          </h2>
          <p className="mb-6 text-sm text-center text-white/60">
            Choose a strong password to encrypt your new wallet.
          </p>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a Strong Password"
            onKeyPress={handleKeyPress}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, x: [-3, 3, -3, 3, 0] }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
                className="mt-3 text-center text-sm text-red-400 bg-red-500/10 p-2 rounded-md"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleCreateAndUnlock}
            disabled={loading}
            className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
          >
            {loading && <LoaderCircle size={18} className="animate-spin" />}
            {loading ? "Creating…" : "Create & Encrypt"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
