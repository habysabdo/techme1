import React, { useState } from 'react';
import { DealershipJob } from '../types';
import { Sparkles, Building2, Wrench, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface AiRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishJob: (job: DealershipJob) => void;
}

export const AiRequisitionModal: React.FC<AiRequisitionModalProps> = ({
  isOpen,
  onClose,
  onPublishJob,
}) => {
  const [dealershipName, setDealershipName] = useState('Premier Chevrolet-GMC of Dallas');
  const [brand, setBrand] = useState('GM');
  const [bayBottleneck, setBayBottleneck] = useState('Heavy Line 8L90/10L90 Transmission Shudder & Duramax Fuel Injection');
  const [coverageType, setCoverageType] = useState('Emergency SOS');
  const [duration, setDuration] = useState('3 Weeks (Immediate)');
  const [flatRateGuarantee, setFlatRateGuarantee] = useState('70');
  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedDraft(null);

    try {
      const res = await fetch('/api/ai/generate-requisition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealershipName,
          brand,
          bayBottleneck,
          coverageType,
          duration,
          flatRateGuarantee,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGeneratedDraft(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedDraft({
        title: `${brand} Master Transmission & Heavy Line Specialist - Emergency Coverage`,
        urgency: 'Immediate (Next 48 Hours)',
        summary: `${dealershipName} is seeking a certified ${brand} master technician to clear heavy service drive backlog. Dedicated bay, pre-staged parts, and guaranteed 45 hours minimum pay per week.`,
        requiredTools: [`${brand} OEM scan tool or Autel Ultra`, 'High-tonnage transmission jack and fixtures', 'PicoScope or modern lab scope'],
        duties: [
          `Clear ${bayBottleneck} backlog within 48-hour turn times`,
          'Perform complex warranty diagnosis strictly adhering to factory labor operation codes',
          'Document three C\'s (Condition, Cause, Correction) for 100% warranty claim audit pass rate',
        ],
        compensationPackage: `$${flatRateGuarantee}/hr guaranteed flat-rate + $500 tool transport stipend`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!generatedDraft) return;

    const newJob: DealershipJob = {
      id: `job-${Date.now()}`,
      dealershipName,
      logoLetter: brand.charAt(0),
      location: 'Dallas, TX',
      brand,
      title: generatedDraft.title,
      coverageType: coverageType as any,
      duration,
      payRate: `$${flatRateGuarantee}/hr Flat-Rate Guarantee`,
      flatRateBonus: 'Full 45 hr weekly guarantee + travel allowance',
      bayStatus: bayBottleneck,
      urgent: coverageType === 'Emergency SOS',
      requiredCerts: [`${brand} Certified`, 'ASE Master Automobile Tech'],
      postedDate: 'Just Now',
      openings: 2,
      description: generatedDraft.summary,
      perks: ['Tool transport reimbursement', 'Air conditioned clean bays', 'Foreman dedicated support'],
    };

    onPublishJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                AI Service Bay Requisition Drafter
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Generate high-conversion dealership coverage postings tailored to your bay backlog
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

        <div className="space-y-4">
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
                Brand / Franchise
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
                Coverage Type
              </label>
              <select
                value={coverageType}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Emergency SOS">Emergency SOS Surge</option>
                <option value="Contract">Per-Diem / Contract</option>
                <option value="Full-Time">Full-Time Placement</option>
                <option value="Part-Time">Part-Time / Weekend Fleet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Flat-Rate Guarantee Target ($/hr)
              </label>
              <input
                type="number"
                value={flatRateGuarantee}
                onChange={(e) => setFlatRateGuarantee(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none tabular-nums font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Bay Bottleneck / Backlog Description
            </label>
            <input
              type="text"
              value={bayBottleneck}
              onChange={(e) => setBayBottleneck(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Drafting with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Requisition Specification</span>
              </>
            )}
          </button>

          {/* Generated Result Preview */}
          {generatedDraft && (
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white">{generatedDraft.title}</h4>
                <span className="text-xs text-red-400 font-semibold bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  {generatedDraft.urgency}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{generatedDraft.summary}</p>

              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1.5">Required Duties:</div>
                <div className="space-y-1">
                  {generatedDraft.duties.map((d: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs font-semibold text-amber-400">
                Compensation: {generatedDraft.compensationPackage}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                >
                  Publish to DTN Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
