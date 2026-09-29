import React from 'react';
import { UserRole } from '../types';
import { Wrench, ShieldAlert, Building2, UserCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenSosModal: () => void;
  onOpenResumeModal: () => void;
  onOpenRequisitionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  onOpenSosModal,
  onOpenResumeModal,
  onOpenRequisitionModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab('directory');
            }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20">
              <Wrench className="h-4 w-4" />
            </div>
            <span>Dealer Technician Network</span>
          </a>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('directory')}
            className={`transition-colors hover:text-white ${
              currentTab === 'directory' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Technicians
          </button>
          <button
            onClick={() => setCurrentTab('jobs')}
            className={`transition-colors hover:text-white ${
              currentTab === 'jobs' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Dealership Gigs
          </button>
          <button
            onClick={() => setCurrentTab('dispatch')}
            className={`transition-colors hover:text-white ${
              currentTab === 'dispatch' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Live Bay Board
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`transition-colors hover:text-white ${
              currentTab === 'analytics' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Analytics & Trends
          </button>
          <button
            onClick={() => setCurrentTab('calculator')}
            className={`transition-colors hover:text-white ${
              currentTab === 'calculator' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Cost of Downtime
          </button>
          <button
            onClick={() => setCurrentTab('reviews')}
            className={`transition-colors hover:text-white ${
              currentTab === 'reviews' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Reviews & Ratings
          </button>
          <button
            onClick={() => setCurrentTab('simulator')}
            className={`transition-colors hover:text-white ${
              currentTab === 'simulator' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Diagnostic Sim
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <div className="hidden sm:flex items-center rounded-lg border border-slate-800 bg-slate-900/90 p-1 text-xs font-medium">
            <button
              onClick={() => setUserRole('dealership')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-all ${
                userRole === 'dealership'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Service Director</span>
            </button>
            <button
              onClick={() => setUserRole('technician')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-all ${
                userRole === 'technician'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Tech View</span>
            </button>
          </div>

          {/* Quick Action button dependent on role */}
          {userRole === 'dealership' ? (
            <button
              onClick={onOpenSosModal}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500 transition-colors whitespace-nowrap active:scale-95"
            >
              <ShieldAlert className="h-4 w-4 animate-pulse" />
              <span>Deploy SOS Tech</span>
            </button>
          ) : (
            <button
              onClick={onOpenResumeModal}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-sm hover:bg-amber-400 transition-colors whitespace-nowrap active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze My Skills</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-2 text-xs scrollbar-none gap-4 text-slate-300">
        <button
          onClick={() => setCurrentTab('directory')}
          className={`whitespace-nowrap ${currentTab === 'directory' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Technicians
        </button>
        <button
          onClick={() => setCurrentTab('jobs')}
          className={`whitespace-nowrap ${currentTab === 'jobs' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Dealership Gigs
        </button>
        <button
          onClick={() => setCurrentTab('dispatch')}
          className={`whitespace-nowrap ${currentTab === 'dispatch' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Live Bay Board
        </button>
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`whitespace-nowrap ${currentTab === 'analytics' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Analytics & Trends
        </button>
        <button
          onClick={() => setCurrentTab('calculator')}
          className={`whitespace-nowrap ${currentTab === 'calculator' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Cost of Downtime
        </button>
        <button
          onClick={() => setCurrentTab('reviews')}
          className={`whitespace-nowrap ${currentTab === 'reviews' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Reviews & Ratings
        </button>
        <button
          onClick={() => setCurrentTab('simulator')}
          className={`whitespace-nowrap ${currentTab === 'simulator' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Diagnostic Sim
        </button>
        {userRole === 'dealership' ? (
          <button onClick={onOpenRequisitionModal} className="whitespace-nowrap text-amber-300">
            AI Job Drafter
          </button>
        ) : (
          <button onClick={onOpenResumeModal} className="whitespace-nowrap text-amber-300">
            Resume AI
          </button>
        )}
      </div>
    </header>
  );
};
