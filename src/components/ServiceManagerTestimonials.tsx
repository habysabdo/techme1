import React, { useState, useEffect } from 'react';
import {
  Star,
  Quote,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Wrench,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { SERVICE_DIRECTOR_IMAGE, TECH_INSPECTION_IMAGE } from '../data/mockData';

export interface ManagerTestimonial {
  id: string;
  managerName: string;
  role: string;
  dealership: string;
  location: string;
  brand: string;
  avatar: string;
  rating: number;
  highlightMetric: string;
  metricLabel: string;
  quote: string;
  contractorName: string;
  contractorSpecialty: string;
  timeframe: string;
  verifiedDealer: boolean;
}

export const DEALERSHIP_TESTIMONIALS: ManagerTestimonial[] = [
  {
    id: 'test-1',
    managerName: 'Robert "Bob" Callahan',
    role: 'Fixed Operations Director',
    dealership: 'Parkway Ford Lincoln Supercenter',
    location: 'Dallas / Fort Worth, TX',
    brand: 'Ford / Lincoln',
    avatar: SERVICE_DIRECTOR_IMAGE,
    rating: 5,
    highlightMetric: '16 Diesels Cleared in 6 Days',
    metricLabel: 'Backlog turnaround turnaround rate',
    quote:
      'When our lead Power Stroke tech suffered a wrist injury on a Monday morning, we were facing customer loaner car chaos and a 3-week backlog. We submitted an Emergency SOS request on DTN, and Marcus arrived with his own FDRS diagnostic rig and tools within 3 hours. He flagged 74 billable hours in his first week with zero warranty comeback rejections. DTN saved our CSI score and over $45,000 in loaner fleet exposure.',
    contractorName: 'Marcus Vance',
    contractorSpecialty: 'Ford Senior Master & Diesel Lead',
    timeframe: 'Emergency SOS 2-Week Coverage',
    verifiedDealer: true,
  },
  {
    id: 'test-2',
    managerName: 'Christian Weber',
    role: 'Service Department Manager',
    dealership: 'Atlanta BMW of Buckhead',
    location: 'Atlanta, GA',
    brand: 'BMW / European',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    rating: 5,
    highlightMetric: '152% Flat-Rate Efficiency',
    metricLabel: 'Flagged vs. Clock Hours',
    quote:
      'High-voltage EV battery repairs on the iX and i4 were bottlenecking our master clean bays. Finding high-voltage safety certified technicians through standard recruiting agencies takes 3 to 6 months. DTN placed Elena with us on a 6-week contract. Her oscilloscope and bus communication diagnostics are world-class. She documented pristine factory 3-Cs that passed our factory warranty audit with 100% compliance.',
    contractorName: 'Elena Rostova',
    contractorSpecialty: 'European High-Voltage & Bus Diag',
    timeframe: '6-Week Contract Placement',
    verifiedDealer: true,
  },
  {
    id: 'test-3',
    managerName: 'David Kowalski',
    role: 'Fixed Ops & Fleet Service Director',
    dealership: 'Metro Detroit Chevrolet-GMC',
    location: 'Warren / Detroit, MI',
    brand: 'General Motors',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    rating: 5,
    highlightMetric: '$84,000 Gross Profit Preserved',
    metricLabel: '10L90 Valve Body Campaign Surge',
    quote:
      'We had 34 commercial Silverado trucks grounded waiting on 8L90 and 10L90 transmission valve body campaign recalls. Darnell took over our transmission bays and ran like an absolute machine — dropping, rebuilding, and programming units with GM MDI 2 in record time. Our service advisors were able to get fleet contractors back on the road in 24 hours. The cost of downtime calculator on DTN is 100% accurate.',
    contractorName: 'Darnell Jackson',
    contractorSpecialty: 'GM World Class & Heavy Drivetrain',
    timeframe: 'Surge Recall Surge (3 Weeks)',
    verifiedDealer: true,
  },
  {
    id: 'test-4',
    managerName: 'Sarah Jenkins',
    role: 'General Manager & Vice President',
    dealership: 'Crown Toyota & Lexus of Irvine',
    location: 'Irvine, CA',
    brand: 'Toyota / Lexus',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    rating: 5,
    highlightMetric: '0.2% Warranty Comeback Rate',
    metricLabel: 'Lowest comeback rate in district',
    quote:
      'Our permanent master diagnostic technician retired after 22 years with our store. Instead of rushing a bad hire, we brought in Kenji through DTN. The vetting was seamless: tool inventory audited, background clear, and hybrid safety credentials verified before he ever stepped onto our shop floor. We ended up offering him a permanent direct-hire placement. DTN is the gold standard for dealership fixed operations.',
    contractorName: 'Kenji Takahashi',
    contractorSpecialty: 'Toyota MDT & Hybrid Synergy Specialist',
    timeframe: 'Direct-Hire Transition',
    verifiedDealer: true,
  },
];

export const ServiceManagerTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 6.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEALERSHIP_TESTIMONIALS.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const current = DEALERSHIP_TESTIMONIALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DEALERSHIP_TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DEALERSHIP_TESTIMONIALS.length) % DEALERSHIP_TESTIMONIALS.length);
  };

  return (
    <section
      className="mt-14 pt-12 border-t border-slate-800/90"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
            <Building2 className="h-4 w-4" />
            <span>Dealership Leadership Field Reports</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Proven Results from Service Directors & Fixed Ops Leaders
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            See how franchise dealerships eliminate unbillable bay downtime and protect warranty compliance with DTN vetted master mechanics.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 mr-2 font-mono">
            {currentIndex + 1} / {DEALERSHIP_TESTIMONIALS.length}
          </span>
          <button
            onClick={handlePrev}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Spotlight Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Subtle Watermark Quote Icon */}
        <Quote className="absolute right-4 bottom-4 h-36 w-36 text-slate-800/20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Manager Profile & Metrics */}
          <div className="lg:col-span-4 space-y-4 lg:border-r lg:border-slate-800 lg:pr-8">
            <div className="flex items-center gap-3.5">
              <img
                src={current.avatar}
                alt={current.managerName}
                referrerPolicy="no-referrer"
                className="h-16 w-16 rounded-xl object-cover border-2 border-amber-500/40 shadow-lg shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white truncate">{current.managerName}</h3>
                  {current.verifiedDealer && (
                    <span title="Verified Franchise Dealer" className="text-amber-400">
                      <CheckCircle2 className="h-4 w-4 fill-amber-400/20 text-amber-400" />
                    </span>
                  )}
                </div>
                <div className="text-xs text-amber-400 font-medium truncate">{current.role}</div>
                <div className="text-xs text-slate-400 truncate">{current.dealership}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{current.location}</div>
              </div>
            </div>

            {/* Franchise Brand & Stars */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="rounded bg-slate-800/80 px-2 py-0.5 text-xs font-semibold text-slate-200 border border-slate-700">
                {current.brand}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* KPI Impact Callout Box */}
            <div className="rounded-xl bg-slate-950/80 p-3.5 border border-amber-500/30 shadow-inner">
              <div className="text-[10px] text-amber-400/90 font-semibold uppercase tracking-wider">
                {current.metricLabel}
              </div>
              <div className="text-xl font-black text-white tabular-nums mt-0.5">
                {current.highlightMetric}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>{current.timeframe}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Full Quote & Deployed Contractor Credit */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Quote className="h-4 w-4 text-amber-400" />
                <span>DEALERSHIP IMPACT TESTIMONIAL</span>
              </div>

              <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                "{current.quote}"
              </blockquote>
            </div>

            {/* Deployed Technician Match Credit */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Contractor Deployed: <strong className="text-emerald-400">{current.contractorName}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">{current.contractorSpecialty}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Toolbox Insured · 10-Panel Clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center gap-2">
          {DEALERSHIP_TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-8 bg-amber-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3 Quick Dealership Trust Metric Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">99.4% CSI Retention</div>
            <div className="text-xs text-slate-400">Customer satisfaction index preserved during sick leaves</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">&lt; 0.5% Warranty Bounce</div>
            <div className="text-xs text-slate-400">Adhering strictly to factory labor operation codes</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">&lt; 2.4 Hours Dispatch</div>
            <div className="text-xs text-slate-400">Average arrival with factory scanner on emergency calls</div>
          </div>
        </div>
      </div>
    </section>
  );
};
