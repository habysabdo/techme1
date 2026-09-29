import React, { useState } from 'react';
import { DispatchTicket, Technician } from '../types';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface BayDispatchBoardProps {
  tickets: DispatchTicket[];
  technicians: Technician[];
  onAddTicket: (ticket: DispatchTicket) => void;
  onOpenSosModal: () => void;
}

export const BayDispatchBoard: React.FC<BayDispatchBoardProps> = ({
  tickets,
  technicians,
  onAddTicket,
  onOpenSosModal,
}) => {
  const [activeTickets, setActiveTickets] = useState<DispatchTicket[]>(tickets);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const updateStatus = (id: string, newStatus: DispatchTicket['status']) => {
    setActiveTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const getStatusColor = (status: DispatchTicket['status']) => {
    switch (status) {
      case 'Clocked In':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
      case 'Diagnostics':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'Parts Pending':
        return 'text-sky-400 bg-sky-950/60 border-sky-800/80';
      case 'Quality Check':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/80';
      case 'Completed':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  const filteredTickets = activeTickets.filter(
    (t) => filterStatus === 'all' || t.status === filterStatus
  );

  // Total efficiency stats
  const totalBilled = activeTickets.reduce((acc, t) => acc + t.flatRateHoursBilled, 0);
  const totalClocked = activeTickets.reduce((acc, t) => acc + t.actualClockHours, 0);
  const overallEfficiency = totalClocked > 0 ? Math.round((totalBilled / totalClocked) * 100) : 100;

  return (
    <div className="py-8">
      {/* Header telemetry */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Live Dealership Bay Dispatch & Efficiency Board
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Real-time service drive bay occupancy, repair order timers, and flat-rate hour billing
            </div>
          </div>
          <button
            onClick={onOpenSosModal}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 transition-colors whitespace-nowrap active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Emergency Dispatch Tech</span>
          </button>
        </div>

        {/* Live Shop Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Total Flagged Hours</div>
            <div className="text-xl font-bold text-white tabular-nums mt-0.5">
              {totalBilled.toFixed(1)} hrs
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Actual Clock Hours</div>
            <div className="text-xl font-bold text-white tabular-nums mt-0.5">
              {totalClocked.toFixed(1)} hrs
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Shop Efficiency Yield</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
              {overallEfficiency}%
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
            <div className="text-[11px] text-slate-400">Active Service Bays</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">
              {activeTickets.length} Lifts Active
            </div>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-1">Status:</span>
          {['all', 'Clocked In', 'Diagnostics', 'Parts Pending', 'Quality Check', 'Completed'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {status === 'all' ? 'All Bays' : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => {
          const efficiency =
            ticket.actualClockHours > 0
              ? Math.round((ticket.flatRateHoursBilled / ticket.actualClockHours) * 100)
              : 100;

          return (
            <div
              key={ticket.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm">
                    B{ticket.bayNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {ticket.vehicleModel}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono">
                      {ticket.roNumber} · {ticket.dealershipName}
                    </div>
                  </div>
                </div>

                {/* Status Dropdown/Badge */}
                <select
                  aria-label="Change repair order status"
                  value={ticket.status}
                  onChange={(e) => updateStatus(ticket.id, e.target.value as DispatchTicket['status'])}
                  className={`rounded-md border px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  <option value="Clocked In">Clocked In</option>
                  <option value="Diagnostics">Diagnostics</option>
                  <option value="Parts Pending">Parts Pending</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Technician Info */}
              <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800/80 mb-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Assigned Master Tech:</div>
                  <div className="text-xs font-semibold text-white">{ticket.technicianName}</div>
                  <div className="text-[10px] text-slate-500">Started: {ticket.startedAt} · Advisor: {ticket.serviceAdvisor}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Bay Efficiency</div>
                  <div className="text-xs font-bold text-emerald-400 tabular-nums">
                    {efficiency}%
                  </div>
                </div>
              </div>

              {/* Hours Banked Bar */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>
                  Billed: <strong className="text-white tabular-nums">{ticket.flatRateHoursBilled} FR hrs</strong>
                </span>
                <span>
                  Clock Time: <strong className="text-slate-400 tabular-nums">{ticket.actualClockHours} hrs</strong>
                </span>
                <span className="text-amber-400 font-semibold tabular-nums">
                  +{(ticket.flatRateHoursBilled - ticket.actualClockHours).toFixed(1)} hrs net yield
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
