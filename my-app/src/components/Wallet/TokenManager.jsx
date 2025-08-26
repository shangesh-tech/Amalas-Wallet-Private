"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { toast } from "react-toastify"
import { Copy, Trash2, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"

const ERC20_ABI = [
  "function name() view returns (string)", "function symbol() view returns (string)",
  "function decimals() view returns (uint8)", "function balanceOf(address) view returns (uint256)",
]

export default function TokenManager({ wallet, provider, tokens, setTokens }) {
  const [showAddToken, setShowAddToken] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState({});

  const loadTokenBalances = useCallback(async () => {
    if (!wallet || !provider || tokens.length === 0) return;
    const balances = {};
    for (const token of tokens) {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const balance = await contract.balanceOf(wallet.address);
        balances[token.address] = ethers.formatUnits(balance, token.decimals || 18);
      } catch (error) {
        console.error(`Error loading balance for ${token.symbol}:`, error);
        balances[token.address] = "0";
      }
    }
    setTokenBalances(balances);
  }, [wallet, provider, tokens]);

  useEffect(() => {
    loadTokenBalances();
  }, [loadTokenBalances]);

  const addToken = async () => {
    if (!ethers.isAddress(tokenAddress)) {
      toast.error("Invalid token address");
      return;
    }
    setIsLoading(true);
    try {
      const tokenAddr = tokenAddress.trim();
      if (tokens.some(t => t.address.toLowerCase() === tokenAddr.toLowerCase())) {
        toast.info("Token already added");
        return;
      }
      const contract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
      const [name, symbol, decimals] = await Promise.all([
        contract.name(), contract.symbol(), contract.decimals()
      ]);
      const newToken = { address: tokenAddr, name, symbol, decimals: Number(decimals) };
      const updatedTokens = [...tokens, newToken];
      setTokens(updatedTokens);
      localStorage.setItem(`tokens_${wallet.address}`, JSON.stringify(updatedTokens));
      setTokenAddress("");
      setShowAddToken(false);
      toast.success(`Added ${symbol} token`);
    } catch (error) {
      toast.error("Invalid token or network issue");
    } finally {
      setIsLoading(false);
    }
  };

  const removeToken = (tokenAddr) => {
    if (confirm(`Are you sure you want to remove this token?`)) {
      const updatedTokens = tokens.filter((token) => token.address !== tokenAddr);
      setTokens(updatedTokens);
      localStorage.setItem(`tokens_${wallet.address}`, JSON.stringify(updatedTokens));
    }
  };

  const formatAddress = (address) => `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard!");
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Tokens</h3>
        <button onClick={() => setShowAddToken(!showAddToken)} className="p-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all">
          <Plus size={16} />
        </button>
      </div>
      {showAddToken && (
        <div className="mb-6 p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-lg">
          <h4 className="text-white font-medium mb-3">Add Custom Token</h4>
          <div className="space-y-3">
            <input 
              type="text" 
              value={tokenAddress} 
              onChange={(e) => setTokenAddress(e.target.value)} 
              placeholder="Token contract address (0x...)" 
              className="w-full bg-white/5 rounded-lg p-3 text-white placeholder-white/50 border border-white/10 focus:border-blue-500 outline-none transition-colors"
            />
            <div className="flex space-x-2">
              <button 
                onClick={addToken} 
                disabled={isLoading || !tokenAddress.trim()} 
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add Token"}
              </button>
              <button 
                onClick={() => setShowAddToken(false)} 
                className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-200 hover:bg-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{token.symbol.slice(0, 4).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{token.name}</h4>
                    <button onClick={() => copyToClipboard(token.address)} className="text-white/60 text-sm hover:text-white flex items-center space-x-1 transition-colors">
                      <span>{formatAddress(token.address)}</span> <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-white font-medium">{Number.parseFloat(tokenBalances[token.address] || "0").toFixed(4)}</div>
                    <div className="text-white/70 text-sm">{token.symbol}</div>
                  </div>
                  <button onClick={() => removeToken(token.address)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-white/50"><p>No custom tokens added.</p></div>
        )}
      </div>
    </div>
  );
}