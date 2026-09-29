import React, { useState, useMemo } from 'react';
import { Technician, DayShiftOpening } from '../types';
import { ALL_CAR_BRANDS, ALL_CAR_BRAND_CATEGORIES } from '../data/allBrandsData';
import { INITIAL_TECH_REVIEWS } from '../data/reviewsData';
import {
  Wrench,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  Award,
  Zap,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Car,
  FileCheck,
  Shield,
  Activity,
  Check,
  Calendar,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface TechnicianDirectoryProps {
  technicians: Technician[];
  searchBrand: string;
  setSearchBrand: (brand: string) => void;
  onBookTechnician: (tech: Technician) => void;
  onUpdateTechnicianSchedule?: (techId: string, updatedSchedule: DayShiftOpening[]) => void;
}

// Function to resolve specific OEM Master Level status and customized badge colors
export interface OemBadgeInfo {
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
  oemCategory: string;
}

export function getOemMasterStatus(tech: Technician): OemBadgeInfo {
  const brandList = tech.brands.map((b) => b.toLowerCase());
  const titleLower = tech.title.toLowerCase();
  const certsJoined = tech.certifications.join(' ').toLowerCase();

  // Ford Senior Master
  if (brandList.includes('ford') || brandList.includes('lincoln') || certsJoined.includes('ford senior master')) {
    return {
      label: 'Ford Senior Master Certified',
      shortLabel: 'Ford Senior Master',
      badgeBg: 'bg-blue-950/90',
      badgeBorder: 'border-blue-500/70',
      badgeText: 'text-blue-300',
      dotColor: 'bg-blue-400',
      oemCategory: 'Ford Motor Co.',
    };
  }

  // European Master (BMW / Audi / Porsche / Mercedes)
  if (
    brandList.includes('bmw') ||
    brandList.includes('audi') ||
    brandList.includes('mercedes-benz') ||
    brandList.includes('porsche') ||
    certsJoined.includes('bmw master')
  ) {
    return {
      label: 'European Master Diagnostic Level 1',
      shortLabel: 'BMW / Euro Master L1',
      badgeBg: 'bg-cyan-950/90',
      badgeBorder: 'border-cyan-400/70',
      badgeText: 'text-cyan-300',
      dotColor: 'bg-cyan-400',
      oemCategory: 'European Precision',
    };
  }

  // GM World Class Technician
  if (
    brandList.includes('chevrolet') ||
    brandList.includes('gmc') ||
    brandList.includes('cadillac') ||
    tech.aseLevel.toLowerCase().includes('gm world class') ||
    certsJoined.includes('gm world class')
  ) {
    return {
      label: 'GM World Class Certified Technician',
      shortLabel: 'GM World Class',
      badgeBg: 'bg-amber-950/90',
      badgeBorder: 'border-amber-400/80',
      badgeText: 'text-amber-300',
      dotColor: 'bg-amber-400',
      oemCategory: 'General Motors',
    };
  }

  // Toyota / Lexus Master Diagnostic Technician (MDT)
  if (
    brandList.includes('toyota') ||
    brandList.includes('lexus') ||
    certsJoined.includes('toyota master diagnostic') ||
    titleLower.includes('mdt')
  ) {
    return {
      label: 'Toyota & Lexus Master Diagnostic Tech (MDT)',
      shortLabel: 'Toyota MDT Master',
      badgeBg: 'bg-red-950/90',
      badgeBorder: 'border-red-500/70',
      badgeText: 'text-red-300',
      dotColor: 'bg-red-400',
      oemCategory: 'Toyota Motor Corp.',
    };
  }

  // Mopar / Stellantis Level 3 Master
  if (
    brandList.includes('chrysler') ||
    brandList.includes('dodge') ||
    brandList.includes('jeep') ||
    brandList.includes('ram') ||
    certsJoined.includes('stellantis') ||
    certsJoined.includes('mopar')
  ) {
    return {
      label: 'Stellantis / Mopar Level 3 Master',
      shortLabel: 'Mopar Level 3 Master',
      badgeBg: 'bg-orange-950/90',
      badgeBorder: 'border-orange-500/70',
      badgeText: 'text-orange-300',
      dotColor: 'bg-orange-400',
      oemCategory: 'Stellantis Mopar',
    };
  }

  // Honda / Acura Master Technician
  if (
    brandList.includes('honda') ||
    brandList.includes('acura') ||
    certsJoined.includes('honda master')
  ) {
    return {
      label: 'Honda & Acura Master Certified Level 4',
      shortLabel: 'Honda Master Tech L4',
      badgeBg: 'bg-emerald-950/90',
      badgeBorder: 'border-emerald-500/70',
      badgeText: 'text-emerald-300',
      dotColor: 'bg-emerald-400',
      oemCategory: 'Honda Motor Co.',
    };
  }

  // Nissan / Infiniti Master Technician
  if (
    brandList.includes('nissan') ||
    brandList.includes('infiniti') ||
    certsJoined.includes('consult-iii')
  ) {
    return {
      label: 'Nissan & Infiniti Master Certified Tech (NMT)',
      shortLabel: 'Nissan NMT Master',
      badgeBg: 'bg-rose-950/90',
      badgeBorder: 'border-rose-500/70',
      badgeText: 'text-rose-300',
      dotColor: 'bg-rose-400',
      oemCategory: 'Nissan Motor Co.',
    };
  }

  // Porsche & German Exotic Master
  if (
    brandList.includes('porsche') ||
    brandList.includes('ferrari') ||
    brandList.includes('mclaren') ||
    certsJoined.includes('piwis')
  ) {
    return {
      label: 'Porsche Gold Diagnostic & Exotic Specialist',
      shortLabel: 'Porsche Gold Master',
      badgeBg: 'bg-yellow-950/90',
      badgeBorder: 'border-yellow-500/70',
      badgeText: 'text-yellow-300',
      dotColor: 'bg-yellow-400',
      oemCategory: 'Porsche AG',
    };
  }

  // Subaru Master
  if (
    brandList.includes('subaru') ||
    certsJoined.includes('subaru senior master')
  ) {
    return {
      label: 'Subaru Senior Master Certified',
      shortLabel: 'Subaru Senior Master',
      badgeBg: 'bg-sky-950/90',
      badgeBorder: 'border-sky-500/70',
      badgeText: 'text-sky-300',
      dotColor: 'bg-sky-400',
      oemCategory: 'Subaru Corp.',
    };
  }

  // Hyundai / Kia / Genesis
  if (
    brandList.includes('hyundai') ||
    brandList.includes('kia') ||
    brandList.includes('genesis') ||
    certsJoined.includes('e-gmp')
  ) {
    return {
      label: 'Hyundai, Kia & Genesis Platinum Master (E-GMP)',
      shortLabel: 'Hyundai / Genesis Platinum',
      badgeBg: 'bg-indigo-950/90',
      badgeBorder: 'border-indigo-500/70',
      badgeText: 'text-indigo-300',
      dotColor: 'bg-indigo-400',
      oemCategory: 'Hyundai Motor Group',
    };
  }

  // Tesla & Pure EV Powertrain
  if (
    brandList.includes('tesla') ||
    brandList.includes('rivian') ||
    brandList.includes('polestar') ||
    brandList.includes('lucid') ||
    certsJoined.includes('toolbox 3')
  ) {
    return {
      label: 'Tesla & Next-Gen EV Powertrain Master',
      shortLabel: 'Tesla EV Powertrain',
      badgeBg: 'bg-violet-950/90',
      badgeBorder: 'border-violet-500/70',
      badgeText: 'text-violet-300',
      dotColor: 'bg-violet-400',
      oemCategory: 'EV Architectures',
    };
  }

  // Default ASE Master
  return {
    label: 'ASE Master Automobile Certified (A1-A8)',
    shortLabel: 'ASE Master Verified',
    badgeBg: 'bg-purple-950/90',
    badgeBorder: 'border-purple-500/70',
    badgeText: 'text-purple-300',
    dotColor: 'bg-purple-400',
    oemCategory: 'National ASE Master',
  };
}

// Helper to generate the rolling 7-day shift dates starting today
export function getRolling7Days(seedAvailability: string = 'Immediate SOS'): DayShiftOpening[] {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayName = daysOfWeek[d.getDay()];
    const displayDate = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    const isoDate = d.toISOString().split('T')[0];

    // Seed realistic availability:
    // If Immediate SOS: first 4 days open
    // If This Week: days 1, 3, 4 open
    // If Booked: only day 6 open
    let isOpen = false;
    if (seedAvailability === 'Immediate SOS') {
      isOpen = i < 5;
    } else if (seedAvailability === 'This Week') {
      isOpen = i === 1 || i === 2 || i === 4;
    } else {
      isOpen = i === 6;
    }

    return {
      date: isoDate,
      dayOfWeek: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : dayName,
      displayDate,
      isOpen,
      shiftType: i % 2 === 0 ? 'Full Day (8h)' : 'Morning Rush (4h)',
    };
  });
}

