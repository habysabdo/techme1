import React from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { ShieldAlert, Search, CheckCircle2, Clock, DollarSign, Award, ChevronRight } from 'lucide-react';
import { UserRole } from '../types';

import { ALL_CAR_BRANDS, ALL_CAR_BRAND_CATEGORIES } from '../data/allBrandsData';

interface HeroSectionProps {
  userRole: UserRole;
  searchBrand: string;
  setSearchBrand: (brand: string) => void;
  onOpenSosModal: () => void;
  onBrowseTechs: () => void;
  onOpenResumeModal: () => void;
  onOpenRequisitionModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userRole,
  searchBrand,
  setSearchBrand,
  onOpenSosModal,
  onBrowseTechs,
  onOpenResumeModal,
  onOpenRequisitionModal,
}) => {
  const popularBrands = [
    'All Brands',
    'Ford',
    'GM',
    'BMW',
    'Toyota',
    'Ram',
    'Honda',
    'Mercedes-Benz',
    'Porsche',
    'Nissan',
    'Subaru',
    'Hyundai',
    'Tesla',
  ];

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Modern Dealership Service Department Bay"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Left Copy */}
          <div className="lg:col-span-7">
            {/* Clean Unboxed Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3 tracking-wide">
              <span>AUTOMOTIVE TECHNICIAN ON-DEMAND TALENT MARKETPLACE</span>
              <span aria-hidden="true">·</span>
              <span>CERTIFIED DEALERSHIP BAY COVERAGE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
              Keep Your Service Bays Turning.{' '}
              <span className="text-amber-400">Certified Techs</span> Dispatched in Hours.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              When a master technician calls in sick or recall campaigns back up your service drive, DTN connects franchise dealerships with vetted, insured ASE Master and OEM-certified mechanics for emergency, contract, or full-time placement.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {userRole === 'dealership' ? (
                <>
                  <button
                    onClick={onOpenSosModal}
                    className="flex items-center gap-2.5 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-500 transition-all active:scale-95"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Request Emergency Bay Coverage</span>
                  </button>
                  <button
                    onClick={onBrowseTechs}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    <span>Browse Available Techs</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                  <button
                    onClick={onOpenRequisitionModal}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
                  >
                    Draft Job Spec with AI
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onOpenResumeModal}
                    className="flex items-center gap-2.5 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95"
                  >
                    <Award className="h-4 w-4" />
                    <span>Analyze Credentials & Unlock Elite Tiers</span>
                  </button>
                  <button
                    onClick={onBrowseTechs}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    <span>Explore High-Rate Gigs</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                </>
              )}
            </div>

            {/* Quick Brand Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 mr-1">Filter by OEM:</span>
              {popularBrands.map((b) => {
                const active = (b === 'All Brands' && searchBrand === '') || searchBrand === b;
                return (
                  <button
                    key={b}
                    onClick={() => setSearchBrand(b === 'All Brands' ? '' : b)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-white">Dealership Network Telemetry</h3>
                  <div className="text-xs text-slate-400 mt-0.5">Active across 48 metro dealership markets</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>98.2% Dispatch Fill Rate</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>Verified Techs</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">4,820+</div>
                  <div className="text-xs text-slate-400 mt-1">ASE Master & OEM Tiered</div>
                </div>

                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Clock className="h-3.5 w-3.5 text-red-400" />
                    <span>Emergency SOS</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">&lt; 2.4 hrs</div>
                  <div className="text-xs text-slate-400 mt-1">Average on-site dispatch</div>
                </div>

                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Avg Tech Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">142.8%</div>
                  <div className="text-xs text-slate-400 mt-1">Flagged vs clock hours</div>
                </div>

                <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                    <span>Dealer Revenue Saved</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">$38.4M+</div>
                  <div className="text-xs text-slate-400 mt-1">In prevented bay downtime</div>
                </div>
              </div>

              {/* Trust markers */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  Toolbox Insured up to $100k
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  Full 100% Background Screened
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
