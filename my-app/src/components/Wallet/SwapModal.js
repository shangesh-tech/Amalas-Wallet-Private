"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { toast } from "react-toastify"
import { X } from "lucide-react"

const tokens = [ { symbol: "ETH" }, { symbol: "USDT" }, { symbol: "USDC" }, { symbol: "DAI" }];
const TOKEN_ADDRESSES = {
  USDC: "0x254d06f33bDc5b8ee05b2ea472107E300226659A",
  DAI:  "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
  USDT: "0xD1BA4Fd3C88D29b0Dd96059F2349435cFCd7112F"
};
const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // Sepolia WETH
const UNISWAP_ROUTER = "0xC532a74256D3Db421739eff47443861e68B81240"; // Uniswap V2 Router on Sepolia

const routerAbi = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];
const erc20Abi = ["function approve(address spender, uint256 amount) public returns (bool)"];

export default function SwapModal({ onClose, wallet, provider }) {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const signer = wallet.connect(provider);
      const router = new ethers.Contract(UNISWAP_ROUTER, routerAbi, signer);
      const amountIn = ethers.parseEther(amount);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
      const to = wallet.address;
      let tx;

      if (fromToken === 'ETH') {
        const path = [WETH_ADDRESS, TOKEN_ADDRESSES[toToken]];
        tx = await router.swapExactETHForTokens(0, path, to, deadline, { value: amountIn });
      } else {
        const fromTokenAddress = TOKEN_ADDRESSES[fromToken];
        const fromTokenContract = new ethers.Contract(fromTokenAddress, erc20Abi, signer);
        const approval = await fromTokenContract.approve(UNISWAP_ROUTER, amountIn);
        await approval.wait();
        toast.info("Approval successful, now swapping...");

        if (toToken === 'ETH') {
          const path = [fromTokenAddress, WETH_ADDRESS];
          tx = await router.swapExactTokensForETH(amountIn, 0, path, to, deadline);
        } else {
          const path = [fromTokenAddress, WETH_ADDRESS, TOKEN_ADDRESSES[toToken]];
          tx = await router.swapExactTokensForTokens(amountIn, 0, path, to, deadline);
        }
      }
      
      setTxHash(tx.hash);
      await tx.wait();
      toast.success("Swap successful!");
    } catch (err) {
      console.error("Swap failed:", err);
      toast.error(err?.reason || "Swap failed.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-md p-6 bg-[#16223d] rounded-xl shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Swap Tokens</h2>
            <button onClick={onClose}><X className="text-white/70 hover:text-white" /></button>
        </div>
        {!txHash ? (
          <>
            <div className="mb-4 space-y-2">
              <label className="block text-sm text-white/70">From</label>
              <div className="flex gap-2">
                <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} className="...">
                  {tokens.map((t) => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                </select>
                <input type="number" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} className="..."/>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-white/70">To</label>
              <select value={toToken} onChange={(e) => setToToken(e.target.value)} className="w-full ...">
                {tokens.filter(t => t.symbol !== fromToken).map((t) => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
            <button onClick={handleSwap} className="w-full py-3 ..." disabled={loading}>
              {loading ? "Processing Swap..." : "Swap"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Swap Successful!</h3>
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" className="...">{txHash}</a>
            <button onClick={onClose} className="w-full mt-4 ...">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}