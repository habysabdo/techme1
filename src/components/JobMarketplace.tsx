import React, { useState } from 'react';
import { DealershipJob, CoverageType } from '../types';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface JobMarketplaceProps {
  jobs: DealershipJob[];
  onApplyJob: (job: DealershipJob) => void;
  onOpenRequisitionModal: () => void;
}

export const JobMarketplace: React.FC<JobMarketplaceProps> = ({
  jobs,
  onApplyJob,
  onOpenRequisitionModal,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const types: { id: string; label: string }[] = [
    { id: 'all', label: 'All Openings' },
    { id: 'Emergency SOS', label: 'Emergency SOS Surge' },
    { id: 'Contract', label: 'Per-Diem & Contract' },
    { id: 'Full-Time', label: 'Full-Time (with Bonus)' },
    { id: 'Part-Time', label: 'Part-Time & Weekend' },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesType = selectedType === 'all' || job.coverageType === selectedType;
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.dealershipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="py-8">
      {/* Top Banner & Filter */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Dealership Bay Openings & Surge Gigs
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Guaranteed hourly minimums, tool transport allowances, and emergency surge rates
            </div>
          </div>
          <button
            onClick={onOpenRequisitionModal}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-amber-400 transition-colors whitespace-nowrap active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Bay Coverage</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by dealership, city, or brand (e.g. Ford, Dallas, BMW)..."
            className="rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none flex-1 max-w-md"
          />

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedType === t.id
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`rounded-xl border p-5 transition-all hover:shadow-xl ${
              job.urgent
                ? 'border-red-900/60 bg-gradient-to-r from-red-950/20 via-slate-900/80 to-slate-900/80 hover:border-red-700/80'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {job.urgent && (
                    <span className="flex items-center gap-1 font-bold text-red-400 bg-red-950/80 border border-red-800/80 px-2 py-0.5 rounded">
                      <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
                      CRITICAL EMERGENCY SOS
                    </span>
                  )}
                  <span className="font-semibold text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                    {job.brand} Certified
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-amber-400 font-medium">{job.coverageType}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400">{job.duration}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{job.postedDate}</span>
                </div>

                {/* Job Title & Dealership */}
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <span className="font-semibold text-slate-200">{job.dealershipName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {job.location}
                    </span>
                  </div>
                </div>

                {/* Bay bottleneck & description */}
                <div className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  <div className="text-amber-300 font-mono text-[11px] mb-1">
                    Bay Status: {job.bayStatus}
                  </div>
                  <p>{job.description}</p>
                </div>

                {/* Perks & Requirements */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {job.perks.map((perk) => (
                    <span
                      key={perk}
                      className="rounded bg-slate-950 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compensation & Apply Action */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0 shrink-0 min-w-[220px]">
                <div className="text-left lg:text-right">
                  <div className="text-base font-extrabold text-white tabular-nums">
                    {job.payRate}
                  </div>
                  <div className="text-xs text-amber-400 font-medium">
                    {job.flatRateBonus}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {job.openings} open bay {job.openings > 1 ? 'slots' : 'slot'}
                  </div>
                </div>

                <button
                  onClick={() => onApplyJob(job)}
                  className="rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm whitespace-nowrap active:scale-95"
                >
                  Apply & Claim Bay Shift
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
