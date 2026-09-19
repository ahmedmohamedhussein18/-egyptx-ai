'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, Plus, AlertCircle, PieChart as PieChartIcon, Receipt, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Food', 'Transport', 'Tickets', 'Hotels', 'Shopping', 'Activities', 'Other'];
const CURRENCIES = ['EGP', 'USD', 'EUR', 'GBP'];
const COLORS = ['#4CC9F0', '#F72585', '#4361EE', '#3A0CA3', '#7209B7', '#F8961E', '#90BE6D'];

export default function ExpensesContent() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [form, setForm] = useState({
    amount: '',
    currency: 'EGP',
    category: 'Food',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });

  const supabase = createClient();

  useEffect(() => {
    trackEvent('page_view');
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirectTo=/expenses');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('trip_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (fetchError) throw fetchError;
      setExpenses(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || isNaN(Number(form.amount))) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
        .from('trip_expenses')
        .insert({
          user_id: user.id,
          amount: Number(form.amount),
          currency: form.currency,
          category: form.category,
          description: form.description,
          expense_date: new Date(form.expense_date).toISOString()
        });

      if (insertError) throw insertError;

      // Reset form
      setForm({ ...form, amount: '', description: '' });
      await fetchExpenses();
      trackEvent('expense_added', { category: form.category, currency: form.currency });
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  }

  // Calculate totals
  const totalsByCurrency: Record<string, number> = {};
  expenses.forEach(exp => {
    if (!totalsByCurrency[exp.currency]) totalsByCurrency[exp.currency] = 0;
    totalsByCurrency[exp.currency] += Number(exp.amount);
  });

  // Calculate chart data (Normalize all to EGP for chart if possible, or just chart EGP)
  // For simplicity, we chart by category for the primary currency (or all if we just sum them raw, but let's separate by currency or just chart EGP)
  const egpExpenses = expenses.filter(e => e.currency === 'EGP');
  const chartDataMap: Record<string, number> = {};
  egpExpenses.forEach(exp => {
    if (!chartDataMap[exp.category]) chartDataMap[exp.category] = 0;
    chartDataMap[exp.category] += Number(exp.amount);
  });
  const chartData = Object.keys(chartDataMap).map(key => ({ name: key, value: chartDataMap[key] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-[#C9A84C]">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4"
          >
            Trip Expenses
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Track your spending across your Egypt journey
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form & Summary */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#C9A84C]" /> Add New Expense
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Amount</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={form.amount}
                      onChange={e => setForm({...form, amount: e.target.value})}
                      className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Currency</label>
                    <select 
                      value={form.currency}
                      onChange={e => setForm({...form, currency: e.target.value})}
                      className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={form.expense_date}
                    onChange={e => setForm({...form, expense_date: e.target.value})}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Note (Optional)</label>
                  <input 
                    type="text" 
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                    placeholder="e.g. Taxi to Pyramids"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#C9A84C] hover:bg-[#D4A373] text-[#030712] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Save Expense
                </button>
              </form>
            </div>

            {/* Total Spending Summary */}
            <div className="bg-[#1B6B93]/20 border border-[#1B6B93]/30 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm text-[#4CC9F0] uppercase tracking-wider font-bold mb-4">Total Spending Summary</h3>
              {Object.keys(totalsByCurrency).length === 0 ? (
                <p className="text-3xl font-bold text-white">0.00</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(totalsByCurrency).map(([curr, amt]) => (
                    <div key={curr} className="flex justify-between items-end">
                      <span className="text-3xl font-bold text-white">
                        {curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : ''}
                        {Number(amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-400 font-medium">{curr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: List & Charts */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl h-[350px] flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#C9A84C]" /> EGP Category Breakdown
              </h2>
              {chartData.length > 0 ? (
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} EGP`, 'Amount']}
                        contentStyle={{ backgroundColor: '#0A1628', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500 italic">
                  Not enough EGP data for chart
                </div>
              )}
            </div>

            {/* List */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Recent Expenses</h2>
              
              {expenses.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                  <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No expenses recorded yet.</p>
                  <p className="text-gray-500 mt-2">Start tracking your Egypt journey spending.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center p-4 bg-[#0A1628] rounded-2xl border border-white/5 hover:border-[#C9A84C]/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1B6B93]/20 flex items-center justify-center shrink-0">
                          <Tag className="w-5 h-5 text-[#4CC9F0]" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{exp.category}</p>
                          <p className="text-sm text-gray-400 line-clamp-1">{exp.description || 'No note'}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" /> {new Date(exp.expense_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg text-white">
                          {Number(exp.amount).toLocaleString()} <span className="text-sm text-gray-400">{exp.currency}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
