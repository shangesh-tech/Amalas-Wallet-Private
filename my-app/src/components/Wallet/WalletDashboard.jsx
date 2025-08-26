"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import TokenManager from "./TokenManager"
import TransferModal from "./TransferModal"
import QRCodeModal from "./QRCodeModal"
// import SwapModal from "./SwapModal" 
import { toast } from "react-toastify"
import { Copy, QrCode, ArrowUpRight, ArrowDownLeft, RefreshCw, HandCoins } from "lucide-react"

export default function WalletDashboard({ wallet }) {
  const [currentTab, setCurrentTab] = useState("transactions")
  const [balance, setBalance] = useState("0")
  const [ethPrice, setEthPrice] = useState(0)
  const [tokens, setTokens] = useState([])
  const [transactions, setTransactions] = useState([])
  const [showTransfer, setShowTransfer] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [provider, setProvider] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isTxLoading, setIsTxLoading] = useState(false)
  const [showSwap, setShowSwap] = useState(false)

  const ALCHEMY_URL = "https://eth-sepolia.g.alchemy.com/v2/50SeX1XFCby8aAdx8vi_hj--dugRY7oV";

  const accountAddress = wallet?.address;

  const fetchTransactionHistory = useCallback(async () => {
    if (!accountAddress) return;
    setIsTxLoading(true);
    try {
      const body = (filter) => ({
        jsonrpc: "2.0", id: 1, method: "alchemy_getAssetTransfers",
        params: [{ fromBlock: "0x0", toBlock: "latest", withMetadata: true, ...filter, category: ["external", "internal", "erc20", "erc721", "erc1155"] }]
      });

      const [sentTxsResponse, receivedTxsResponse] = await Promise.all([
        fetch(ALCHEMY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body({ fromAddress: accountAddress })) }),
        fetch(ALCHEMY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body({ toAddress: accountAddress })) })
      ]);

      const sentData = await sentTxsResponse.json();
      const receivedData = await receivedTxsResponse.json();
      let newTransactions = [];

      const processTxs = (txs, type) => txs.map(tx => ({
        type, 
        amount: tx.value ? parseFloat(tx.value).toFixed(5) : "0",
        counterparty: type === 'sent' ? tx.to : tx.from, 
        hash: tx.hash, 
        blockNumber: parseInt(tx.blockNum, 16), 
        asset: tx.asset || 'ETH'
      }));

      if (sentData?.result?.transfers) newTransactions.push(...processTxs(sentData.result.transfers, "sent"));
      if (receivedData?.result?.transfers) newTransactions.push(...processTxs(receivedData.result.transfers, "received"));

      const sorted = newTransactions.sort((a, b) => b.blockNumber - a.blockNumber);
      setTransactions(sorted);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setIsTxLoading(false);
    }
  }, [accountAddress]);

  const fetchWalletData = useCallback(async () => {
      if (!accountAddress) return;
      
      try {
        setIsDataLoading(true);
        const newProvider = new ethers.JsonRpcProvider(ALCHEMY_URL);
        setProvider(newProvider);

        const [bal, priceResponse] = await Promise.all([
          newProvider.getBalance(accountAddress),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd').then(res => res.json())
        ]);
        
        setBalance(ethers.formatEther(bal));
        if (priceResponse?.ethereum?.usd) {
          setEthPrice(priceResponse.ethereum.usd);
        }

        const savedTokens = localStorage.getItem(`tokens_${accountAddress}`);
        if (savedTokens) setTokens(JSON.parse(savedTokens));

        await fetchTransactionHistory();
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast.error("Failed to load wallet data.");
      } finally {
        setIsDataLoading(false);
      }
  }, [accountAddress, fetchTransactionHistory]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const formatAddress = (address) => `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard!");
  };

  const tabs = [{ id: "transactions", name: "Activity", icon: "📊" }, { id: "tokens", name: "Tokens", icon: "💰" }];

  if (isDataLoading) return <div className="text-center text-white pt-20">Loading Dashboard...</div>;
  if (!wallet) return <div className="text-center text-red-400 pt-20">Could not load wallet data. Please try again.</div>;

  return (
    <div className="min-h-screen p-4 mt-16">
      <div className="max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">My Wallet</h1>
              <button onClick={() => copyToClipboard(accountAddress)} className="text-white/70 text-sm hover:text-white transition-colors flex items-center space-x-1">
                <span>{formatAddress(accountAddress)}</span>
                <Copy size={14} />
              </button>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setShowQR(true)} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <QrCode size={20} className="text-white" />
              </button>
            </div>
          </div>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-1">{Number.parseFloat(balance).toFixed(4)} ETH</div>
            <div className="text-white/50 text-md">{`≈ $${(Number.parseFloat(balance) * ethPrice).toFixed(2)} USD`}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setShowTransfer(true)} className="py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 flex flex-col items-center">
              <ArrowUpRight size={20} className="mb-1" /> Send
            </button>
            <button onClick={() => setShowQR(true)} className="py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-200 flex flex-col items-center">
              <ArrowDownLeft size={20} className="mb-1" /> Receive
            </button>
            <button onClick={() => setShowSwap(true)} className="py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 flex flex-col items-center">
              <HandCoins size={20} className="mb-1" /> Swap
            </button>
          </div>
        </div>
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-1 border border-white/20 shadow-xl mb-4">
          <div className="grid grid-cols-2 gap-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setCurrentTab(tab.id)} className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${currentTab === tab.id ? "bg-white/20 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl">
          {currentTab === "transactions" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <button onClick={() => fetchTransactionHistory()} disabled={isTxLoading} className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 flex items-center space-x-1">
                    <RefreshCw size={14} className={isTxLoading ? "animate-spin" : ""} />
                    <span>{isTxLoading ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {transactions.length > 0 ? (
                  transactions.map((tx, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-200 hover:bg-white/10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${tx.type === 'sent' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {tx.type === 'sent' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                          </div>
                          <span className={`text-sm font-medium capitalize text-white`}>{tx.type} {tx.asset}</span>
                        </div>
                        <span className={`font-semibold ${tx.type === 'sent' ? 'text-red-400' : 'text-green-400'}`}>{tx.type === 'sent' ? '-' : '+'}{tx.amount}</span>
                      </div>
                      <div className="flex justify-between items-center text-white/70 text-xs mt-2">
                        <span>{tx.type === 'sent' ? 'To: ' : 'From: '}{formatAddress(tx.counterparty)}</span>
                        <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">View Tx</a>
                      </div>
                    </div>
                  ))
                ) : <div className="text-center py-8 text-white/50"><p>No transactions yet.</p></div>}
              </div>
            </div>
          )}
          {currentTab === "tokens" && (
            <TokenManager wallet={wallet} provider={provider} tokens={tokens} setTokens={setTokens} />
          )}
        </div>
      </div>
      {showTransfer && <TransferModal wallet={wallet} provider={provider} balance={balance} onClose={() => { setShowTransfer(false); fetchWalletData(); }} />}
      {showQR && <QRCodeModal address={accountAddress} onClose={() => setShowQR(false)} />}
      
      {/* {showSwap && <SwapModal wallet={wallet} provider={provider} onClose={() => { setShowSwap(false); fetchWalletData(); }} />} */}
    </div>
  )
}