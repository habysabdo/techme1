import React, { useState, useRef } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Printer,
  FileText,
  Clock,
  Wrench,
  Percent,
  Download,
  Share2,
  Calendar,
  Building2,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface BayCalculatorProps {
  onOpenSosModal: () => void;
}

export const BayCalculator: React.FC<BayCalculatorProps> = ({ onOpenSosModal }) => {
  // Required user inputs from prompt:
  // 1. Labor rate ($/hr)
  // 2. Average RO value ($/RO)
  // 3. Hours lost per day/week
  const [dealershipName, setDealershipName] = useState<string>('Metro Auto Mall Service Center');
  const [idleBays, setIdleBays] = useState<number>(2);
  const [laborRate, setLaborRate] = useState<number>(225); // Labor rate ($/hr)
  const [avgRoValue, setAvgRoValue] = useState<number>(780); // Average RO value ($)
  const [hoursLostPerDay, setHoursLostPerDay] = useState<number>(16); // Total hours lost per day across bays
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(22);
  const [partsToLaborRatio, setPartsToLaborRatio] = useState<number>(0.85); // $0.85 parts gross for every $1.00 labor
  const [dtnContractRate, setDtnContractRate] = useState<number>(75); // DTN tech replacement cost ($/hr)

  // Preset scenarios
  const applyPreset = (preset: 'single' | 'dual' | 'surge') => {
    if (preset === 'single') {
      setIdleBays(1);
      setHoursLostPerDay(8);
      setLaborRate(215);
      setAvgRoValue(720);
    } else if (preset === 'dual') {
      setIdleBays(2);
      setHoursLostPerDay(16);
      setLaborRate(235);
      setAvgRoValue(820);
    } else {
      setIdleBays(4);
      setHoursLostPerDay(32);
      setLaborRate(260);
      setAvgRoValue(940);
    }
  };

  // --- CORE DOWNTIME COST CALCULATIONS ---
  // 1. Pure Direct Labor Revenue Loss
  const dailyLaborRevenueLoss = hoursLostPerDay * laborRate;
  const monthlyLaborRevenueLoss = dailyLaborRevenueLoss * workingDaysPerMonth;
  const annualLaborRevenueLoss = monthlyLaborRevenueLoss * 12;

  // 2. Lost RO Volume (Based on standard 2.8 billable hours per repair order)
  const avgHoursPerRo = 2.8;
  const dailyLostRoCount = hoursLostPerDay / avgHoursPerRo;
  const monthlyLostRoCount = dailyLostRoCount * workingDaysPerMonth;
  const annualLostRoCount = monthlyLostRoCount * 12;

  // 3. Total Dealership Revenue Loss (Labor + Associated Parts Gross + Ancillary Services based on Avg RO Value)
  // If user specifies average RO value:
  const dailyTotalRoRevenueLoss = dailyLostRoCount * avgRoValue;
  const monthlyTotalRoRevenueLoss = dailyTotalRoRevenueLoss * workingDaysPerMonth;
  const annualTotalRoRevenueLoss = monthlyTotalRoRevenueLoss * 12;

  // Parts revenue component
  const dailyPartsLoss = dailyLaborRevenueLoss * partsToLaborRatio;
  const monthlyPartsLoss = dailyPartsLoss * workingDaysPerMonth;

  // 4. Net Recovery Analysis with DTN Placement
  const dailyDtnCost = hoursLostPerDay * dtnContractRate;
  const monthlyDtnCost = dailyDtnCost * workingDaysPerMonth;
  const monthlyNetRecovered = monthlyTotalRoRevenueLoss - monthlyDtnCost;
  const annualNetRecovered = annualTotalRoRevenueLoss - (monthlyDtnCost * 12);
  const roiMultiplier = monthlyDtnCost > 0 ? (monthlyTotalRoRevenueLoss / monthlyDtnCost).toFixed(1) : '0';

  // Projection breakdown chart data
  const lossTimelineData = [
    { period: '1 Day', laborLoss: Math.round(dailyLaborRevenueLoss), partsLoss: Math.round(dailyPartsLoss), totalLoss: Math.round(dailyTotalRoRevenueLoss), dtnCost: Math.round(dailyDtnCost), netSaved: Math.round(dailyTotalRoRevenueLoss - dailyDtnCost) },
    { period: '1 Week (5d)', laborLoss: Math.round(dailyLaborRevenueLoss * 5), partsLoss: Math.round(dailyPartsLoss * 5), totalLoss: Math.round(dailyTotalRoRevenueLoss * 5), dtnCost: Math.round(dailyDtnCost * 5), netSaved: Math.round((dailyTotalRoRevenueLoss - dailyDtnCost) * 5) },
    { period: '2 Weeks (10d)', laborLoss: Math.round(dailyLaborRevenueLoss * 10), partsLoss: Math.round(dailyPartsLoss * 10), totalLoss: Math.round(dailyTotalRoRevenueLoss * 10), dtnCost: Math.round(dailyDtnCost * 10), netSaved: Math.round((dailyTotalRoRevenueLoss - dailyDtnCost) * 10) },
    { period: '1 Month (22d)', laborLoss: Math.round(monthlyLaborRevenueLoss), partsLoss: Math.round(monthlyPartsLoss), totalLoss: Math.round(monthlyTotalRoRevenueLoss), dtnCost: Math.round(monthlyDtnCost), netSaved: Math.round(monthlyNetRecovered) },
    { period: '1 Quarter (66d)', laborLoss: Math.round(monthlyLaborRevenueLoss * 3), partsLoss: Math.round(monthlyPartsLoss * 3), totalLoss: Math.round(monthlyTotalRoRevenueLoss * 3), dtnCost: Math.round(monthlyDtnCost * 3), netSaved: Math.round(monthlyNetRecovered * 3) },
    { period: '1 Year (264d)', laborLoss: Math.round(annualLaborRevenueLoss), partsLoss: Math.round(monthlyPartsLoss * 12), totalLoss: Math.round(annualTotalRoRevenueLoss), dtnCost: Math.round(monthlyDtnCost * 12), netSaved: Math.round(annualNetRecovered) },
  ];

  // Print report trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 print:p-0 print:m-0 print:text-black">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto print:text-left print:max-w-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-xs font-semibold text-red-400 mb-3">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Cost-of-Downtime Financial Analysis Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Empty Service Bay Downtime & Revenue Loss Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed print:text-slate-700">
          Quantify the compounding financial hemorrhaging of empty lifts. Enter your shop door labor rate, average Repair Order (RO) value, and unflagged hours lost to generate an audit-ready executive loss projection.
        </p>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs print:hidden">
        <span className="text-slate-400 font-medium">Quick Dealership Scenarios:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('single')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              idleBays === 1 && hoursLostPerDay === 8
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            1 Sick Bay (8 hrs/day)
          </button>
          <button
            onClick={() => applyPreset('dual')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              idleBays === 2 && hoursLostPerDay === 16
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            2 Down Lifts (16 hrs/day)
          </button>
          <button
            onClick={() => applyPreset('surge')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              idleBays === 4 && hoursLostPerDay === 32
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            4 Recall Backlog Bays (32 hrs/day)
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Export PDF Report</span>
        </button>
      </div>

      {/* Main Two-Column Layout: Inputs vs Real-Time KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5 print:border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-400" />
              <span>Downtime Input Parameters</span>
            </h3>
            <span className="text-[11px] text-slate-400">Fixed-Ops Variables</span>
          </div>

          {/* Dealership Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Dealership / Service Facility
            </label>
            <input
              type="text"
              value={dealershipName}
              onChange={(e) => setDealershipName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Input 1: Hourly Labor Rate */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="input-labor-rate" className="text-slate-300 font-semibold flex items-center gap-1">
                <span>Customer Door Labor Rate ($/hr)</span>
              </label>
              <span className="font-bold text-emerald-400 tabular-nums text-sm">
                ${laborRate}/hr
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                id="input-labor-rate"
                type="number"
                min="120"
                max="350"
                step="5"
                value={laborRate}
                onChange={(e) => setLaborRate(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-7 pr-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="140"
              max="320"
              step="5"
              value={laborRate}
              onChange={(e) => setLaborRate(Number(e.target.value))}
              className="w-full accent-emerald-500 mt-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$140/hr (Domestic)</span>
              <span>$220/hr (Metro)</span>
              <span>$320/hr (Luxury/Euro)</span>
            </div>
          </div>

          {/* Input 2: Average RO Value */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="input-ro-value" className="text-slate-300 font-semibold flex items-center gap-1">
                <span>Average Repair Order (RO) Value</span>
              </label>
              <span className="font-bold text-amber-400 tabular-nums text-sm">
                ${avgRoValue} / RO
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                id="input-ro-value"
                type="number"
                min="300"
                max="2500"
                step="25"
                value={avgRoValue}
                onChange={(e) => setAvgRoValue(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-7 pr-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="400"
              max="1600"
              step="25"
              value={avgRoValue}
              onChange={(e) => setAvgRoValue(Number(e.target.value))}
              className="w-full accent-amber-500 mt-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$400 (Quick Lube)</span>
              <span>$780 (Dealer Avg)</span>
              <span>$1,600+ (Heavy Line/Diesel)</span>
            </div>
          </div>

          {/* Input 3: Hours Lost Per Day */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="input-hours-lost" className="text-slate-300 font-semibold flex items-center gap-1">
                <span>Unflagged Production Hours Lost / Day</span>
              </label>
              <span className="font-bold text-red-400 tabular-nums text-sm">
                {hoursLostPerDay} hrs / day
              </span>
            </div>
            <div className="relative">
              <input
                id="input-hours-lost"
                type="number"
                min="4"
                max="80"
                step="1"
                value={hoursLostPerDay}
                onChange={(e) => setHoursLostPerDay(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="4"
              max="48"
              step="2"
              value={hoursLostPerDay}
              onChange={(e) => setHoursLostPerDay(Number(e.target.value))}
              className="w-full accent-red-500 mt-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>4 hrs (Half Shift)</span>
              <span>16 hrs (2 Bays)</span>
              <span>48 hrs (6 Bays)</span>
            </div>
          </div>

          {/* Additional refinement toggles */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Working Days / Mo</label>
              <input
                type="number"
                min="18"
                max="26"
                value={workingDaysPerMonth}
                onChange={(e) => setWorkingDaysPerMonth(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">DTN Replacement ($/hr)</label>
              <input
                type="number"
                min="55"
                max="95"
                value={dtnContractRate}
                onChange={(e) => setDtnContractRate(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-amber-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Executive Downtime Report */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Red Alert Loss Card */}
          <div className="rounded-2xl border border-red-900/80 bg-gradient-to-br from-red-950/40 via-slate-900/90 to-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Total Projected Dealership Revenue Loss
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {dealershipName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">Daily Revenue Lost</div>
                <div className="text-2xl font-black text-red-400 tabular-nums mt-0.5">
                  ${Math.round(dailyTotalRoRevenueLoss).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{hoursLostPerDay} unflagged hrs</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">Monthly Revenue Lost</div>
                <div className="text-2xl font-black text-red-400 tabular-nums mt-0.5">
                  ${Math.round(monthlyTotalRoRevenueLoss).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{workingDaysPerMonth} shop days</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-red-900/40 bg-red-950/20">
                <div className="text-[11px] text-red-300 font-medium">Annualized Bay Loss</div>
                <div className="text-2xl font-black text-white tabular-nums mt-0.5">
                  ${Math.round(annualTotalRoRevenueLoss).toLocaleString()}
                </div>
                <div className="text-[10px] text-red-400 mt-1">Direct hit to store net profit</div>
              </div>
            </div>

            {/* Granular Line-Item Loss Breakdown */}
            <div className="rounded-xl bg-slate-950/90 p-4 border border-slate-800/80 text-xs space-y-2">
              <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1.5 flex justify-between">
                <span>Downtime Line-Item Accounting</span>
                <span>Monthly Amount</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Direct Labor Revenue Loss ({hoursLostPerDay * workingDaysPerMonth} hrs @ ${laborRate}/hr):</span>
                <strong className="text-red-400 font-mono tabular-nums">-${Math.round(monthlyLaborRevenueLoss).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Lost RO Turn Volume ({Math.round(monthlyLostRoCount)} Repair Orders unfulfilled):</span>
                <strong className="text-white font-mono tabular-nums">{Math.round(monthlyLostRoCount)} ROs/mo</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Associated OEM & Customer-Pay Parts Margin Loss:</span>
                <strong className="text-amber-400 font-mono tabular-nums">-${Math.round(monthlyPartsLoss).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-200 font-bold pt-2 border-t border-slate-800">
                <span className="text-red-400">Total Monthly Opportunity Cost:</span>
                <span className="text-red-400 font-mono text-sm tabular-nums">-${Math.round(monthlyTotalRoRevenueLoss).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* DTN Placement Recovery Card */}
          <div className="rounded-2xl border border-emerald-800/70 bg-gradient-to-br from-emerald-950/30 to-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  DTN Contractor Placement Net Recovery
                </h4>
              </div>
              <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-2.5 py-1 text-xs font-bold text-emerald-300">
                {roiMultiplier}x ROI Return
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Deploying a vetted DTN Master Technician at <strong>${dtnContractRate}/hr</strong> reclaims customer repair orders, satisfies factory warranty turnaround metrics, and prevents loaner car fleet expenses.
            </p>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <div className="text-[11px] text-slate-400">Monthly Placement Investment</div>
                <div className="text-xl font-bold text-slate-200 tabular-nums mt-0.5">
                  ${Math.round(monthlyDtnCost).toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-950/60 p-3.5 border border-emerald-800/80">
                <div className="text-[11px] text-emerald-300 font-medium">Net Dealership Profit Recovered</div>
                <div className="text-2xl font-black text-emerald-400 tabular-nums mt-0.5">
                  +${Math.round(monthlyNetRecovered).toLocaleString()} / mo
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSosModal}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95 print:hidden"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Deploy Vetted Techs to Stop This ${Math.round(dailyTotalRoRevenueLoss).toLocaleString()}/Day Loss</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Projected Loss Chart (Recharts Bar Chart) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Compounding Downtime Loss Horizon vs. DTN Net Profit Saved</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing cumulative gross revenue lost (red) against net dealership profit preserved (emerald)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Gross Lost Revenue
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Net Recovered Profit
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lossTimelineData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs space-y-1.5 shadow-2xl min-w-[210px]">
                        <div className="font-bold text-white border-b border-slate-800 pb-1">{label} Horizon</div>
                        <div className="text-red-400">
                          Gross Revenue Lost: <strong>-${d.totalLoss.toLocaleString()}</strong>
                        </div>
                        <div className="text-slate-400">
                          Labor Component: -${d.laborLoss.toLocaleString()}
                        </div>
                        <div className="text-amber-400">
                          Parts Margin Lost: -${d.partsLoss.toLocaleString()}
                        </div>
                        <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                          Net Profit Saved with DTN: +${d.netSaved.toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="totalLoss" name="Gross Lost Revenue" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={48} />
              <Bar dataKey="netSaved" name="Net Recovered Profit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Printable / Downloadable Formal Audit Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Service Operations Executive Audit Summary
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">Report ID: DTN-DOWNTIME-{Date.now().toString().slice(-6)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block">Facility Name:</span>
            <strong className="text-white">{dealershipName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Door Labor Rate:</span>
            <strong className="text-emerald-400">${laborRate} / billable hr</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Avg RO Value:</span>
            <strong className="text-amber-400">${avgRoValue} / ticket</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Daily Lost Hours:</span>
            <strong className="text-red-400">{hoursLostPerDay} hours / day</strong>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
          Based on the entered inputs, <strong>{dealershipName}</strong> incurs an unrecoverable labor revenue deficit of <strong>${Math.round(dailyTotalRoRevenueLoss).toLocaleString()} per business day</strong>, totaling <strong>${Math.round(annualTotalRoRevenueLoss).toLocaleString()} annually</strong>. Deploying DTN master technician coverage arrests 100% of this backlog with a net bottom-line profit recovery of <strong>+${Math.round(monthlyNetRecovered).toLocaleString()} monthly</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-500">
            Generated via Dealer Technician Network (DTN) Operational Modeling
          </span>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Executive Summary</span>
            </button>
            <button
              onClick={onOpenSosModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Claim Emergency Coverage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
