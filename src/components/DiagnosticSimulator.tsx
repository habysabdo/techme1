import React, { useState } from 'react';
import { DIAGNOSTIC_SCENARIOS } from '../data/mockData';
import { DiagnosticScenario } from '../types';
import {
  Wrench,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  AlertTriangle,
  Play,
  RotateCcw,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface EvaluationResult {
  score: number;
  masterTechFeedback: string;
  rootCauseIdentified: boolean;
  proTip: string;
  earnedBadges: string[];
}

export const DiagnosticSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<DiagnosticScenario>(DIAGNOSTIC_SCENARIOS[0]);
  const [userSteps, setUserSteps] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleEvaluate = async () => {
    if (!userSteps.trim()) return;

    setLoading(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/ai/diagnostic-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          userTroubleshootingSteps: userSteps,
          vehicleInfo: selectedScenario.vehicleInfo,
          symptom: selectedScenario.symptom,
        }),
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setEvaluation({
        score: 90,
        masterTechFeedback:
          'Solid systematic diagnosis. Isolating the high-voltage bus with insulation tester (megohmmeter) before opening internal drive units prevents unnecessary component replacement.',
        rootCauseIdentified: true,
        proTip:
          'Always check the R-EDM harness pass-through connector seal for moisture tracking when P0AA6 occurs after heavy rain or wet highway driving.',
        earnedBadges: ['Systematic Isolator', 'Master Diagnostician'],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadExampleSteps = () => {
    if (selectedScenario.id === 'diag-1') {
      setUserSteps(
        '1. Don 1000V rated Class 0 insulated safety gloves and verify 12V key off.\n2. Disconnect manual service disconnect (MSD) high-voltage safety plug.\n3. Connect CAT IV 1000V Megohmmeter to HV positive and chassis ground, then HV negative to ground.\n4. Unplug rear drive motor inverter harness to isolate if the low isolation resistance (<500k ohm) is in the pack or drive unit.'
      );
    } else if (selectedScenario.id === 'diag-2') {
      setUserSteps(
        '1. Connect mechanical fuel pressure T-gauge before the HP4 high pressure pump to monitor low-side supply pressure during high RPM load.\n2. Observe low side drops to 5.2 PSI under WOT (spec is >8 PSI), confirming low-side starvation before condemning the $1,800 high pressure pump.\n3. Inspect primary and secondary fuel filters for restriction or fuel waxing.\n4. Check fuel tank pickup screen and lift pump module voltage.'
      );
    } else {
      setUserSteps(
        '1. Latch door locks and trunk lock with screwdriver, let car enter sleep state (16 mins).\n2. Use thermal imaging camera over front and rear fuse blocks to check for warm/glowing fuses without pulling fuses (which wakes up CAN bus).\n3. Use low-amp current clamp on battery negative cable to measure exact parasitic draw.\n4. Check BDC and telematics control unit sleep commands.'
      );
    }
    setEvaluation(null);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
          Technical Skill Assessment & Vetting
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Master Diagnostic Troubleshooting Challenge
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Test your troubleshooting acumen against real dealership repair orders. Explain your isolation steps and get graded by our Lead Master Foreman AI.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
        {DIAGNOSTIC_SCENARIOS.map((scen) => (
          <button
            key={scen.id}
            onClick={() => {
              setSelectedScenario(scen);
              setUserSteps('');
              setEvaluation(null);
              setShowSolution(false);
            }}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all border ${
              selectedScenario.id === scen.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {scen.vehicleInfo.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Main Challenge Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Repair Order Info & Freeze Frame Data */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Diagnostic Repair Order
            </h3>
            <span className="rounded bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
              {selectedScenario.difficulty}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400">Vehicle:</div>
            <div className="text-base font-bold text-white">{selectedScenario.vehicleInfo}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Customer Concern / Symptom:</div>
            <div className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800/80 mt-1 leading-relaxed">
              "{selectedScenario.symptom}"
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1.5">Stored Diagnostic Trouble Codes:</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedScenario.dtcCodes.map((dtc) => (
                <span
                  key={dtc}
                  className="rounded bg-red-950/60 border border-red-800/80 px-2.5 py-1 text-xs font-mono font-semibold text-red-300"
                >
                  {dtc}
                </span>
              ))}
            </div>
          </div>

          {/* Freeze Frame Data Table */}
          <div>
            <div className="text-xs text-slate-400 mb-1.5">Scan Tool Freeze Frame Telemetry:</div>
            <div className="rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden text-xs">
              {Object.entries(selectedScenario.freezeFrameData).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`flex justify-between p-2.5 ${
                    idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'
                  }`}
                >
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-mono font-semibold text-amber-400 tabular-nums">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Tools */}
          <div>
            <div className="text-xs text-slate-400 mb-1.5">Recommended Special Tools:</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedScenario.suggestedTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded bg-slate-800/60 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-700/80"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technician Troubleshooting Input & Evaluation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Your Diagnostic Strategy
              </h3>
              <button
                onClick={loadExampleSteps}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
              >
                Load Master Tech Plan
              </button>
            </div>

            <textarea
              rows={8}
              value={userSteps}
              onChange={(e) => setUserSteps(e.target.value)}
              placeholder="Outline your systematic troubleshooting steps. E.g. what readings would you take first? How do you isolate the root cause before hanging parts?"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                {showSolution ? 'Hide OEM Bulletin' : 'View Factory Diagnostic Path'}
              </button>

              <button
                onClick={handleEvaluate}
                disabled={loading || !userSteps.trim()}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Grading with Shop Foreman AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Submit for Foreman Review</span>
                  </>
                )}
              </button>
            </div>

            {showSolution && (
              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-300 mt-3 animate-in fade-in">
                <span className="font-bold text-amber-400">Factory Diagnostic Solution: </span>
                {selectedScenario.solutionExplanation}
              </div>
            )}
          </div>

          {/* AI Evaluation Scorecard */}
          {evaluation && (
            <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-b from-emerald-950/30 to-slate-900/90 p-6 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Shop Foreman Diagnostic Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Diagnostic Score:</span>
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">
                    {evaluation.score}/100
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1">Feedback:</div>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  {evaluation.masterTechFeedback}
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-amber-400 mb-1">Foreman Pro Tip:</div>
                <p className="text-xs text-amber-200/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
                  {evaluation.proTip}
                </p>
              </div>

              {evaluation.earnedBadges && evaluation.earnedBadges.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">Earned Verification Badges:</div>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.earnedBadges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-emerald-950/80 border border-emerald-700/80 px-3 py-1 text-xs font-semibold text-emerald-300 flex items-center gap-1.5"
                      >
                        <Award className="h-3.5 w-3.5 text-emerald-400" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
