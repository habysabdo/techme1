import React, { useState } from 'react';
import { Technician, DispatchTicket } from '../types';
import { ShieldAlert, Sparkles, CheckCircle2, Loader2, Wrench, MapPin, DollarSign } from 'lucide-react';
import { fireConfetti } from '../utils/confetti';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicians: Technician[];
  onDispatchConfirmed: (ticket: DispatchTicket) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  technicians,
  onDispatchConfirmed,
}) => {
  const [dealershipName, setDealershipName] = useState('Metro Ford Lincoln Auto Mall');
  const [brand, setBrand] = useState('Ford');
  const [urgency, setUrgency] = useState('Immediate (Next 4-8 Hours)');
  const [bayBottleneck, setBayBottleneck] = useState('Heavy Line 10R80 Transmission & Power Stroke Diesel backlog (14 ROs queued)');
  const [flatRateGuarantee, setFlatRateGuarantee] = useState(65);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFindMatches = async () => {
    setLoadingMatch(true);
    setMatches(null);

    try {
      const res = await fetch('/api/ai/match-technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: `${brand} Master Technician SOS`,
          brand,
          certifications: ['ASE Master', `${brand} Certified`],
          urgency,
          description: bayBottleneck,
          technicians,
        }),
      });

      if (!res.ok) throw new Error('Matching failed');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      // Fallback local match
      const fallback = technicians
        .filter((t) => t.brands.includes(brand) || t.brands.includes('Ford'))
        .map((t) => ({
          id: t.id,
          name: t.name,
          matchScore: 96,
          reasoning: `Matches exact OEM requirements for ${brand} with ${t.experienceYears} years experience and ${t.aseLevel}.`,
          warrantyReadiness: 'High (OEM Certified)',
          recommendedHourlyRate: t.hourlyRate,
        }));
      setMatches(fallback);
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleConfirmDispatch = (tech: Technician) => {
    // Trigger confetti
    try {
      fireConfetti();
    } catch (e) {
      // ignore
    }

    const newTicket: DispatchTicket = {
      id: `disp-${Date.now()}`,
      dealershipName,
      bayNumber: Math.floor(Math.random() * 6) + 1,
      technicianId: tech.id,
      technicianName: tech.name,
      vehicleModel: `${brand} Fleet / Customer Priority Backlog`,
      roNumber: `RO-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Clocked In',
      flatRateHoursBilled: 0,
      actualClockHours: 0.1,
      startedAt: 'Just Now',
      serviceAdvisor: 'Dispatch Central',
    };

    onDispatchConfirmed(newTicket);
    setSelectedTech(tech);
    setDispatchedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-red-900/60 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950 border border-red-800 text-red-400">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Emergency Bay Coverage (SOS Dispatch)
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Dispatch verified master mechanics to relieve critical dealership repair backlogs
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {dispatchedSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-bold text-white">Technician Dispatched!</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              <strong>{selectedTech?.name}</strong> has accepted your emergency bay dispatch for{' '}
              <strong>{dealershipName}</strong>. Tool verification and arrival ETA under 2 hours.
            </p>
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto">
              Ticket has been posted to your Live Bay Dispatch Board. Guaranteed minimum flat-rate
              protection activated.
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              View Live Bay Board
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step 1: Input details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Dealership Name
                </label>
                <input
                  type="text"
                  value={dealershipName}
                  onChange={(e) => setDealershipName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target OEM Brand
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Ford">Ford / Lincoln</option>
                  <option value="GM">Chevrolet / GMC / Cadillac</option>
                  <option value="BMW">BMW / European</option>
                  <option value="Toyota">Toyota / Lexus</option>
                  <option value="Chrysler">Chrysler / Dodge / Jeep / Ram</option>
                  <option value="Honda">Honda / Acura</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Immediate (Next 4-8 Hours)">Immediate (Next 4-8 Hours)</option>
                  <option value="Tomorrow Morning (7:00 AM)">Tomorrow Morning (7:00 AM)</option>
                  <option value="This Weekend Surge">This Weekend Surge</option>
                  <option value="Next Monday (2-Week Coverage)">Next Monday (2-Week Coverage)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Guaranteed Flat-Rate ($/hr)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={flatRateGuarantee}
                    onChange={(e) => setFlatRateGuarantee(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none tabular-nums font-mono"
                  />
                  <span className="text-xs text-slate-400">/hr min</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Shop Bottleneck / Problem Work Orders
              </label>
              <textarea
                rows={2}
                value={bayBottleneck}
                onChange={(e) => setBayBottleneck(e.target.value)}
                placeholder="Describe current backlog, specific engines/transmissions, or recall campaigns..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* AI Match Button */}
            <button
              onClick={handleFindMatches}
              disabled={loadingMatch}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50 transition-all shadow-lg shadow-red-600/25 active:scale-95"
            >
              {loadingMatch ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scanning DTN Network for Available {brand} Master Techs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run AI Talent Match for {brand} Bays</span>
                </>
              )}
            </button>

            {/* Matched Techs List */}
            {matches && (
              <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Top Recommended Master Techs Ready for Immediate Dispatch:
                </div>

                {matches.slice(0, 3).map((match) => {
                  const tech = technicians.find((t) => t.id === match.id) || technicians[0];

                  return (
                    <div
                      key={match.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={tech.avatar}
                          alt={tech.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-1.5 py-0.5 rounded">
                              {match.matchScore}% Match
                            </span>
                          </div>
                          <div className="text-xs text-amber-400 font-medium">{tech.title}</div>
                          <p className="text-xs text-slate-400 mt-1">{match.reasoning}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-white tabular-nums">
                            ${tech.hourlyRate}/hr
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {tech.distanceMiles || 10} miles away
                          </div>
                        </div>
                        <button
                          onClick={() => handleConfirmDispatch(tech)}
                          className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-500 shadow-md active:scale-95"
                        >
                          Dispatch Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
