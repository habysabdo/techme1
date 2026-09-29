import React, { useState } from 'react';
import { UserRole, Technician, DealershipJob, DispatchTicket } from './types';
import {
  INITIAL_TECHNICIANS,
  INITIAL_JOBS,
  INITIAL_DISPATCH_TICKETS,
  SERVICE_DIRECTOR_IMAGE,
  TECH_INSPECTION_IMAGE,
} from './data/mockData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TechnicianDirectory } from './components/TechnicianDirectory';
import { JobMarketplace } from './components/JobMarketplace';
import { BayCalculator } from './components/BayCalculator';
import { BayDispatchBoard } from './components/BayDispatchBoard';
import { DiagnosticSimulator } from './components/DiagnosticSimulator';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ServiceManagerTestimonials } from './components/ServiceManagerTestimonials';
import { ReviewsHub } from './components/ReviewsHub';
import { EmergencySosModal } from './components/EmergencySosModal';
import { ResumeAnalyzerModal } from './components/ResumeAnalyzerModal';
import { AiRequisitionModal } from './components/AiRequisitionModal';
import { BookingModal } from './components/BookingModal';
import { CheckCircle2, ShieldCheck, Wrench, Building2, PhoneCall, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('directory');
  const [userRole, setUserRole] = useState<UserRole>('dealership');
  const [searchBrand, setSearchBrand] = useState<string>('');

  // App State
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [jobs, setJobs] = useState<DealershipJob[]>(INITIAL_JOBS);
  const [dispatchTickets, setDispatchTickets] = useState<DispatchTicket[]>(INITIAL_DISPATCH_TICKETS);

  // Modals state
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [selectedTechForBooking, setSelectedTechForBooking] = useState<Technician | null>(null);
  const [selectedJobForBooking, setSelectedJobForBooking] = useState<DealershipJob | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddDispatchTicket = (newTicket: DispatchTicket) => {
    setDispatchTickets((prev) => [newTicket, ...prev]);
    showToast(`Emergency dispatch confirmed: ${newTicket.technicianName} assigned to Bay ${newTicket.bayNumber}`);
  };

  const handlePublishJob = (newJob: DealershipJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setCurrentTab('jobs');
    showToast(`New job requisition published: ${newJob.title}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950 p-4 text-xs font-semibold text-emerald-200 shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-3 text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenRequisitionModal={() => setIsRequisitionModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero is shown at top of the directory view */}
        {currentTab === 'directory' && (
          <HeroSection
            userRole={userRole}
            searchBrand={searchBrand}
            setSearchBrand={setSearchBrand}
            onOpenSosModal={() => setIsSosModalOpen(true)}
            onBrowseTechs={() => {
              const el = document.getElementById('tech-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            onOpenRequisitionModal={() => setIsRequisitionModalOpen(true)}
          />
        )}

        <div id="tech-grid" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {currentTab === 'directory' && (
            <>
              <TechnicianDirectory
                technicians={technicians}
                searchBrand={searchBrand}
                setSearchBrand={setSearchBrand}
                onBookTechnician={(tech) => setSelectedTechForBooking(tech)}
                onUpdateTechnicianSchedule={(techId, updatedSchedule) => {
                  setTechnicians((prev) =>
                    prev.map((t) => {
                      if (t.id === techId) {
                        const openCount = updatedSchedule.filter((d) => d.isOpen).length;
                        const newAvailability =
                          openCount >= 4 ? 'Immediate SOS' : openCount > 0 ? 'This Week' : 'Booked (2 Wks)';
                        return {
                          ...t,
                          weeklySchedule: updatedSchedule,
                          availability: newAvailability,
                        };
                      }
                      return t;
                    })
                  );
                  showToast('Shift availability calendar synchronized and updated across directory filters.');
                }}
              />
              <ServiceManagerTestimonials />
            </>
          )}

          {currentTab === 'jobs' && (
            <JobMarketplace
              jobs={jobs}
              onApplyJob={(job) => setSelectedJobForBooking(job)}
              onOpenRequisitionModal={() => setIsRequisitionModalOpen(true)}
            />
          )}

          {currentTab === 'dispatch' && (
            <BayDispatchBoard
              tickets={dispatchTickets}
              technicians={technicians}
              onAddTicket={handleAddDispatchTicket}
              onOpenSosModal={() => setIsSosModalOpen(true)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsDashboard
              technicians={technicians}
              onOpenSosModal={() => setIsSosModalOpen(true)}
              onSelectTechnician={(tech) => setSelectedTechForBooking(tech)}
            />
          )}

          {currentTab === 'calculator' && (
            <BayCalculator onOpenSosModal={() => setIsSosModalOpen(true)} />
          )}

          {currentTab === 'reviews' && (
            <ReviewsHub
              technicians={technicians}
              onBookTechnician={(tech) => setSelectedTechForBooking(tech)}
            />
          )}

          {currentTab === 'simulator' && <DiagnosticSimulator />}
        </div>

        {/* Feature Storytelling / Trust Bar */}
        <section className="border-t border-slate-800 bg-slate-900/40 py-12 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Insured Toolboxes & Vetted Records
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every DTN technician brings a documented personal tool inventory up to $100k+, insured transit, 7-year background check, and 10-panel drug test clearance.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    High-Voltage EV & OEM Master Tiers
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Covering factory brands from Ford Senior Master and GM World Class to BMW Level 1 and Toyota MDT. Clean warranty documentation with 0% bounce rate.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Fixed Operations Revenue Protection
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Prevent customer loaner vehicle logjams and unbillable bay downtime. DTN contractors average 142% flat-rate efficiency to clear service drives fast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500 text-slate-950 font-bold text-xs">
              DTN
            </div>
            <span className="font-semibold text-slate-200">Dealer Technician Network</span>
            <span className="text-slate-600">·</span>
            <span>Automotive Talent & Bay Coverage Marketplace</span>
          </div>

          <div className="flex items-center gap-6">
            <span>24/7 Dealership Dispatch Desk: 1-800-555-4DTN</span>
            <span className="text-slate-600">·</span>
            <span>ASE & OEM Certified Platform</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        technicians={technicians}
        onDispatchConfirmed={(ticket) => {
          handleAddDispatchTicket(ticket);
          setCurrentTab('dispatch');
        }}
      />

      <ResumeAnalyzerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <AiRequisitionModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        onPublishJob={handlePublishJob}
      />

      {(selectedTechForBooking || selectedJobForBooking) && (
        <BookingModal
          technician={selectedTechForBooking}
          job={selectedJobForBooking}
          onClose={() => {
            setSelectedTechForBooking(null);
            setSelectedJobForBooking(null);
          }}
          onSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}
