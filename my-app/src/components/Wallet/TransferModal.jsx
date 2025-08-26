"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { toast } from "react-toastify"
import { X, CheckCircle2, ArrowUpRight, Copy } from "lucide-react"

export default function TransferModal({ wallet, provider, balance, onClose }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [txHash, setTxHash] = useState("");

  const handleSend = async () => {
    if (!ethers.isAddress(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }
    if (parseFloat(amount) > parseFloat(balance) || parseFloat(amount) <= 0) {
      toast.error("Invalid or insufficient amount");
      return;
    }
    setIsLoading(true);
    try {
      const signer = wallet.connect(provider);
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      });
      toast.info("Transaction submitted...");
      setTxHash(tx.hash);
      await tx.wait(); // Wait for transaction to be mined
      setStep(2);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
    }
    setIsLoading(false);
  };
  
  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash);
    toast.success("Transaction hash copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl transform scale-95 animate-modal-pop">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Send ETH</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="text-white" />
          </button>
        </div>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="recipient" className="block text-white/80 text-sm mb-2">Recipient Address</label>
              <input 
                id="recipient"
                type="text" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                placeholder="0x..." 
                className="w-full bg-white/5 rounded-xl p-3 text-white placeholder-white/50 border border-white/10 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-white/80 text-sm mb-2">Amount (ETH)</label>
              <div className="relative">
                <input 
                  id="amount"
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="0.0" 
                  className="w-full bg-white/5 rounded-xl p-3 pr-16 text-white placeholder-white/50 border border-white/10 focus:border-blue-500 outline-none transition-colors"
                />
                <button 
                  onClick={() => setAmount(Number.parseFloat(balance).toFixed(4))} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 py-1 px-3 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Max
                </button>
              </div>
              <div className="mt-2 text-white/60 text-sm">Balance: {Number.parseFloat(balance).toFixed(4)} ETH</div>
            </div>
            <button 
              onClick={handleSend} 
              disabled={isLoading || !recipient || !amount} 
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight size={20} />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="text-center space-y-6">
            <CheckCircle2 size={64} className="mx-auto text-green-400 animate-scale-in" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Transaction Sent!</h3>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm break-all font-mono transition-colors">
                  {txHash}
                </a>
                <button onClick={copyTxHash} className="mt-3 w-full py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center space-x-2">
                  <Copy size={16} />
                  <span>Copy Tx Hash</span>
                </button>
              </div>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}