export const TechnicianDirectory: React.FC<TechnicianDirectoryProps> = ({
  technicians,
  searchBrand,
  setSearchBrand,
  onBookTechnician,
  onUpdateTechnicianSchedule,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedShiftDay, setSelectedShiftDay] = useState<string>('all'); // Filter by specific 7-day slot
  const [selectedTechForDetails, setSelectedTechForDetails] = useState<Technician | null>(null);

  // Local state for technician schedules (seeded from tech.weeklySchedule or getRolling7Days)
  const [techSchedules, setTechSchedules] = useState<Record<string, DayShiftOpening[]>>(() => {
    const initial: Record<string, DayShiftOpening[]> = {};
    technicians.forEach((t) => {
      initial[t.id] = t.weeklySchedule || getRolling7Days(t.availability);
    });
    return initial;
  });

  const next7DaysReference = useMemo(() => getRolling7Days('Immediate SOS'), []);

  // Toggle shift opening for a technician on a specific day
  const handleToggleDayShift = (techId: string, dayIndex: number) => {
    setTechSchedules((prev) => {
      const current = prev[techId] || getRolling7Days();
      const updated = current.map((day, idx) =>
        idx === dayIndex ? { ...day, isOpen: !day.isOpen } : day
      );
      if (onUpdateTechnicianSchedule) {
        onUpdateTechnicianSchedule(techId, updated);
      }
      return {
        ...prev,
        [techId]: updated,
      };
    });
  };

  const specialties = [
    { id: 'all', label: 'All Specialties' },
    { id: 'ev', label: 'Hybrid & High-Voltage EV' },
    { id: 'trans', label: 'Transmission & Heavy Line' },
    { id: 'diag', label: 'Driveability & Bus Diagnostics' },
    { id: 'diesel', label: 'Diesel Power Stroke / Duramax / Cummins' },
  ];

  const filteredTechs = useMemo(() => {
    return technicians.filter((tech) => {
      // Search term
      const matchesSearch =
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.brands.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));

      // Brand filter
      const matchesBrand =
        !searchBrand ||
        tech.brands.some((b) => b.toLowerCase().includes(searchBrand.toLowerCase()));

      // Specialty filter
      let matchesSpecialty = true;
      if (selectedSpecialty === 'ev') {
        matchesSpecialty =
          tech.certifications.some((c) => c.toLowerCase().includes('hybrid') || c.toLowerCase().includes('ev')) ||
          tech.aseLevel.toLowerCase().includes('l3');
      } else if (selectedSpecialty === 'trans') {
        matchesSpecialty =
          tech.title.toLowerCase().includes('transmission') ||
          tech.title.toLowerCase().includes('drivetrain') ||
          tech.certifications.some((c) => c.toLowerCase().includes('transmission'));
      } else if (selectedSpecialty === 'diag') {
        matchesSpecialty =
          tech.title.toLowerCase().includes('diagnostic') ||
          tech.certifications.some((c) => c.toLowerCase().includes('l1') || c.toLowerCase().includes('diagnostic'));
      } else if (selectedSpecialty === 'diesel') {
        matchesSpecialty =
          tech.bio.toLowerCase().includes('diesel') ||
          tech.certifications.some((c) => c.toLowerCase().includes('diesel'));
      }

      // 7-day schedule lookup
      const schedule = techSchedules[tech.id] || getRolling7Days(tech.availability);

      // Specific Day Shift Filter (e.g. today, tomorrow, day 3)
      let matchesDayShift = true;
      if (selectedShiftDay !== 'all') {
        const dayIdx = parseInt(selectedShiftDay, 10);
        if (!isNaN(dayIdx) && schedule[dayIdx]) {
          matchesDayShift = schedule[dayIdx].isOpen;
        }
      }

      // General Availability filter
      const openShiftCount = schedule.filter((s) => s.isOpen).length;
      let effectiveAvailability = tech.availability;
      if (openShiftCount >= 4) effectiveAvailability = 'Immediate SOS';
      else if (openShiftCount > 0) effectiveAvailability = 'This Week';
      else effectiveAvailability = 'Booked (2 Wks)';

      const matchesAvailability =
        selectedAvailability === 'all' || effectiveAvailability === selectedAvailability;

      return matchesSearch && matchesBrand && matchesSpecialty && matchesAvailability && matchesDayShift;
    });
  }, [technicians, searchTerm, searchBrand, selectedSpecialty, selectedAvailability, selectedShiftDay, techSchedules]);

  return (
    <div className="py-8">
      {/* Top Filter and Search Bar */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, OEM brand, or diagnostic specialty (e.g. Ford, FDRS, Duramax)..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Availability Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setSelectedAvailability('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedAvailability === 'all'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Techs
            </button>
            <button
              onClick={() => setSelectedAvailability('Immediate SOS')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedAvailability === 'Immediate SOS'
                  ? 'bg-red-600 text-white font-semibold'
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>Immediate SOS Only</span>
            </button>
            <button
              onClick={() => setSelectedAvailability('This Week')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedAvailability === 'This Week'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        {/* Specialty & Full OEM Brand Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" />
              Specialty:
            </span>
            {specialties.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSpecialty(s.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedSpecialty === s.id
                    ? 'bg-slate-200 text-slate-900 font-semibold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* All Car Brands Quick Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">All Car Brands:</span>
            <select
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-amber-400 font-medium focus:border-amber-500 focus:outline-none"
            >
              <option value="">All OEM Makes ({ALL_CAR_BRANDS.length})</option>
              {ALL_CAR_BRAND_CATEGORIES.map((cat) => (
                <optgroup key={cat.category} label={cat.category}>
                  {cat.brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {searchBrand && (
              <button
                onClick={() => setSearchBrand('')}
                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4"
              >
                Clear: {searchBrand} ×
              </button>
            )}
          </div>
        </div>

        {/* Real-time 7-Day Shift Openings Directory Filter Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-white">Next 7-Days Shift Coverage Filter:</span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Filter technicians with open bay shifts on specific days:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedShiftDay('all')}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                selectedShiftDay === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Any Day
            </button>
            {next7DaysReference.map((day, idx) => (
              <button
                key={day.date}
                onClick={() => setSelectedShiftDay(selectedShiftDay === String(idx) ? 'all' : String(idx))}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  selectedShiftDay === String(idx)
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="font-bold">{day.dayOfWeek}</span>
                <span className="opacity-70 text-[10px]">({day.displayDate.split(' ')[1]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Verified Automotive Technicians
          </h2>
          <div className="text-xs text-slate-400 mt-0.5">
            Showing {filteredTechs.length} verified technicians ready for dispatch
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      {filteredTechs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Wrench className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No matching technicians found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
            Try adjusting your brand filter or search term to discover certified technicians in nearby regions.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchBrand('');
              setSelectedSpecialty('all');
              setSelectedAvailability('all');
            }}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechs.map((tech) => {
            const oemBadge = getOemMasterStatus(tech);

            return (
              <div
                key={tech.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-slate-950/50 relative overflow-hidden group"
              >
                {/* Top Subtle OEM Master Status Accent Border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${oemBadge.dotColor}`}
                  title={oemBadge.label}
                />

                <div>
                  {/* Tech Header with Verified Certifications Badge Overlay */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    {/* Avatar Container with Badge Overlay */}
                    <div className="relative shrink-0">
                      <img
                        src={tech.avatar}
                        alt={tech.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-xl object-cover border border-slate-700 shadow-md"
                      />
                      {/* Certified Shield Icon Badge Overlaid on bottom-right of avatar */}
                      <div
                        className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-lg ${oemBadge.badgeBg} ${oemBadge.badgeBorder}`}
                        title={`Verified: ${oemBadge.label}`}
                      >
                        <ShieldCheck className={`h-3.5 w-3.5 ${oemBadge.badgeText}`} />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base font-bold text-white truncate">{tech.name}</h3>
                        {tech.availability === 'Immediate SOS' ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                            <span>SOS Ready</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                            {tech.availability}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-amber-400 font-medium truncate mt-0.5">
                        {tech.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {tech.location}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{tech.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Color-Coded 'Verified Certifications' Badge Pill Overlay */}
                  <div className="mb-3">
                    <div
                      className={`flex items-center justify-between gap-1.5 rounded-lg px-2.5 py-1.5 border text-xs font-semibold shadow-sm transition-all ${oemBadge.badgeBg} ${oemBadge.badgeBorder} ${oemBadge.badgeText}`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${oemBadge.dotColor} animate-pulse`} />
                        <span className="truncate">{oemBadge.label}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/60 px-1.5 py-0.5 rounded border border-current/20 shrink-0">
                        OEM Master
                      </span>
                    </div>
                  </div>

                {/* Brands & Certifications */}
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {tech.brands.map((b) => (
                      <span
                        key={b}
                        className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-semibold text-slate-200 border border-slate-700"
                      >
                        {b}
                      </span>
                    ))}
                    <span className="rounded bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-800/50">
                      {tech.aseLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tech.bio}
                  </p>
                </div>

                {/* Performance & Tooling Stats Grid */}
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-950/80 p-3 border border-slate-800/80 text-center mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400">Efficiency</div>
                    <div className="text-sm font-bold text-emerald-400 tabular-nums">
                      {tech.efficiencyRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Tool Value</div>
                    <div className="text-sm font-bold text-white tabular-nums">
                      {tech.toolValueEstimate}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Rating</div>
                    <div className="text-sm font-bold text-amber-400 tabular-nums flex items-center justify-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {tech.rating}
                    </div>
                  </div>
                </div>

                {/* Rates & Compensation */}
                <div className="flex items-center justify-between text-xs text-slate-300 py-1 px-0.5 mb-3">
                  <div>
                    <span className="text-slate-400">Hourly Rate: </span>
                    <span className="font-bold text-white tabular-nums">${tech.hourlyRate}/hr</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Flat-Rate Guarantee: </span>
                    <span className="font-semibold text-amber-400 tabular-nums">
                      ${tech.flatRateGuarantee}/hr min
                    </span>
                  </div>
                </div>

                {/* Real-Time Availability Calendar (Next 7 Days Shift Openings) */}
                {(() => {
                  const schedule = techSchedules[tech.id] || getRolling7Days(tech.availability);
                  const openCount = schedule.filter((s) => s.isOpen).length;

                  return (
                    <div className="rounded-lg bg-slate-950/90 border border-slate-800/90 p-2.5 mb-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-amber-400" />
                          <span>Real-time Availability (Next 7 Days)</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            openCount >= 4
                              ? 'bg-red-950/70 border-red-800/70 text-red-300'
                              : openCount > 0
                              ? 'bg-amber-950/70 border-amber-800/70 text-amber-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {openCount} of 7 Shifts Open
                        </span>
                      </div>

                      {/* 7-Day Shift Toggle Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {schedule.map((day, idx) => (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => handleToggleDayShift(tech.id, idx)}
                            title={`Click to toggle shift for ${day.dayOfWeek} (${day.displayDate}): ${day.isOpen ? 'OPEN FOR COVERAGE' : 'BOOKED / OFF'}`}
                            className={`flex flex-col items-center justify-center p-1.5 rounded text-center transition-all ${
                              day.isOpen
                                ? 'bg-amber-500/20 border border-amber-500/80 text-amber-300 hover:bg-amber-500/30'
                                : 'bg-slate-900/60 border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                            }`}
                          >
                            <span className="text-[10px] font-bold leading-tight">{day.dayOfWeek}</span>
                            <span className="text-[9px] opacity-80 leading-tight mt-0.5">
                              {day.displayDate.split(' ')[1]}
                            </span>
                            <span
                              className={`mt-1 h-1.5 w-1.5 rounded-full ${
                                day.isOpen ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 pt-1.5 border-t border-slate-900">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span>Amber = Open Bay Shift</span>
                        </span>
                        <span className="italic text-slate-500">Tap day to toggle coverage opening</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Compliance & Background Status Section with Clear Icons */}
                <div className="rounded-lg bg-slate-950/90 border border-slate-800/90 p-2.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Compliance & Background Status
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      100% Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Drug Screen Badge */}
                    <div className="flex items-center gap-1.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 p-1.5" title="10-Panel Drug Screen: Passed & Verified Active">
                      <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-emerald-300 leading-tight truncate">Drug Screen</div>
                        <div className="text-[9px] text-emerald-400/90 leading-tight">10-Panel Pass</div>
                      </div>
                    </div>

                    {/* Motor Vehicle Record (MVR) Badge */}
                    <div className="flex items-center gap-1.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 p-1.5" title="Motor Vehicle Record (MVR): Clean record, valid license for test drives">
                      <Car className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-emerald-300 leading-tight truncate">Clean MVR</div>
                        <div className="text-[9px] text-emerald-400/90 leading-tight">0-Pt License</div>
                      </div>
                    </div>

                    {/* Tool Insurance Badge */}
                    <div className="flex items-center gap-1.5 rounded-md bg-amber-950/40 border border-amber-800/50 p-1.5" title="Toolbox Commercial Policy: Insured against shop theft or transit damage">
                      <Shield className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-amber-300 leading-tight truncate">Tool Insured</div>
                        <div className="text-[9px] text-amber-400/90 leading-tight">$100k Policy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedTechForDetails(tech)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-center"
                >
                  View Credentials
                </button>
                <button
                  onClick={() => onBookTechnician(tech)}
                  className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm text-center"
                >
                  Book for Bay
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Tech Credentials Modal */}
      {selectedTechForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={selectedTechForDetails.avatar}
                    alt={selectedTechForDetails.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-xl object-cover border border-slate-700 shadow-md"
                  />
                  <div
                    className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-lg ${getOemMasterStatus(selectedTechForDetails).badgeBg} ${getOemMasterStatus(selectedTechForDetails).badgeBorder}`}
                  >
                    <ShieldCheck className={`h-3.5 w-3.5 ${getOemMasterStatus(selectedTechForDetails).badgeText}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedTechForDetails.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getOemMasterStatus(selectedTechForDetails).badgeBg} ${getOemMasterStatus(selectedTechForDetails).badgeBorder} ${getOemMasterStatus(selectedTechForDetails).badgeText}`}
                    >
                      {getOemMasterStatus(selectedTechForDetails).shortLabel}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-medium">
                    {selectedTechForDetails.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{selectedTechForDetails.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedTechForDetails.experienceYears} Years Automotive Experience</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTechForDetails(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Compliance & Background Status Section */}
            <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Compliance & Background Status
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/80">
                  <Check className="h-3 w-3" />
                  <span>Fully Cleared for Dealership Floor</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Drug Test Badge */}
                <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-3 flex items-start gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300">10-Panel Drug Screen</div>
                    <div className="text-[11px] text-emerald-400/90 font-medium">Status: Clean & Verified Pass</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">LabCorp / Quest Diagnostics Verified</div>
                  </div>
                </div>

                {/* Motor Vehicle Record (MVR) Badge */}
                <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-3 flex items-start gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Car className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300">Motor Vehicle Record (MVR)</div>
                    <div className="text-[11px] text-emerald-400/90 font-medium">Status: Clean 3-Year Record</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Valid Commercial Test-Drive License</div>
                  </div>
                </div>

                {/* Tool Insurance Badge */}
                <div className="rounded-lg bg-amber-950/40 border border-amber-800/60 p-3 flex items-start gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">Toolbox Insurance Policy</div>
                    <div className="text-[11px] text-amber-400/90 font-medium">Status: Active $100k Coverage</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Inland Marine Shop & Transit Floater</div>
                  </div>
                </div>
              </div>

              {/* Background check footnote */}
              <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>7-Year County, State, and Federal Criminal Background Check: <strong>Clear</strong></span>
                </span>
                <span className="text-slate-500">ID Verification: Verified Driver's License</span>
              </div>
            </div>

            {/* Dynamic 7-Day Real-Time Availability Calendar (Modal View) */}
            {(() => {
              const modalSchedule =
                techSchedules[selectedTechForDetails.id] || getRolling7Days(selectedTechForDetails.availability);
              const openShiftsCount = modalSchedule.filter((s) => s.isOpen).length;

              return (
                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Real-Time Shift Availability (Next 7 Days)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
                        {openShiftsCount} Openings Available
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    Technician-controlled availability calendar. Click any shift opening below to toggle bay coverage availability:
                  </p>

                  <div className="grid grid-cols-7 gap-2">
                    {modalSchedule.map((day, idx) => (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => handleToggleDayShift(selectedTechForDetails.id, idx)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          day.isOpen
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{day.dayOfWeek}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{day.displayDate.split(' ')[1]}</div>
                        <div className="mt-1.5">
                          <span
                            className={`inline-block px-1 py-0.5 rounded text-[9px] font-bold ${
                              day.isOpen
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {day.isOpen ? 'OPEN' : 'OFF'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-900">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <strong className="text-slate-200">Instant Dispatch Lock:</strong> Booking reserves technician immediately for selected open days.
                    </span>
                    <span className="text-amber-400/90 text-[10px] font-mono">Updates live in search filters</span>
                  </div>
                </div>
              );
            })()}

            {/* Complete Certifications Transcript */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Certified Automotive Credentials & Factory Badges
              </h4>
              <div className="space-y-1.5">
                {selectedTechForDetails.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-2 rounded-lg bg-slate-950 p-2.5 border border-slate-800/80 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Rig & Tool Inventory */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Toolbox & Diagnostic Equipment Audit
              </h4>
              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Total Tool Equity Valuation:</span>
                  <span className="font-bold text-white">{selectedTechForDetails.toolValueEstimate}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedTechForDetails.toolBrands.map((tool) => (
                    <span
                      key={tool}
                      className="rounded bg-slate-850 px-2 py-1 text-xs text-slate-300 border border-slate-700/80"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dealership Verified Reviews Transcript for this Technician */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>Dealership Service Manager Reviews</span>
                </h4>
                <span className="text-[11px] text-amber-400 font-semibold">
                  ★ {selectedTechForDetails.rating} ({selectedTechForDetails.reviewCount} Reviews)
                </span>
              </div>

              {INITIAL_TECH_REVIEWS.filter((r) => r.technicianId === selectedTechForDetails.id).length > 0 ? (
                <div className="space-y-2.5">
                  {INITIAL_TECH_REVIEWS.filter((r) => r.technicianId === selectedTechForDetails.id).map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="font-bold text-white ml-1">{rev.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{rev.verifiedRepairOrder}</span>
                      </div>
                      <p className="text-slate-300 italic">"{rev.comment}"</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                        <span>{rev.reviewerName} ({rev.reviewerRole}), {rev.dealershipName}</span>
                        <span className="text-emerald-400 font-semibold">{rev.efficiencyObserved}% Flagged</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs text-slate-400 text-center">
                  Verified 5-star performance record on all DTN dispatched repair orders.
                </div>
              )}
            </div>

            {/* Direct Dispatch / Booking Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                <span>Direct Contact: </span>
                <span className="text-white font-mono">{selectedTechForDetails.phone}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTechForDetails(null)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const tech = selectedTechForDetails;
                    setSelectedTechForDetails(null);
                    onBookTechnician(tech);
                  }}
                  className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400"
                >
                  Book for Immediate Coverage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
