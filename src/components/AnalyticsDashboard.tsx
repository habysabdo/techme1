import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Wrench,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Building2,
  Calendar,
  Sparkles,
  Sliders,
  Calculator,
  Trophy,
  Star,
  Medal,
  Award,
  Flame,
  CheckCircle2,
  ChevronRight,
  Car,
  Activity,
  Shield,
  FileCheck,
  AlertCircle,
  RefreshCw,
  Download,
  FileText,
  Printer,
  Check,
  X,
} from 'lucide-react';
import { INITIAL_TECHNICIANS } from '../data/mockData';
import { Technician } from '../types';
import { getOemMasterStatus } from './TechnicianDirectory';

// 6-Month Rolling Compliance & Background Renewal Forecast (Oct 2026 - Mar 2027)
const COMPLIANCE_RENEWALS_TREND_DATA = [
  {
    month: 'Oct 2026',
    drugScreensScheduled: 42,
    mvrRechecks: 36,
    insuranceAudits: 55,
    autoRenewedPct: 98.4,
    expiringAlerts: 2,
  },
  {
    month: 'Nov 2026',
    drugScreensScheduled: 58,
    mvrRechecks: 48,
    insuranceAudits: 62,
    autoRenewedPct: 98.9,
    expiringAlerts: 3,
  },
  {
    month: 'Dec 2026',
    drugScreensScheduled: 65,
    mvrRechecks: 54,
    insuranceAudits: 70,
    autoRenewedPct: 99.2,
    expiringAlerts: 1,
  },
  {
    month: 'Jan 2027',
    drugScreensScheduled: 84,
    mvrRechecks: 72,
    insuranceAudits: 90,
    autoRenewedPct: 99.0,
    expiringAlerts: 4,
  },
  {
    month: 'Feb 2027',
    drugScreensScheduled: 76,
    mvrRechecks: 68,
    insuranceAudits: 82,
    autoRenewedPct: 99.4,
    expiringAlerts: 2,
  },
  {
    month: 'Mar 2027',
    drugScreensScheduled: 95,
    mvrRechecks: 86,
    insuranceAudits: 104,
    autoRenewedPct: 99.6,
    expiringAlerts: 3,
  },
];

// Monthly billable hours growth and revenue recovered
const MONTHLY_TREND_DATA = [
  { month: 'Oct 2025', regularHours: 420, dtnHours: 110, totalHours: 530, revenueRecovered: 24750, efficiencyAvg: 131 },
  { month: 'Nov 2025', regularHours: 435, dtnHours: 145, totalHours: 580, revenueRecovered: 32625, efficiencyAvg: 134 },
  { month: 'Dec 2025', regularHours: 410, dtnHours: 180, totalHours: 590, revenueRecovered: 40500, efficiencyAvg: 138 },
  { month: 'Jan 2026', regularHours: 460, dtnHours: 210, totalHours: 670, revenueRecovered: 47250, efficiencyAvg: 141 },
  { month: 'Feb 2026', regularHours: 440, dtnHours: 240, totalHours: 680, revenueRecovered: 54000, efficiencyAvg: 143 },
  { month: 'Mar 2026', regularHours: 480, dtnHours: 295, totalHours: 775, revenueRecovered: 66375, efficiencyAvg: 147 },
  { month: 'Apr 2026', regularHours: 490, dtnHours: 320, totalHours: 810, revenueRecovered: 72000, efficiencyAvg: 146 },
  { month: 'May 2026', regularHours: 510, dtnHours: 360, totalHours: 870, revenueRecovered: 81000, efficiencyAvg: 149 },
  { month: 'Jun 2026', regularHours: 530, dtnHours: 410, totalHours: 940, revenueRecovered: 92250, efficiencyAvg: 152 },
  { month: 'Jul 2026', regularHours: 540, dtnHours: 435, totalHours: 975, revenueRecovered: 97875, efficiencyAvg: 150 },
  { month: 'Aug 2026', regularHours: 560, dtnHours: 470, totalHours: 1030, revenueRecovered: 105750, efficiencyAvg: 153 },
  { month: 'Sep 2026', regularHours: 585, dtnHours: 515, totalHours: 1100, revenueRecovered: 115875, efficiencyAvg: 154 },
];

// Technician efficiency breakdown by OEM specialization
const OEM_EFFICIENCY_DATA = [
  { brand: 'Ford Power Stroke / Heavy', internalStaff: 118, dtnContract: 148, targetBenchmark: 125 },
  { brand: 'GM / Allison Drivetrain', internalStaff: 122, dtnContract: 156, targetBenchmark: 125 },
  { brand: 'BMW / High-Voltage EV', internalStaff: 115, dtnContract: 152, targetBenchmark: 125 },
  { brand: 'Toyota Hybrid / ADAS', internalStaff: 124, dtnContract: 144, targetBenchmark: 125 },
  { brand: 'Stellantis / Cummins', internalStaff: 116, dtnContract: 142, targetBenchmark: 125 },
  { brand: 'Honda / Asian Imports', internalStaff: 120, dtnContract: 139, targetBenchmark: 125 },
];

