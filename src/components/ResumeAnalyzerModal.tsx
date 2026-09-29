import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, Award, Wrench, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

interface ResumeAnalysisResult {
  fullName: string;
  experienceYears: number;
  aseLevel: string;
  oemCertifications: string[];
  topSpecialties: string[];
  toolOwnershipValue: string;
  dtnTier: string;
  hourlyRateBenchmark: string;
  efficiencyRatingEstimate: string;
  summary: string;
}

interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_RESUMES = [
  {
    title: 'Marcus Vance - Ford Senior Master Tech',
    text: `Marcus Vance - Automotive Master Technician
Experience: 16 years franchise dealership experience (Parkway Ford & Northside Lincoln).
Certifications:
- ASE World Class Technician (A1 through A8 certified)
- ASE L1 Advanced Engine Performance Specialist
- ASE L3 Light Duty Hybrid/Electric Vehicle Specialist
- Ford Senior Master Technician (Drivetrain, Engine, Electrical, Chassis, Hybrid/EV)
- High Voltage Safety Level 3 certification (Mustang Mach-E and F-150 Lightning battery repair)
- EPA Section 609 MVAC Refrigerant Recovery/Recycling
Equipment & Tooling:
- Snap-on EPIQ 68" Double Bank Roll Cab with stainless steel top ($65,000+ personal tool audit)
- PicoScope 4425A Master Automotive Oscilloscope with pressure transducers
- Ford FDRS / IDS laptop diagnostic setup with VCM III
Specialties:
- 10R80 and 10R140 automatic transmission diagnostics and overhaul
- 6.7L Power Stroke diesel turbo, high-pressure common rail fuel system repair
- Fleet turnaround and low warranty comeback rate (<1%)`,
  },
  {
    title: 'Elena Rostova - European BMW/Porsche Diagnostic Lead',
    text: `Elena Rostova - Master European Diagnostic Specialist
12 years specialized dealership experience across BMW, Audi, and Porsche.
Credentials:
- ASE Master Automobile Technician (A1-A8)
- BMW Master Certified Level 1 Technician
- Audi High-Voltage Expert (e-tron 800V battery architecture)
- Bosch Master Automotive Systems Specialist
Tooling:
- Complete Autel MaxiSys Ultra with VCMI & oscilloscope
- BMW ISTA/D and ISTA/P OEM diagnostic interface
- $85,000 documented tool inventory
Key Strengths:
- FlexRay, CAN-FD, and MOST optical bus diagnostic troubleshooting
- S58 and S63 twin-turbo direct-injection drivability and carbon clean service
- EV battery pack module replacement and cell balancing`,
  },
];

export const ResumeAnalyzerModal: React.FC<ResumeAnalyzerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze technician credentials');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error connecting to AI analysis server');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleText: string) => {
    setRawText(sampleText);
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                AI Technician Credential & Resume Analyzer
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Evaluates ASE certifications, OEM factory tiering, tool equity, and dealership flat-rate efficiency potential
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

        {/* Quick sample buttons */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2">Load sample technician resume:</div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_RESUMES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => loadSample(sample.text)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="mb-5">
          <label htmlFor="resume-textarea" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Paste Technician Resume, Work History, or Certification Numbers
          </label>
          <textarea
            id="resume-textarea"
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste raw technician bio, dealership history, ASE numbers, and scanner proficiencies here..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-slate-400">
            Powered by Gemini AI · Analyzes ASE, OEM, and tool inventory
          </span>
          <button
            onClick={handleAnalyze}
            disabled={loading || !rawText.trim()}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Auditing Credentials...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze & Score Technician</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-950/60 border border-red-800 p-3 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Results display */}
        {result && (
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-5 space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-bold text-white">{result.fullName}</h4>
                <div className="text-xs text-amber-400 font-medium">{result.aseLevel}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-amber-500/20 border border-amber-500/50 px-3 py-1 text-xs font-bold text-amber-400">
                  {result.dtnTier}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">Experience</div>
                <div className="text-base font-bold text-white tabular-nums">
                  {result.experienceYears} Years
                </div>
              </div>
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">Efficiency Estimate</div>
                <div className="text-base font-bold text-emerald-400 tabular-nums">
                  {result.efficiencyRatingEstimate}
                </div>
              </div>
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">Rate Benchmark</div>
                <div className="text-base font-bold text-amber-400 tabular-nums">
                  {result.hourlyRateBenchmark}
                </div>
              </div>
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400">Tool Ownership</div>
                <div className="text-base font-bold text-white tabular-nums truncate">
                  {result.toolOwnershipValue}
                </div>
              </div>
            </div>

            {/* OEM and Specialties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">OEM Certifications Detected:</div>
                <div className="space-y-1">
                  {result.oemCertifications.map((cert) => (
                    <div key={cert} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">Diagnostic Specialties:</div>
                <div className="space-y-1">
                  {result.topSpecialties.map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="rounded-lg bg-slate-900/80 p-3.5 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-400">Vetting Analysis: </span>
              {result.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
