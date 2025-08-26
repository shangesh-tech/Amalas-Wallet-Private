'use client';

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import Chart from 'chart.js/auto';

type Asset = {
  name: string;
  symbol: string;
  price: string;
  change: string;
  icon: ReactElement;
};

type Token = {
  name: string;
  balance: string;
  profit: string;
  icon: ReactElement;
};

type HistoricalData = {
  prices: [number, number][];
};

export default function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const chartCoins = ['ethereum', 'bitcoin'];
  const allCoinIds = 'bitcoin,ethereum,shiba-inu,solana,tether';
  const colors = ['#4356c9', '#25a38a'];

  const generateMockData = (): HistoricalData => {
    const prices: [number, number][] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      prices.push([
        date.getTime(),
        1000 + Math.sin(i / 5) * 200 + Math.random() * 50
      ]);
    }
    return { prices };
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError('');

        const responseSimple = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${allCoinIds}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!responseSimple.ok) throw new Error('Failed to fetch simple price data');

        const data = await responseSimple.json();

        const historicalPromises = chartCoins.map(coinId =>
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`)
            .then(res => res.ok ? res.json() : { prices: [] })
            .catch(() => ({ prices: [] }))
        );
        const historicalResults = await Promise.all(historicalPromises);

        const getCoinIcon = (coinName: string): ReactElement => {
          switch (coinName.toLowerCase()) {
            case 'bitcoin':
            case 'ethereum':
            case 'shiba-inu':
            case 'solana':
            case 'tether':
              return (
                <svg className="w-8 h-8 rounded-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4v12m-3-9h6m-6 6h6"></path>
                </svg>
              );
            default:
              return (
                <svg className="w-8 h-8 rounded-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="12" x2="12" y2="12"></line>
                </svg>
              );
          }
        };

        const formattedAssets: Asset[] = Object.keys(data).map(key => {
          const coinData = data[key];
          const change = coinData.usd_24h_change !== undefined && coinData.usd_24h_change !== null ? coinData.usd_24h_change.toFixed(2) : 'N/A';
          const price = coinData.usd !== undefined && coinData.usd !== null ? `$${coinData.usd.toFixed(2)}` : 'N/A';
          return {
            name: key.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            symbol: key.slice(0, 4).toUpperCase(),
            price,
            change: `${change}%`,
            icon: getCoinIcon(key)
          };
        });

        const formattedTokens: Token[] = formattedAssets.slice(0, 2).map(asset => ({
          name: asset.name,
          balance: '1',
          profit: '0.003 BTC',
          icon: asset.icon
        }));

        setAssets(formattedAssets);
        setTokens(formattedTokens);
        setHistoricalData(historicalResults.filter(result => result.prices.length > 0) as HistoricalData[]);
        if (historicalResults.every(result => result.prices.length === 0)) {
          setHistoricalData([{ prices: generateMockData().prices }, { prices: generateMockData().prices }]);
        }
        setLoading(false);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
        setHistoricalData([{ prices: generateMockData().prices }, { prices: generateMockData().prices }]);
      }
    };

    fetchCryptoData();
  }, []);

  // Chart setup (unchanged)
  useEffect(() => {
    if (historicalData.length > 0 && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const datasets = historicalData.map((data, index) => {
        const prices = data.prices.map(price => price[1]);
        const coinName = chartCoins[index] ? chartCoins[index].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Fallback Data';
        const borderColor = colors[index] || '#ffffff';
        const backgroundColor = `rgba(${parseInt(borderColor.slice(1,3), 16)}, ${parseInt(borderColor.slice(3,5), 16)}, ${parseInt(borderColor.slice(5,7), 16)}, 0.2)`;

        return {
          label: `${coinName} Price (USD)`,
          data: prices,
          borderColor,
          backgroundColor,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        };
      });

      const dates = historicalData[0].prices.map(price => new Date(price[0]).toLocaleDateString());

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: { labels: dates, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { display: false }, y: { display: false } },
          plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } }
        }
      });
    }
  }, [historicalData]);

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#121422] text-white">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-[#121422] text-red-500">{error}</div>;

  return (
    <div className="flex bg-[#121422] min-h-screen text-gray-200 font-sans">
      <nav className="fixed top-0 left-0 w-full bg-[#121422] p-4 flex justify-between items-center z-50 shadow-lg lg:hidden">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <span className="text-xl font-bold">AMALAS</span>
        </div>
        <button className="text-gray-200 hover:text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>

      <div className="flex flex-1 pt-16 lg:pt-0">
        <aside className="w-64 p-6 hidden lg:flex flex-col border-r border-gray-700/50">
          <div className="flex items-center space-x-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="text-xl font-bold">AMALAS</span>
          </div>
          <nav className="flex-1 space-y-2">
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-[#27293b]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" ry="1"></rect><rect x="14" y="3" width="7" height="5" rx="1" ry="1"></rect><rect x="14" y="12" width="7" height="9" rx="1" ry="1"></rect><rect x="3" y="16" width="7" height="5" rx="1" ry="1"></rect></svg>
              <span>Dashboard</span>
            </a>
            {['WithDraw', 'Deposits', 'Buy Miner', 'Settings', 'Profile'].map((item) => (
              <a key={item} href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#27293b]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>{item}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-gray-700/50">
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#27293b]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Log Out</span>
            </a>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto">
          <header className="flex justify-between items-center mb-6 lg:mb-10">
            <h1 className="text-2xl font-semibold hidden sm:block">Dashboard</h1>
            <div className="flex items-center space-x-4 ml-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
                Connect Wallet
              </button>
              <span className="hidden sm:inline">Asad</span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-600"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.1a6.1 6.1 0 0 1-6.1-6.1 6.1 6.1 0 0 1 12.2 0 6.1 6.1 0 0 1-6.1 6.1z"></path></svg>
              </div>
            </div>
          </header>


          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#27293b] p-6 rounded-2xl flex items-center space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16l-4-4-4 4M12 12V4"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400">Total assets</h4>
                    <p className="text-2xl font-semibold">{assets.length > 0 ? assets[0].price : '$0.00'}</p>
                  </div>
                </div>
                <div className="bg-[#27293b] p-6 rounded-2xl flex items-center space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 8l4 4 4-4M12 12v8"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400">Total deposits</h4>
                    <p className="text-2xl font-semibold">{assets.length > 1 ? assets[1].price : '$0.00'}</p>
                  </div>
                </div>
                <div className="bg-[#27293b] p-6 rounded-2xl flex items-center space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16l4-4-4-4M12 8v8"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400">APY</h4>
                    <p className="text-2xl font-semibold">+12.3%</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#27293b] p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">BTC and ETH Price Chart</h3>
                </div>
                <div className="w-full h-[250px]">
                  <canvas ref={chartRef} className="w-full h-full"></canvas>
                </div>
              </div>

              <div className="bg-[#27293b] p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Tokens</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="py-2 text-left text-gray-400 font-normal">Name</th>
                        <th className="py-2 text-left text-gray-400 font-normal">Balance</th>
                        <th className="py-2 text-left text-gray-400 font-normal">Profit</th>
                        <th className="py-2 text-right text-gray-400 font-normal">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, index) => (
                        <tr key={index} className="border-b border-gray-700/50 last:border-b-0">
                          <td className="py-4 flex items-center space-x-3">
                            {token.icon}
                            <span className="font-medium">{token.name}</span>
                          </td>
                          <td className="py-4 text-gray-300">{token.balance}</td>
                          <td className="py-4 text-gray-300">{token.profit}</td>
                          <td className="py-4 text-right">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-full">
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-[#27293b] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Assets</h3>
                <a href="#" className="text-blue-400 text-sm hover:underline">View All</a>
              </div>
              <div className="space-y-4">
                {assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50">
                    <div className="flex items-center space-x-3">
                      {asset.icon}
                      <div>
                        <h4 className="font-semibold">{asset.name}</h4>
                        <p className="text-sm text-gray-400">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{asset.price}</p>
                      <p className="text-sm text-gray-400" style={{ color: asset.change.startsWith('-') ? '#ff4d4d' : '#25a38a' }}>
                          {asset.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl">
                View All
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