// Bay Bottleneck Distribution
const BAY_BOTTLENECK_DATA = [
  { name: 'Heavy Transmission Overhaul', value: 34, color: '#f59e0b' },
  { name: 'EV / High Voltage Isolation', value: 24, color: '#06b6d4' },
  { name: 'Diesel Fuel Injection & Turbos', value: 22, color: '#10b981' },
  { name: 'Electrical & CAN Bus Diag', value: 12, color: '#a855f7' },
  { name: 'ADAS Sensor Alignment', value: 8, color: '#ec4899' },
];

// Day of week bay utilization surge
const DAY_OF_WEEK_DATA = [
  { day: 'Mon', flaggedHours: 142, clockHours: 98, surgeCapacity: 92 },
  { day: 'Tue', flaggedHours: 168, clockHours: 112, surgeCapacity: 96 },
  { day: 'Wed', flaggedHours: 175, clockHours: 115, surgeCapacity: 98 },
  { day: 'Thu', flaggedHours: 182, clockHours: 118, surgeCapacity: 100 },
  { day: 'Fri', flaggedHours: 190, clockHours: 120, surgeCapacity: 100 },
  { day: 'Sat (Fleet)', flaggedHours: 135, clockHours: 88, surgeCapacity: 88 },
];

interface AnalyticsDashboardProps {
  technicians?: import('../types').Technician[];
  onOpenSosModal: () => void;
  onSelectTechnician?: (tech: import('../types').Technician) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  technicians = INITIAL_TECHNICIANS,
  onOpenSosModal,
  onSelectTechnician,
}) => {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y'>('1Y');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'efficiency' | 'satisfaction'>('all');

  // Export State
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Interactive Projection Model Controls
  const [activeTechCount, setActiveTechCount] = useState<number>(12);
  const [avgHourlyBillableRate, setAvgHourlyBillableRate] = useState<number>(215);
  const [projectedUtilizationRate, setProjectedUtilizationRate] = useState<number>(85); // 85% billable utilization
  const [targetEfficiencyRate, setTargetEfficiencyRate] = useState<number>(140); // 140% flat-rate efficiency

  // Calculate current month leaderboard metrics for technicians
  const rankedTechnicians = React.useMemo(() => {
    // Current month estimated flagged hours (160 clock hrs * efficiency%)
    const enriched = technicians.map((tech, idx) => {
      const currentMonthFlagged = Math.round(160 * (tech.efficiencyRate / 100));
      // Dealership labor revenue produced this month ($215 average labor rate)
      const currentMonthRevenue = Math.round(currentMonthFlagged * 215);
      // CSI customer satisfaction index score (e.g. 98.6% based on rating)
      const csiScore = Number(((tech.rating / 5) * 100).toFixed(1));
      // First-time fix rate / comeback rate
      const comebackRate = (100 - csiScore * 0.2).toFixed(1);

      return {
        ...tech,
        currentMonthFlagged,
        currentMonthRevenue,
        csiScore,
        comebackRate,
        rank: idx + 1,
      };
    });

    if (leaderboardFilter === 'efficiency') {
      return [...enriched].sort((a, b) => b.efficiencyRate - a.efficiencyRate);
    }
    if (leaderboardFilter === 'satisfaction') {
      return [...enriched].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    // Default composite score: 60% efficiency + 40% rating
    return [...enriched].sort((a, b) => {
      const scoreA = (a.efficiencyRate / 160) * 60 + (a.rating / 5) * 40;
      const scoreB = (b.efficiencyRate / 160) * 60 + (b.rating / 5) * 40;
      return scoreB - scoreA;
    });
  }, [technicians, leaderboardFilter]);

  const filteredTrendData = React.useMemo(() => {
    if (timeRange === '3M') return MONTHLY_TREND_DATA.slice(-3);
    if (timeRange === '6M') return MONTHLY_TREND_DATA.slice(-6);
    return MONTHLY_TREND_DATA;
  }, [timeRange]);

  // Export Compliance Overview to CSV
  const handleExportCsv = () => {
    setIsExportingCsv(true);
    try {
      const headers = [
        'Technician ID',
        'Technician Name',
        'OEM Specialization',
        'Location',
        'Years Experience',
        '10-Panel Drug Screen Status',
        'Motor Vehicle Record (MVR)',
        'Toolbox Insurance Policy',
        'Tool Valuation',
        'Criminal Background Check',
        'Floor Clearance Status',
        'Audit Verification Date',
      ];

      const rows = technicians.map((tech) => {
        const oemBadge = getOemMasterStatus(tech);
        return [
          `"${tech.id}"`,
          `"${tech.name}"`,
          `"${oemBadge.label}"`,
          `"${tech.location}"`,
          `"${tech.experienceYears} yrs"`,
          `"${tech.drugScreenPassed ? 'PASSED (Clean 10-Panel)' : 'PENDING'}"`,
          `"${tech.motorVehicleRecordClear !== false ? 'CLEAN (0-Pt DMV Validated)' : 'RESTRICTED'}"`,
          `"${tech.toolInsuranceVerified !== false ? 'ACTIVE ($100,000 Inland Marine)' : 'EXPIRED'}"`,
          `"${tech.toolValueEstimate}"`,
          `"${tech.backgroundCheckPassed ? 'PASSED (7-Yr Criminal & SSN Clear)' : 'IN REVIEW'}"`,
          `"AUTHORIZED (Dealership Shop Floor Cleared)"`,
          `"${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}"`,
        ].join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `DTN_Dealership_Audit_Compliance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccessMessage('Compliance CSV report exported successfully for audit file.');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExportingCsv(false);
    }
  };

  // Projected 6-Quarter Revenue Growth Model
  // Calculation: Techs * (160 standard hrs/mo * 3 mo) * (utilization%) * (efficiency%) * (hourly billable rate)
  const projectionData = React.useMemo(() => {
    const quarters = [
      { quarter: 'Q4 2026', utilMult: 0.94, label: 'Current Base' },
      { quarter: 'Q1 2027', utilMult: 0.98, label: 'Ramping' },
      { quarter: 'Q2 2027', utilMult: 1.02, label: 'Optimized' },
      { quarter: 'Q3 2027', utilMult: 1.08, label: 'Surge Peak' },
      { quarter: 'Q4 2027', utilMult: 1.14, label: 'Scale Up' },
      { quarter: 'Q1 2028', utilMult: 1.20, label: 'Full Network' },
    ];

    const baseQuarterlyHours = 160 * 3; // 480 clock hrs/quarter per tech

    return quarters.map((q) => {
      const effectiveUtilization = (projectedUtilizationRate / 100) * q.utilMult;
      const effectiveEfficiency = targetEfficiencyRate / 100;
      // Actual billable hours produced per technician
      const billableHoursPerTech = Math.round(baseQuarterlyHours * effectiveUtilization * effectiveEfficiency);
      const totalQuarterlyHours = billableHoursPerTech * activeTechCount;
      const projectedGrossRevenue = Math.round(totalQuarterlyHours * avgHourlyBillableRate);
      // Baseline revenue if remaining at default 70% utilization and 115% efficiency
      const baselineQuarterlyHours = Math.round(baseQuarterlyHours * 0.70 * 1.15 * activeTechCount);
      const baselineGrossRevenue = Math.round(baselineQuarterlyHours * avgHourlyBillableRate);
      const revenueLift = projectedGrossRevenue - baselineGrossRevenue;

      return {
        quarter: q.quarter,
        label: q.label,
        billableHours: totalQuarterlyHours,
        baselineHours: baselineQuarterlyHours,
        projectedRevenue: projectedGrossRevenue,
        baselineRevenue: baselineGrossRevenue,
        revenueLift,
        effectiveUtilizationPct: Math.min(Math.round(effectiveUtilization * 100), 100),
      };
    });
  }, [activeTechCount, avgHourlyBillableRate, projectedUtilizationRate, targetEfficiencyRate]);

  // Aggregate totals
  const totalRecoveredRevenue = filteredTrendData.reduce((acc, curr) => acc + curr.revenueRecovered, 0);
  const totalBilledHours = filteredTrendData.reduce((acc, curr) => acc + curr.totalHours, 0);
  const totalDtnSurgeHours = filteredTrendData.reduce((acc, curr) => acc + curr.dtnHours, 0);
  const latestEfficiency = filteredTrendData[filteredTrendData.length - 1]?.efficiencyAvg || 154;

  // Projected Annual Revenue (sum of 4 quarters)
  const projectedAnnualRevenue = projectionData.slice(0, 4).reduce((sum, q) => sum + q.projectedRevenue, 0);
  const baselineAnnualRevenue = projectionData.slice(0, 4).reduce((sum, q) => sum + q.baselineRevenue, 0);
  const annualRevenueLift = projectedAnnualRevenue - baselineAnnualRevenue;

  return (
    <div className="py-8 space-y-8">
      {/* Top Header Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Dealership Fixed Operations Telemetry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Technician Efficiency, Revenue Impact & Growth Analytics
            </h2>
            <div className="text-xs text-slate-400 mt-1">
              Visualizing labor sales yield, bay downtime recovery, and DTN master contractor performance
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Time range selector */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
              {(['3M', '6M', '1Y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range === '1Y' ? 'Last 12 Mo' : range === '6M' ? 'Last 6 Mo' : 'Last 90 Days'}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenSosModal}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm whitespace-nowrap active:scale-95"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Deploy Bay Tech</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Gross Labor Revenue Recovered</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 tabular-nums">
              ${totalRecoveredRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 mt-1 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+38.4% YoY bay recovery</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Flagged Billable Hours</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {totalBilledHours.toLocaleString()} hrs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-amber-400 font-semibold">{totalDtnSurgeHours.toLocaleString()} hrs</span> from DTN surge techs
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Shop Efficiency Yield</span>
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400 tabular-nums">
              {latestEfficiency}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              vs. 125% national franchise benchmark
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Warranty Comeback Rate</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              0.82%
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              Zero warranty audit clawbacks
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Billable Hours Growth & Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Area Chart: Billable Hours & Revenue */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Billable Hours Growth & Bay Downtime Recovery
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stacked production: Internal dealership staff baseline vs. DTN surge contractors
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                Staff Baseline
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                DTN Surge Contractors
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDtn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRegular" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="month"
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
                  tickFormatter={(val) => `${val}h`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{label}</div>
                          <div className="text-amber-400">DTN Surge Hours: <strong>{data.dtnHours} hrs</strong></div>
                          <div className="text-slate-400">Regular Staff: <strong>{data.regularHours} hrs</strong></div>
                          <div className="text-white font-semibold pt-1 border-t border-slate-800">
                            Total Flagged: {data.totalHours} hrs
                          </div>
                          <div className="text-emerald-400 font-bold">
                            Gross Revenue: ${data.revenueRecovered.toLocaleString()}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="regularHours"
                  stackId="1"
                  stroke="#64748b"
                  fill="url(#colorRegular)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="dtnHours"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#colorDtn)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Impact Trend Line */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Monthly Labor Revenue Recovered
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prevented bay loss via on-demand placement
            </p>

            <div className="mt-4 h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    tickFormatter={(val) => val.split(' ')[0]}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs">
                            <div className="text-slate-400">{d.month}</div>
                            <div className="text-emerald-400 font-bold mt-0.5">
                              +${d.revenueRecovered.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500">Efficiency: {d.efficiencyAvg}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenueRecovered"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Peak Month Yield:</span>
            <span className="font-bold text-emerald-400 tabular-nums">+$115,875 / mo</span>
          </div>
        </div>
      </div>

      {/* Row 2: OEM Efficiency Comparison & Bay Bottleneck Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* OEM Efficiency Bar Chart */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Technician Efficiency by OEM Brand Specialization (%)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparing DTN Master Contractors vs. Dealership Internal Staff
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                DTN Techs
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                Internal Staff
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OEM_EFFICIENCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="brand"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `${val}%`}
                  domain={[90, 170]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs space-y-1">
                          <div className="font-bold text-white">{d.brand}</div>
                          <div className="text-amber-400">DTN Master Techs: <strong>{d.dtnContract}%</strong></div>
                          <div className="text-slate-400">Internal Staff: <strong>{d.internalStaff}%</strong></div>
                          <div className="text-[10px] text-slate-500">Benchmark: {d.targetBenchmark}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="internalStaff" name="Internal Staff" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dtnContract" name="DTN Master Contractors" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bay Bottleneck Donut Chart */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Service Bay Bottleneck Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Categories where dealerships request emergency contractor relief
            </p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BAY_BOTTLENECK_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {BAY_BOTTLENECK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs">
                            <span className="font-semibold text-white">{d.name}</span>
                            <div className="text-amber-400 font-bold mt-0.5">{d.value}% of emergency bay calls</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {BAY_BOTTLENECK_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                  <span className="font-bold text-white ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Backlog Resolution Rate:</span>
            <span className="text-emerald-400 font-bold">96.8% under 48 hrs</span>
          </div>
        </div>
      </div>

      {/* Row 3: Day-of-Week Workload Surge Distribution */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Weekly Service Drive Workload & Surge Capacity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily flagged flat-rate hours vs. actual clocked hours showing highest weekend & Thursday surge pressure
            </p>
          </div>
          <div className="text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded">
            Highest Efficiency: Friday Service Drive (158%)
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DAY_OF_WEEK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
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
                tickFormatter={(val) => `${val}h`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const efficiency = Math.round((d.flaggedHours / d.clockHours) * 100);
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs space-y-1">
                        <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{d.day}</div>
                        <div className="text-amber-400">Flagged Hours Billed: <strong>{d.flaggedHours} hrs</strong></div>
                        <div className="text-slate-400">Clock Hours: <strong>{d.clockHours} hrs</strong></div>
                        <div className="text-emerald-400 font-bold">Efficiency: {efficiency}%</div>
                        <div className="text-sky-400 text-[10px]">Bay Capacity: {d.surgeCapacity}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="clockHours" name="Clock Hours Worked" fill="#334155" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flaggedHours" name="Billable Flat-Rate Hours" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Potential Revenue Growth Projection Model */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Calculator className="h-4 w-4" />
              <span>Predictive Fixed-Ops Revenue Model</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Projected Revenue Growth: Utilization & Billable Rate Dynamics
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Model multi-quarter dealership gross profit growth by calibrating technician bay utilization rates, shop door rates, and master tech efficiency multipliers against historical franchise baselines.
            </p>
          </div>

          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 flex items-center gap-3 shrink-0">
            <div>
              <div className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">12-Mo Projected Net Revenue Lift</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                +${annualRevenueLift.toLocaleString()}
              </div>
            </div>
            <span className="text-xs text-slate-400 border-l border-slate-800 pl-3 hidden sm:inline">
              vs. 70% unoptimized baseline
            </span>
          </div>
        </div>

        {/* Interactive Parameter Control Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          {/* Active Technician Count */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="tech-count-slider" className="text-slate-300 font-medium">Technicians on Roster</label>
              <span className="font-bold text-white tabular-nums text-sm">
                {activeTechCount} Techs
              </span>
            </div>
            <input
              id="tech-count-slider"
              type="range"
              min="4"
              max="35"
              step="1"
              value={activeTechCount}
              onChange={(e) => setActiveTechCount(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>4 Techs</span>
              <span>18 Techs</span>
              <span>35 Techs</span>
            </div>
          </div>

          {/* Average Hourly Billable Door Rate */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="billable-rate-slider" className="text-slate-300 font-medium">Avg Billable Door Rate</label>
              <span className="font-bold text-emerald-400 tabular-nums text-sm">
                ${avgHourlyBillableRate}/hr
              </span>
            </div>
            <input
              id="billable-rate-slider"
              type="range"
              min="160"
              max="310"
              step="5"
              value={avgHourlyBillableRate}
              onChange={(e) => setAvgHourlyBillableRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>$160/hr</span>
              <span>$235/hr</span>
              <span>$310/hr</span>
            </div>
          </div>

          {/* Target Utilization Rate */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="utilization-rate-slider" className="text-slate-300 font-medium">Target Bay Utilization</label>
              <span className="font-bold text-amber-400 tabular-nums text-sm">
                {projectedUtilizationRate}%
              </span>
            </div>
            <input
              id="utilization-rate-slider"
              type="range"
              min="65"
              max="98"
              step="1"
              value={projectedUtilizationRate}
              onChange={(e) => setProjectedUtilizationRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>65% (Slow)</span>
              <span>85% (Optimized)</span>
              <span>98% (Max)</span>
            </div>
          </div>

          {/* Target Efficiency Multiplier */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor="efficiency-rate-slider" className="text-slate-300 font-medium">Master Tech Efficiency</label>
              <span className="font-bold text-sky-400 tabular-nums text-sm">
                {targetEfficiencyRate}% Yield
              </span>
            </div>
            <input
              id="efficiency-rate-slider"
              type="range"
              min="110"
              max="165"
              step="5"
              value={targetEfficiencyRate}
              onChange={(e) => setTargetEfficiencyRate(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>110% (Staff)</span>
              <span>140% (DTN Avg)</span>
              <span>165% (Elite)</span>
            </div>
          </div>
        </div>

        {/* 6-Quarter Composed Projection Chart */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-slate-400 font-medium">
              6-Quarter Revenue Projection ($ USD) & Billable Production Hours
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                Unoptimized Baseline ($)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Projected Labor Revenue ($)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="h-0.5 w-4 bg-amber-400 inline-block" />
                Billable Production Hours (Line)
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projectionData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="quarter"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                {/* Left Axis: Gross Revenue */}
                <YAxis
                  yAxisId="revenue"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                {/* Right Axis: Billable Hours */}
                <YAxis
                  yAxisId="hours"
                  orientation="right"
                  stroke="#f59e0b"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#f59e0b' }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(1)}k hrs`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-3.5 shadow-2xl text-xs space-y-1.5 min-w-[240px]">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                            <span className="font-bold text-white text-sm">{label}</span>
                            <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                              {d.label} ({d.effectiveUtilizationPct}% Util)
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Projected Revenue:</span>
                            <strong className="text-emerald-400 text-sm tabular-nums">${d.projectedRevenue.toLocaleString()}</strong>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Status-Quo Baseline:</span>
                            <span className="text-slate-300 tabular-nums">${d.baselineRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-amber-400 font-semibold pt-1 border-t border-slate-800">
                            <span>Net Quarterly Lift:</span>
                            <span className="tabular-nums">+${d.revenueLift.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sky-400 text-[11px] pt-1">
                            <span>Total Billable Hours:</span>
                            <span className="tabular-nums font-mono">{d.billableHours.toLocaleString()} hrs</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  yAxisId="revenue"
                  dataKey="baselineRevenue"
                  name="Unoptimized Baseline ($)"
                  fill="#334155"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  yAxisId="revenue"
                  dataKey="projectedRevenue"
                  name="Projected Labor Revenue ($)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
                <Line
                  yAxisId="hours"
                  type="monotone"
                  dataKey="billableHours"
                  name="Billable Production Hours"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projection KPI Summary Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>4-Quarter Gross Revenue: <strong className="text-white tabular-nums">${projectedAnnualRevenue.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Projected Annual Hours: <strong className="text-amber-400 tabular-nums">{projectionData.slice(0, 4).reduce((sum, q) => sum + q.billableHours, 0).toLocaleString()} hrs</strong></span>
          </div>
          <div className="flex items-center justify-start sm:justify-end gap-2 text-slate-300">
            <span className="text-slate-400">Model Basis:</span>
            <span className="font-semibold text-slate-200">
              {activeTechCount} Techs @ ${avgHourlyBillableRate}/hr · {projectedUtilizationRate}% Util
            </span>
          </div>
        </div>
      </div>

      {/* Row 5: Top Performing Technicians Leaderboard */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Trophy className="h-4 w-4" />
              <span>Current Month Contractor Honor Roll · September 2026</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Top Performing Technicians Leaderboard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by verified flat-rate efficiency yield, flagged billable production, and dealership CSI customer satisfaction index
            </p>
          </div>

          {/* Leaderboard Sorting Tabs */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setLeaderboardFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                leaderboardFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overall Index
            </button>
            <button
              onClick={() => setLeaderboardFilter('efficiency')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                leaderboardFilter === 'efficiency'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Highest Efficiency (%)
            </button>
            <button
              onClick={() => setLeaderboardFilter('satisfaction')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                leaderboardFilter === 'satisfaction'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Highest CSI & Rating
            </button>
          </div>
        </div>

        {/* Top 3 Podium Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankedTechnicians.slice(0, 3).map((tech, index) => {
            const oemBadge = getOemMasterStatus(tech);
            const podiumMedal =
              index === 0
                ? { label: '1st Place · Gold Master', color: 'from-amber-500/20 border-amber-500/50 text-amber-300', iconColor: 'text-amber-400' }
                : index === 1
                ? { label: '2nd Place · Silver Lead', color: 'from-slate-400/20 border-slate-400/50 text-slate-200', iconColor: 'text-slate-300' }
                : { label: '3rd Place · Bronze Elite', color: 'from-orange-600/20 border-orange-600/40 text-orange-300', iconColor: 'text-orange-400' };

            return (
              <div
                key={tech.id}
                className={`rounded-xl border bg-gradient-to-b ${podiumMedal.color} to-slate-950/90 p-4.5 relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                      <Medal className={`h-4 w-4 ${podiumMedal.iconColor}`} />
                      <span>{podiumMedal.label}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      Rank #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={tech.avatar}
                        alt={tech.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-xl object-cover border border-slate-700 shadow-md"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm ${oemBadge.badgeBg} ${oemBadge.badgeBorder}`}
                      >
                        <ShieldCheck className={`h-3 w-3 ${oemBadge.badgeText}`} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{tech.name}</h4>
                      <div className="text-[11px] text-amber-400 truncate">{tech.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{tech.location}</div>
                    </div>
                  </div>

                  {/* Top Stats Callouts */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-950/90 p-2.5 border border-slate-800/80 mb-3 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Flat-Rate Efficiency</div>
                      <div className="text-lg font-black text-emerald-400 tabular-nums">
                        {tech.efficiencyRate}%
                      </div>
                      <div className="text-[9px] text-slate-500">vs 125% norm</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Customer CSI Score</div>
                      <div className="text-lg font-black text-amber-400 tabular-nums flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{tech.csiScore}%</span>
                      </div>
                      <div className="text-[9px] text-slate-500">{tech.rating} / 5.0 ({tech.reviewCount} reviews)</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 py-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Flagged Hours Billed:</span>
                    <strong className="text-white tabular-nums">{tech.currentMonthFlagged} hrs</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                    <span className="text-slate-400">Monthly Labor Value:</span>
                    <strong className="text-emerald-400 tabular-nums">${tech.currentMonthRevenue.toLocaleString()}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTechnician ? onSelectTechnician(tech) : onOpenSosModal()}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <span>Request for Bay Assignment</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Complete Leaderboard Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th scope="col" className="py-3 px-4">Rank</th>
                <th scope="col" className="py-3 px-4">Technician</th>
                <th scope="col" className="py-3 px-4">OEM Master Certification</th>
                <th scope="col" className="py-3 px-4 text-center">Flat-Rate Efficiency</th>
                <th scope="col" className="py-3 px-4 text-center">Dealership CSI Score</th>
                <th scope="col" className="py-3 px-4 text-right">Flagged Hours / Mo</th>
                <th scope="col" className="py-3 px-4 text-right">Labor Sales Produced</th>
                <th scope="col" className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {rankedTechnicians.map((tech, index) => {
                const oemBadge = getOemMasterStatus(tech);

                return (
                  <tr
                    key={tech.id}
                    className="hover:bg-slate-900/50 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold">
                        {index === 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-[11px] font-black">1</span>}
                        {index === 1 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-950 text-[11px] font-black">2</span>}
                        {index === 2 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-slate-950 text-[11px] font-black">3</span>}
                        {index > 2 && <span className="text-slate-500 font-mono text-xs pl-1">#{index + 1}</span>}
                      </div>
                    </td>

                    {/* Technician Name & Avatar */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={tech.avatar}
                          alt={tech.name}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                            {tech.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tech.location} · {tech.experienceYears} yrs exp
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* OEM Master Certification Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${oemBadge.badgeBg} ${oemBadge.badgeBorder} ${oemBadge.badgeText}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${oemBadge.dotColor}`} />
                        <span>{oemBadge.shortLabel}</span>
                      </span>
                    </td>

                    {/* Flat-Rate Efficiency */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-md tabular-nums">
                        <Zap className="h-3 w-3 text-emerald-400" />
                        <span>{tech.efficiencyRate}%</span>
                      </div>
                    </td>

                    {/* Customer CSI Score */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-950/50 border border-amber-800/60 px-2.5 py-1 rounded-md tabular-nums">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{tech.csiScore}%</span>
                        <span className="text-[10px] text-slate-400 font-normal">({tech.rating})</span>
                      </div>
                    </td>

                    {/* Flagged Hours */}
                    <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-semibold text-white tabular-nums">
                      {tech.currentMonthFlagged} hrs
                    </td>

                    {/* Labor Sales Produced */}
                    <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-bold text-emerald-400 tabular-nums">
                      ${tech.currentMonthRevenue.toLocaleString()}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onSelectTechnician ? onSelectTechnician(tech) : onOpenSosModal()}
                        className="rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors"
                      >
                        Book Bay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leaderboard Benchmark Footnote */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>All leaderboard scores verified via dealership DMS labor-time punch exports and factory warranty audit compliance.</span>
          </div>
          <span className="text-slate-500">Updated daily at 18:00 EST</span>
        </div>
      </div>

      {/* Row 6: Network-Wide Compliance & Verification Overview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Trust, Safety & Risk Mitigation Telemetry</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Network Compliance Overview & 6-Month Renewal Forecast
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated verification status across all {technicians.length} rostered technicians (Drug Screen 10-Panel, Motor Vehicle Record, and Commercial Toolbox Insurance)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 text-xs font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Audit Cleared</span>
            </div>

            {/* Export Actions for Service Managers */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={handleExportCsv}
                disabled={isExportingCsv}
                className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Download CSV spreadsheet of all technician background & compliance records for Excel / dealership auditing"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 rounded bg-amber-500 hover:bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 transition-colors shadow-sm"
                title="Generate printable PDF audit certificate and executive summary for manufacturer or insurance inspectors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Audit PDF Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Success Notification Banner */}
        {exportSuccessMessage && (
          <div className="flex items-center justify-between rounded-lg bg-emerald-950/80 border border-emerald-700/80 px-4 py-2 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
            <button
              onClick={() => setExportSuccessMessage(null)}
              className="text-emerald-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 Compliance Pillar Aggregation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Drug Screen Status Card */}
          <div className="rounded-xl bg-slate-950/90 p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400" />
                10-Panel Drug Screen
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                100% Clear
              </span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {technicians.filter((t) => t.drugScreenPassed).length} / {technicians.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Technicians active with passed 10-panel screens</div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
              <span>Next Group Re-screen:</span>
              <strong className="text-slate-300">Oct 24, 2026</strong>
            </div>
          </div>

          {/* Motor Vehicle Record (MVR) Card */}
          <div className="rounded-xl bg-slate-950/90 p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="h-4 w-4 text-emerald-400" />
                Motor Vehicle Record
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                0 Violations
              </span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {technicians.length} / {technicians.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Validated for road-testing & customer vehicle drives</div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
              <span>Continuous MVR Monitor:</span>
              <strong className="text-emerald-400">Real-Time DMV API</strong>
            </div>
          </div>

          {/* Toolbox Insurance Card */}
          <div className="rounded-xl bg-slate-950/90 p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-amber-400" />
                Toolbox & Equipment Policy
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80">
                $100k Floater
              </span>
            </div>
            <div className="text-2xl font-black text-amber-400 tabular-nums">
              $785,000
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Total active insured tool value across network</div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
              <span>Certificate of Insurance:</span>
              <strong className="text-emerald-400">Active On File</strong>
            </div>
          </div>

          {/* Background Investigation Card */}
          <div className="rounded-xl bg-slate-950/90 p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                Criminal Background
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                7-Yr Clean
              </span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {technicians.filter((t) => t.backgroundCheckPassed).length} / {technicians.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">County, state, federal and SSN trace clearance</div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
              <span>Audit Standard:</span>
              <strong className="text-slate-300">FCRA Compliant</strong>
            </div>
          </div>
        </div>

        {/* 6-Month Renewal Trend Graph & Risk Prevention Forecast */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  6-Month Compliance Renewal Pipeline & Audit Forecast (Oct 2026 - Mar 2027)
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Proactive automated 30-day pre-renewal notifications prevent bay downtime and maintain unbroken dealership shop insurance coverage
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span>Drug Screen Rechecks</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
                <span>MVR DMV Audits</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                <span>Toolbox Ins. Renewals</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COMPLIANCE_RENEWALS_TREND_DATA}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'Scheduled Audits', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3.5 shadow-xl text-xs">
                          <div className="font-bold text-white mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
                            <span>{label} Compliance Cycle</span>
                            <span className="text-emerald-400 font-mono text-[10px]">{data.autoRenewedPct}% Auto-Renew</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between gap-4 text-emerald-400">
                              <span>10-Panel Drug Screens:</span>
                              <strong>{data.drugScreensScheduled} verified</strong>
                            </div>
                            <div className="flex justify-between gap-4 text-sky-400">
                              <span>MVR Driving Record Audits:</span>
                              <strong>{data.mvrRechecks} clear</strong>
                            </div>
                            <div className="flex justify-between gap-4 text-amber-400">
                              <span>Tool Insurance Policies:</span>
                              <strong>{data.insuranceAudits} renewals</strong>
                            </div>
                            <div className="flex justify-between gap-4 text-slate-400 pt-1 border-t border-slate-800 text-[10px]">
                              <span>Pending Verification Notice:</span>
                              <span className="text-amber-300 font-semibold">{data.expiringAlerts} scheduled (auto-pinged)</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="drugScreensScheduled"
                  name="Drug Screen Rechecks"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="mvrRechecks"
                  name="MVR DMV Audits"
                  fill="#0ea5e9"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="insuranceAudits"
                  name="Tool Insurance Renewals"
                  fill="#f59e0b"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Zero-Lapse Protocol: Any contractor whose insurance or MVR renewal is within 14 days is auto-flagged and scheduled before booking clearance expires.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Avg Historical Auto-Renewal Rate: <strong>99.3%</strong></span>
            </div>
          </div>
        </div>

        {/* Detailed Compliance Status Table Across All Technicians */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th scope="col" className="py-3 px-4">Technician</th>
                <th scope="col" className="py-3 px-4">OEM Specialization</th>
                <th scope="col" className="py-3 px-4 text-center">10-Panel Drug Test</th>
                <th scope="col" className="py-3 px-4 text-center">Motor Vehicle Record (MVR)</th>
                <th scope="col" className="py-3 px-4 text-center">Tool Insurance ($100k)</th>
                <th scope="col" className="py-3 px-4 text-center">Criminal Background</th>
                <th scope="col" className="py-3 px-4 text-right">Floor Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {technicians.map((tech) => {
                const oemBadge = getOemMasterStatus(tech);

                return (
                  <tr key={tech.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Tech Name */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={tech.avatar}
                          alt={tech.name}
                          className="h-8 w-8 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white">{tech.name}</div>
                          <div className="text-[10px] text-slate-400">{tech.location}</div>
                        </div>
                      </div>
                    </td>

                    {/* OEM Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${oemBadge.badgeBg} ${oemBadge.badgeBorder} ${oemBadge.badgeText}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${oemBadge.dotColor}`} />
                        <span>{oemBadge.shortLabel}</span>
                      </span>
                    </td>

                    {/* Drug Test */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/70 border border-emerald-800/70 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                        <Activity className="h-3 w-3 text-emerald-400" />
                        <span>Passed (Clean)</span>
                      </span>
                    </td>

                    {/* MVR */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/70 border border-emerald-800/70 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                        <Car className="h-3 w-3 text-emerald-400" />
                        <span>Clean 0-Pt DMV</span>
                      </span>
                    </td>

                    {/* Tool Insurance */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-amber-950/70 border border-amber-800/70 px-2 py-1 text-[11px] font-semibold text-amber-300">
                        <Shield className="h-3 w-3 text-amber-400" />
                        <span>Active ({tech.toolValueEstimate})</span>
                      </span>
                    </td>

                    {/* Background */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/70 border border-emerald-800/70 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                        <FileCheck className="h-3 w-3 text-emerald-400" />
                        <span>7-Yr Clear</span>
                      </span>
                    </td>

                    {/* Overall Clearance */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-700/60">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Authorized</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Audit Report Certificate Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Controls Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Dealership Compliance & Risk Audit Certificate</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet (Dark/Print Friendly Paper Styled) */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 sm:p-8 space-y-6 text-slate-200">
              {/* Document Letterhead */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                    DEALERSHIP TALENT NETWORK · DTN COMPLIANCE OFFICE
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                    CERTIFICATE OF AUDIT CLEARANCE & VETTING
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Official Verification Transcript for Factory Warranty & Commercial Insurance Audits
                  </p>
                </div>
                <div className="text-right text-xs font-mono">
                  <div className="text-slate-400">Audit Docket: <span className="text-white font-bold">DTN-AUD-2026-9912</span></div>
                  <div className="text-slate-400">Date Issued: <span className="text-white">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                  <div className="text-emerald-400 font-bold mt-1">Status: PASSED / ZERO EXCEPTIONS</div>
                </div>
              </div>

              {/* Executive Summary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Rostered Technicians</div>
                  <div className="text-xl font-bold text-white tabular-nums mt-0.5">{technicians.length} Master Techs</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">100% Floor Cleared</div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">10-Panel Drug Screen</div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">100% Negative</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">LabCorp Certified</div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">MVR DMV Driving Status</div>
                  <div className="text-xl font-bold text-sky-400 tabular-nums mt-0.5">0 Points / Clean</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Valid Road-Test Endorsement</div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Toolbox Insurance In-Force</div>
                  <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">$785,000 Total</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">$100,000 Policy/Tech</div>
                </div>
              </div>

              {/* Summary Table of All Certified Techs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>AUDITED CONTRACTOR PERSONNEL MANIFEST</span>
                  <span className="text-[11px] text-slate-400 font-normal">FCRA Compliant 7-Year Background Screening</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/40">
                  <table className="w-full text-left text-[11px] text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Technician</th>
                        <th className="py-2 px-3">OEM Master Category</th>
                        <th className="py-2 px-3 text-center">Drug Test</th>
                        <th className="py-2 px-3 text-center">MVR Status</th>
                        <th className="py-2 px-3 text-center">Tool Insurance</th>
                        <th className="py-2 px-3 text-right">Floor Clearance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {technicians.map((t) => {
                        const oem = getOemMasterStatus(t);
                        return (
                          <tr key={t.id}>
                            <td className="py-2 px-3 font-semibold text-white">{t.name}</td>
                            <td className="py-2 px-3 text-slate-300">{oem.shortLabel}</td>
                            <td className="py-2 px-3 text-center text-emerald-400 font-medium">Passed (10-Panel)</td>
                            <td className="py-2 px-3 text-center text-sky-400 font-medium">Clean 0-Pt</td>
                            <td className="py-2 px-3 text-center text-amber-400 font-medium">$100,000 Active</td>
                            <td className="py-2 px-3 text-right text-emerald-400 font-bold">AUTHORIZED</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Compliance Verification Notice & Sign-off Box */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="text-xs font-bold text-white">DEALERSHIP AUDIT RISK & INDEMNIFICATION ATTESTATION</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  This document certifies that each contractor listed above has been vetted under DTN's Zero-Tolerance Dealership Placement Standard. All certifications, including 10-panel drug urinalysis, criminal history background checks, state DMV driving records, and commercial toolbox liability policies, are verified active and archived in accordance with factory warranty audit requirements.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Certified Audit Officer</div>
                    <div className="font-bold text-white mt-1">Evelyn Harper, VP of Risk & Compliance</div>
                    <div className="text-[10px] text-slate-400">Dealership Talent Network Trust Division</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Verification Seal & Hash</div>
                    <div className="font-mono text-[10px] text-emerald-400 mt-1 truncate">SHA-256: 4f8b91a27e3189c4120df01b9aa4</div>
                    <div className="text-[10px] text-slate-400">Archived to Dealership Portal Cloud</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-3">
                <span>Dealership Talent Network · Autonomous Fixed Operations Marketplace</span>
                <span>Confidential · Intended Solely for Franchise Dealership Internal Audit File</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
