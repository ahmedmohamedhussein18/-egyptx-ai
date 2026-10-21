'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeftRight } from 'lucide-react';

const currencies = [
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲' },
  { code: 'JOD', name: 'Jordanian Dinar', flag: '🇯🇴' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
  { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦' },
  { code: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿' },
  { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱' },
];

const fallbackRates: Record<string, number> = {
  EGP: 1, USD: 0.0204, EUR: 0.0188, GBP: 0.0161,
  SAR: 0.0765, AED: 0.0749, JPY: 3.06, CNY: 0.148,
  INR: 1.70, CAD: 0.0278, AUD: 0.0312, CHF: 0.0181,
  KWD: 0.00627, QAR: 0.0743, BHD: 0.00769, OMR: 0.00785,
  JOD: 0.0145, TRY: 0.695, RUB: 1.88, BRL: 0.116,
  MXN: 0.347, ZAR: 0.374, NGN: 32.6, KRW: 27.5,
  SGD: 0.0273, HKD: 0.159, NOK: 0.222, SEK: 0.215,
  DKK: 0.140, PLN: 0.0806, MAD: 0.204, DZD: 2.74,
  TND: 0.0637, PKR: 5.67, MYR: 0.0901, THB: 0.706,
  IDR: 323, ILS: 0.0749,
};

export default function PharaonicUniversalConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('EGP');
  const [to, setTo] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/exchange-rates');
      const data = await res.json();
      if (data.rates) {
        setRates(data.rates);
        setLastUpdate(data.lastUpdate);
        setIsLive(true);
      }
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convert = () => {
    const value = parseFloat(amount) || 0;
    const inEGP = value / (rates[from] || 1);
    const result = inEGP * (rates[to] || 1);
    return result >= 1 ? result.toFixed(2) : result.toFixed(6);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0A1628]/80 border border-[#C9A84C]/30 rounded-2xl p-6 backdrop-blur-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#C9A84C]">
          🏺 Currency Converter
        </h2>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isLive ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
            {isLive ? '🟢 Live Rates' : '🟡 Approximate'}
          </span>
          <button
            onClick={fetchRates}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 text-white/60 hover:text-[#C9A84C] transition-all cursor-pointer"
            title="Refresh rates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {lastUpdate && (
        <p className="text-xs text-gray-500 mb-3">Last updated: {new Date(lastUpdate).toLocaleString()}</p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount</label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-[#C9A84C] focus:outline-none transition-colors"
            placeholder="Enter amount..."
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:border-[#C9A84C] focus:outline-none transition-colors cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0A1628] text-white">
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={swap}
              title="Swap currencies"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 text-white/70 hover:text-[#C9A84C] transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:border-[#C9A84C] focus:outline-none transition-colors cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0A1628] text-white">
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-[#030712]/80 border border-[#C9A84C]/40 rounded-xl p-4 text-center mt-4">
          <p className="text-xs text-gray-400 mb-1">
            {amount || '0'} {from} =
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#C9A84C] tracking-wide">
            {convert()} <span className="text-base font-bold text-white">{to}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            1 {from} ≈ {((rates[to] || 1) / (rates[from] || 1)).toFixed(4)} {to}
          </p>
        </div>
      </div>
    </div>
  );
}
