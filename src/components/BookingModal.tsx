import React, { useState } from 'react';
import { Technician, DealershipJob } from '../types';
import { CheckCircle2, Calendar, Clock, DollarSign, Wrench, ShieldCheck } from 'lucide-react';
import { fireConfetti } from '../utils/confetti';

interface BookingModalProps {
  technician: Technician | null;
  job: DealershipJob | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  technician,
  job,
  onClose,
  onSuccess,
}) => {
  if (!technician && !job) return null;

  const [date, setDate] = useState('Tomorrow (07:30 AM)');
  const [shiftDuration, setShiftDuration] = useState('2 Weeks Guaranteed');
  const [dealershipName, setDealershipName] = useState('Premier Auto Group');
  const [bayNumber, setBayNumber] = useState('Bay #3');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      fireConfetti();
    } catch (err) {}
    setConfirmed(true);
    setTimeout(() => {
      onSuccess(
        technician
          ? `Booking confirmed for ${technician.name}. Bay dispatch alert sent.`
          : `Application submitted for ${job?.title}. The service director will contact you.`
      );
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-lg font-bold text-white">
            {technician ? `Book ${technician.name}` : `Claim Shift: ${job?.title}`}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {confirmed ? (
          <div className="text-center py-6 space-y-3 animate-in fade-in">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">
              {technician ? 'Technician Scheduled!' : 'Shift Application Received!'}
            </h4>
            <p className="text-xs text-slate-400">
              Direct notification dispatched via DTN secure gateway.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {technician && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-950 p-3 border border-slate-800">
                <img
                  src={technician.avatar}
                  alt={technician.name}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-lg object-cover border border-slate-700"
                />
                <div>
                  <div className="font-bold text-white text-sm">{technician.name}</div>
                  <div className="text-amber-400 font-medium">{technician.title}</div>
                  <div className="text-slate-400 mt-0.5">
                    Rate: ${technician.hourlyRate}/hr · Flat-rate guarantee: ${technician.flatRateGuarantee}/hr
                  </div>
                </div>
              </div>
            )}

            {job && (
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="font-bold text-white text-sm">{job.dealershipName}</div>
                <div className="text-amber-400 font-medium">{job.title}</div>
                <div className="text-slate-400 mt-0.5">{job.payRate} · {job.location}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Start Time / Date</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Today Immediate (Within 2 hrs)">Today Immediate (Within 2 hrs)</option>
                  <option value="Tomorrow (07:30 AM)">Tomorrow (07:30 AM)</option>
                  <option value="Monday Morning (07:00 AM)">Monday Morning (07:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Duration</label>
                <select
                  value={shiftDuration}
                  onChange={(e) => setShiftDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Emergency Surge (3-5 Days)">Emergency Surge (3-5 Days)</option>
                  <option value="2 Weeks Guaranteed">2 Weeks Guaranteed</option>
                  <option value="1 Month Extended">1 Month Extended</option>
                  <option value="Permanent Direct Hire">Permanent Direct Hire</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                {technician ? 'Assigned Service Bay / Lift' : 'Your Primary Toolbox Setup'}
              </label>
              <input
                type="text"
                value={technician ? bayNumber : 'Snap-on Roll Cab with OEM Scanners'}
                onChange={(e) => setBayNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
              >
                {technician ? 'Confirm Bay Booking' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
