import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Technician Matcher API
app.post('/api/ai/match-technicians', async (req, res) => {
  try {
    const { jobTitle, brand, certifications, urgency, description, technicians } = req.body;

    if (!ai) {
      // Fallback matching logic when API key is not configured
      const scored = (technicians || []).map((tech: any) => {
        let matchScore = 80;
        if (tech.brands && tech.brands.includes(brand)) matchScore += 12;
        if (tech.aseLevel?.includes('Master')) matchScore += 6;
        return {
          id: tech.id,
          name: tech.name,
          matchScore: Math.min(matchScore, 98),
          reasoning: `Matches OEM requirements for ${brand} with ${tech.experienceYears} years experience and ${tech.aseLevel} certifications.`,
          warrantyReadiness: 'High (OEM Certified)',
          recommendedHourlyRate: tech.hourlyRate,
        };
      });
      return res.json({ matches: scored });
    }

    const prompt = `You are the lead Dispatch & Talent Matching AI for Dealer Technician Network (DTN).
Analyze this dealership coverage request and evaluate the candidate technicians.

DEALERSHIP JOB REQUIREMENT:
- Title: ${jobTitle || 'Automotive Technician'}
- Target Brand/OEM: ${brand || 'Any'}
- Required Certifications: ${certifications?.join(', ') || 'ASE'}
- Urgency: ${urgency || 'Standard'}
- Context/Backlog: ${description || 'General dealership service backlog'}

CANDIDATES:
${JSON.stringify(technicians || [], null, 2)}

Return a strict JSON object with a "matches" array. For each candidate evaluate:
- id: candidate id
- name: candidate name
- matchScore: integer between 65 and 99
- reasoning: 2 concise sentences explaining why this tech fits or where their OEM/diagnostic strengths lie
- warrantyReadiness: "Certified Ready", "Supervised Warranty", or "Customer-Pay Optimized"
- recommendedHourlyRate: number
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ai/match-technicians:', err);
    return res.status(500).json({
      error: 'Failed to compute AI matches',
      details: err?.message || 'Server error',
    });
  }
});

// 2. AI Technician Resume & Skill Analyzer
app.post('/api/ai/analyze-resume', async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    if (!ai) {
      // Mocked high-quality fallback analysis
      return res.json({
        fullName: 'Marcus Vance',
        experienceYears: 14,
        aseLevel: 'ASE Master Certified (A1-A8, L1)',
        oemCertifications: ['Ford Senior Master', 'Lincoln Certified Hybrid/EV', 'Rotunda Diagnostic Specialist'],
        topSpecialties: ['Engine Diagnostics & Driveability', '10-Speed Automatic Transmissions', 'High-Voltage Battery Servicing'],
        toolOwnershipValue: '$65,000+ (Snap-on EPIQ, Ford FDRS, PicoScope 4425A)',
        dtnTier: 'Tier 1 Elite Master',
        hourlyRateBenchmark: '$62 - $78/hr (or $52/flat-rate hr)',
        efficiencyRatingEstimate: '135% - 150%',
        summary: 'Veteran master technician with extensive franchise dealership service drive tenure. Exceptional electrical diagnosis track record with low warranty comeback rate (<1.2%).',
      });
    }

    const prompt = `You are the master technical vetting inspector for Dealer Technician Network (DTN).
Extract and evaluate the automotive technician's qualifications from the provided text:

"""
${rawText}
"""

Return a strict JSON object matching this schema:
{
  "fullName": string,
  "experienceYears": number,
  "aseLevel": string (e.g. "ASE Master Certified (A1-A8)", "ASE Certified Tech", "Apprentice"),
  "oemCertifications": string[],
  "topSpecialties": string[],
  "toolOwnershipValue": string (e.g. "$40,000+ (Snap-on, Matco, OEM Diagnostic PC)"),
  "dtnTier": "Tier 1 Elite Master" | "Tier 2 Senior Tech" | "Tier 3 Production Tech",
  "hourlyRateBenchmark": string,
  "efficiencyRatingEstimate": string (e.g. "125% - 145%"),
  "summary": string (3-4 sentences summarizing diagnostic depth, dealership warranty capability, and best brand fits)
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ai/analyze-resume:', err);
    return res.status(500).json({
      error: 'Failed to analyze resume',
      details: err?.message || 'Server error',
    });
  }
});

// 3. AI Job Requisition Generator
app.post('/api/ai/generate-requisition', async (req, res) => {
  try {
    const { dealershipName, brand, bayBottleneck, coverageType, duration, flatRateGuarantee } = req.body;

    if (!ai) {
      return res.json({
        title: `${brand} Master Transmission & Drivetrain Specialist - Emergency Coverage`,
        urgency: 'Immediate (Next 48 Hours)',
        summary: `${dealershipName} is seeking an experienced ${brand} certified technician to relieve heavy service bay backlog. Minimum 40 hours guaranteed flat-rate per week plus relocation/per-diem travel stipends.`,
        requiredTools: [`${brand} OEM factory scan tool or Autel MaxiSys Ultra`, 'High-tonnage transmission jack and fixture', 'Multi-meter & oscilloscope'],
        duties: [
          `Clear ${bayBottleneck} repair order backlog to under 24-hour turnaround`,
          'Perform complex warranty diagnosis adhering strictly to factory labor operation codes',
          'Document three C\'s (Condition, Cause, Correction) for 100% warranty claim pass rate',
        ],
        compensationPackage: `${flatRateGuarantee ? `$${flatRateGuarantee}/hr guaranteed flat rate` : '$65/hr guarantee'} + bonus efficiency kicker over 115%`,
      });
    }

    const prompt = `You are a Dealership Fixed Operations Director and Automotive Recruiting Specialist for Dealer Technician Network (DTN).
Draft a high-conversion, professional automotive technician job/coverage requisition based on these parameters:

Dealership: ${dealershipName || 'Metro Auto Group'}
Brand/Franchise: ${brand || 'Domestic & Import'}
Current Shop Bottleneck: ${bayBottleneck || 'Heavy line transmission and drivability'}
Coverage Type: ${coverageType || 'Emergency SOS Surge'}
Duration: ${duration || '2-4 Weeks'}
Flat-Rate / Pay Target: ${flatRateGuarantee || '$60/hr guarantee'}

Return a strict JSON object:
{
  "title": string,
  "urgency": string,
  "summary": string,
  "requiredTools": string[],
  "duties": string[],
  "compensationPackage": string
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ai/generate-requisition:', err);
    return res.status(500).json({
      error: 'Failed to generate requisition',
      details: err?.message || 'Server error',
    });
  }
});

// 4. AI Diagnostic Challenge & Technician Evaluation
app.post('/api/ai/diagnostic-challenge', async (req, res) => {
  try {
    const { scenarioId, userTroubleshootingSteps, vehicleInfo, symptom } = req.body;

    if (!ai) {
      return res.json({
        score: 92,
        masterTechFeedback: 'Excellent systematic isolation. Checking CAN bus termination resistance (60 ohms across pin 6 and 14) before pulling harness connectors prevents intermittent pin spread.',
        rootCauseIdentified: true,
        proTip: 'On this platform, water intrusion through the left A-pillar harness grommet often corrodes the gateway harness connector under the dead pedal.',
        earnedBadges: ['CAN Bus Specialist', 'Systematic Diagnostic Pro'],
      });
    }

    const prompt = `You are the Lead Shop Foreman & Automotive Technical Trainer for Dealer Technician Network (DTN).
Evaluate a technician's response to an advanced automotive diagnostic problem.

VEHICLE: ${vehicleInfo}
REPORTED SYMPTOM / DTC: ${symptom}
SCENARIO ID: ${scenarioId}

TECHNICIAN'S TROUBLESHOOTING STEPS & REASONING:
"""
${userTroubleshootingSteps}
"""

Evaluate their diagnostic logic, tool selection, electrical safety, and efficiency.
Return strict JSON:
{
  "score": number (0 to 100),
  "masterTechFeedback": string (constructive, highly realistic master mechanic feedback),
  "rootCauseIdentified": boolean,
  "proTip": string (factory bulletin or specialized trick known to master mechanics),
  "earnedBadges": string[]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ai/diagnostic-challenge:', err);
    return res.status(500).json({
      error: 'Failed to evaluate challenge',
      details: err?.message || 'Server error',
    });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Dealer Technician Network server running on http://localhost:${PORT}`);
  });
}

startServer();
