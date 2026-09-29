import React, { useState } from 'react';
import {
  Star,
  Quote,
  Building2,
  Wrench,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  PlusCircle,
  X,
  Filter,
  Award,
} from 'lucide-react';
import { DealerReview, TechReview, Technician } from '../types';
import { INITIAL_DEALER_REVIEWS, INITIAL_TECH_REVIEWS } from '../data/reviewsData';
import { ALL_CAR_BRANDS } from '../data/allBrandsData';

interface ReviewsHubProps {
  technicians: Technician[];
  onBookTechnician?: (tech: Technician) => void;
}

export const ReviewsHub: React.FC<ReviewsHubProps> = ({ technicians, onBookTechnician }) => {
  const [activeTab, setActiveTab] = useState<'dealerToTech' | 'techToDealer'>('dealerToTech');
  const [techReviews, setTechReviews] = useState<TechReview[]>(INITIAL_TECH_REVIEWS);
  const [dealerReviews, setDealerReviews] = useState<DealerReview[]>(INITIAL_DEALER_REVIEWS);

  // Filter states
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);

  // Modal states for adding reviews
  const [isAddTechReviewOpen, setIsAddTechReviewOpen] = useState(false);
  const [isAddDealerReviewOpen, setIsAddDealerReviewOpen] = useState(false);

  // New Dealership -> Tech Review Form State
  const [selectedTechId, setSelectedTechId] = useState(technicians[0]?.id || 'tech-1');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Service Manager');
  const [dealershipName, setDealershipName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [verifiedRo, setVerifiedRo] = useState('');
  const [observedEfficiency, setObservedEfficiency] = useState(140);

  // New Tech -> Dealership Review Form State
  const [dealerNameInput, setDealerNameInput] = useState('');
  const [dealerBrandInput, setDealerBrandInput] = useState('Ford');
  const [dealerLocationInput, setDealerLocationInput] = useState('');
  const [techAuthorId, setTechAuthorId] = useState(technicians[0]?.id || 'tech-1');
  const [equipmentRating, setEquipmentRating] = useState(5);
  const [partsSpeedRating, setPartsSpeedRating] = useState(5);
  const [dispatchFairnessRating, setDispatchFairnessRating] = useState(5);
  const [payHonestyRating, setPayHonestyRating] = useState(5);
  const [shopEnvRating, setShopEnvRating] = useState(5);
  const [dealerReviewTitle, setDealerReviewTitle] = useState('');
  const [dealerReviewComment, setDealerReviewComment] = useState('');

  // Handle submit Dealership -> Technician Review
  const handleSubmitTechReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !dealershipName || !reviewComment) return;

    const newRev: TechReview = {
      id: `rev-tech-${Date.now()}`,
      technicianId: selectedTechId,
      reviewerName,
      reviewerRole,
      dealershipName,
      location: reviewLocation || 'Metro Dealership',
      rating: newRating,
      date: 'Just now',
      title: reviewTitle || 'Excellent Master Technician Dispatch Coverage',
      comment: reviewComment,
      verifiedRepairOrder: verifiedRo ? `RO #${verifiedRo}` : `RO #${Math.floor(10000 + Math.random() * 90000)}`,
      efficiencyObserved: Number(observedEfficiency),
      recommended: true,
    };

    setTechReviews([newRev, ...techReviews]);
    setIsAddTechReviewOpen(false);
    // Reset form
    setReviewTitle('');
    setReviewComment('');
    setVerifiedRo('');
  };

  // Handle submit Technician -> Dealership Review
  const handleSubmitDealerReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerNameInput || !dealerReviewComment) return;

    const authorTech = technicians.find((t) => t.id === techAuthorId) || technicians[0];
    const avgScore = Number(
      ((equipmentRating + partsSpeedRating + dispatchFairnessRating + payHonestyRating + shopEnvRating) / 5).toFixed(1)
    );

    const newDealRev: DealerReview = {
      id: `deal-rev-${Date.now()}`,
      dealershipName: dealerNameInput,
      brand: dealerBrandInput,
      location: dealerLocationInput || authorTech.location,
      technicianId: authorTech.id,
      technicianName: authorTech.name,
      technicianTitle: authorTech.title,
      rating: avgScore,
      date: 'Just now',
      title: dealerReviewTitle || 'Fair Dispatch & Honest Guarantee Payout',
      comment: dealerReviewComment,
      equipmentQualityRating: equipmentRating,
      partsDepartmentSpeedRating: partsSpeedRating,
      dispatchFairnessRating,
      payGuaranteeHonestyRating: payHonestyRating,
      shopEnvironmentRating: shopEnvRating,
      recommended: avgScore >= 4,
    };

    setDealerReviews([newDealRev, ...dealerReviews]);
    setIsAddDealerReviewOpen(false);
    // Reset form
    setDealerNameInput('');
    setDealerReviewTitle('');
    setDealerReviewComment('');
  };

  // Filtered views
  const filteredTechReviews = techReviews.filter((rev) => {
    const tech = technicians.find((t) => t.id === rev.technicianId);
    const matchesBrand =
      filterBrand === 'all' || (tech && tech.brands.some((b) => b.toLowerCase().includes(filterBrand.toLowerCase())));
    const matchesRating = minRating === 0 || rev.rating >= minRating;
    return matchesBrand && matchesRating;
  });

  const filteredDealerReviews = dealerReviews.filter((rev) => {
    const matchesBrand =
      filterBrand === 'all' || rev.brand.toLowerCase().includes(filterBrand.toLowerCase());
    const matchesRating = minRating === 0 || rev.rating >= minRating;
    return matchesBrand && matchesRating;
  });

  return (
    <div className="py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Two-Sided Dealership & Technician Transparency Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Verified Reviews & Shop Scorecards
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect authentic verified reviews from dealership service managers praising technician performance, and honest shop condition ratings submitted by master technicians who worked in their bays.
            </p>
          </div>

          {/* Action to leave a review */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsAddTechReviewOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Review a Technician</span>
            </button>
            <button
              onClick={() => setIsAddDealerReviewOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Rate a Dealership Shop</span>
            </button>
          </div>
        </div>

        {/* Top Two-Sided Tab Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-5">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dealerToTech')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'dealerToTech'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="h-4 w-4" />
              <span>Technician Reviews ({techReviews.length})</span>
              <span className="text-[10px] bg-slate-900/40 text-current px-1.5 py-0.5 rounded">From Dealers</span>
            </button>
            <button
              onClick={() => setActiveTab('techToDealer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'techToDealer'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Dealership Shop Reviews ({dealerReviews.length})</span>
              <span className="text-[10px] bg-slate-900/40 text-current px-1.5 py-0.5 rounded">From Techs</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              OEM Brand:
            </span>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Brands ({ALL_CAR_BRANDS.length}+)</option>
              {ALL_CAR_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
              <option value={5.0}>5.0 Stars Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW A: Dealership Reviews of Technicians */}
      {activeTab === 'dealerToTech' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredTechReviews.length} verified technician field reviews</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% Verified Dealer Repair Orders (ROs)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTechReviews.map((rev) => {
              const tech = technicians.find((t) => t.id === rev.technicianId);

              return (
                <div
                  key={rev.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Top Review Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-700 text-slate-700'
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-white ml-1">{rev.rating}.0</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">{rev.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {rev.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    {/* Verified Metrics Strip */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="rounded bg-slate-950 px-2 py-0.5 border border-slate-800 text-slate-400 font-mono">
                        {rev.verifiedRepairOrder}
                      </span>
                      <span className="rounded bg-emerald-950/60 px-2 py-0.5 border border-emerald-800/80 text-emerald-400 font-semibold">
                        {rev.efficiencyObserved}% Flagged Efficiency
                      </span>
                    </div>
                  </div>

                  {/* Footer: Tech Profile & Reviewer Attribution */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {tech && (
                        <img
                          src={tech.avatar}
                          alt={tech.name}
                          className="h-9 w-9 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          Technician: <span className="text-amber-400">{tech ? tech.name : 'DTN Master Tech'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Reviewed by {rev.reviewerName} ({rev.reviewerRole}), {rev.dealershipName}
                        </div>
                      </div>
                    </div>

                    {tech && onBookTechnician && (
                      <button
                        onClick={() => onBookTechnician(tech)}
                        className="rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors shrink-0 ml-2"
                      >
                        Book Tech
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW B: Technician Reviews of Dealerships */}
      {activeTab === 'techToDealer' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredDealerReviews.length} verified dealership shop condition reviews</span>
            <span className="text-amber-400 font-medium">
              Fair Dispatch & Pay Guarantee Scorecard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDealerReviews.map((dealRev) => (
              <div
                key={dealRev.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {dealRev.brand}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-white">{dealRev.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">{dealRev.dealershipName}</h4>
                      <div className="text-[11px] text-slate-400">{dealRev.location}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {dealRev.date}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-amber-300">
                    "{dealRev.title}"
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {dealRev.comment}
                  </p>

                  {/* 5-Criteria Shop Scorecard Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Lifts & Tooling:</span>
                      <strong className="text-emerald-400">{dealRev.equipmentQualityRating} / 5.0</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Parts Speed:</span>
                      <strong className="text-emerald-400">{dealRev.partsDepartmentSpeedRating} / 5.0</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Dispatch Fairness:</span>
                      <strong className="text-emerald-400">{dealRev.dispatchFairnessRating} / 5.0</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Guarantee Pay Honesty:</span>
                      <strong className="text-emerald-400">{dealRev.payGuaranteeHonestyRating} / 5.0</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Shop Environment:</span>
                      <strong className="text-emerald-400">{dealRev.shopEnvironmentRating} / 5.0</strong>
                    </div>
                    <div className="flex items-center text-emerald-400 font-bold">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>Recommended</span>
                    </div>
                  </div>
                </div>

                {/* Footer Attribution from Tech */}
                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <span>Reviewed by: </span>
                    <strong className="text-slate-200">{dealRev.technicianName}</strong>
                    <span className="block text-[10px] text-amber-400">{dealRev.technicianTitle}</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Bay Contract
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Add Review for Technician (Dealership -> Tech) */}
      {isAddTechReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-400" />
                <span>Submit Technician Performance Review</span>
              </h3>
              <button
                onClick={() => setIsAddTechReviewOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTechReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Technician</label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.brands.join(', ')} - {t.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. John Davis"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Leadership Role</label>
                  <input
                    type="text"
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value)}
                    placeholder="e.g. Service Director / Shop Foreman"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dealership Name</label>
                  <input
                    type="text"
                    required
                    value={dealershipName}
                    onChange={(e) => setDealershipName(e.target.value)}
                    placeholder="e.g. Lone Star Chevrolet"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City, State</label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. Dallas, TX"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overall Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-bold"
                  >
                    <option value={5}>5 - Outstanding</option>
                    <option value={4}>4 - Great Work</option>
                    <option value={3}>3 - Acceptable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Observed Efficiency</label>
                  <input
                    type="number"
                    value={observedEfficiency}
                    onChange={(e) => setObservedEfficiency(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Verified RO #</label>
                  <input
                    type="text"
                    value={verifiedRo}
                    onChange={(e) => setVerifiedRo(e.target.value)}
                    placeholder="e.g. 84192-A"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Outstanding turnaround on heavy diesel campaign"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Review / Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the technician's speed, diagnostic rigor, warranty documentation, and shop etiquette..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTechReviewOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Post Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Review for Dealership (Technician -> Dealership) */}
      {isAddDealerReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                <span>Rate Dealership Shop Conditions (From Technician)</span>
              </h3>
              <button
                onClick={() => setIsAddDealerReviewOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDealerReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reviewing as Technician</label>
                <select
                  value={techAuthorId}
                  onChange={(e) => setTechAuthorId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dealership Name</label>
                  <input
                    type="text"
                    required
                    value={dealerNameInput}
                    onChange={(e) => setDealerNameInput(e.target.value)}
                    placeholder="e.g. North County Ford"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Franchise Brand</label>
                  <select
                    value={dealerBrandInput}
                    onChange={(e) => setDealerBrandInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                  >
                    {ALL_CAR_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shop Criteria Sliders / Selectors */}
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-2.5">
                <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">
                  Shop Quality Breakdown (1 - 5 Stars)
                </span>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Lifts, Air Compressors & OEM Scanners:</span>
                  <select
                    value={equipmentRating}
                    onChange={(e) => setEquipmentRating(Number(e.target.value))}
                    className="rounded bg-slate-900 border border-slate-700 p-1 text-white font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Parts Department Counter Speed:</span>
                  <select
                    value={partsSpeedRating}
                    onChange={(e) => setPartsSpeedRating(Number(e.target.value))}
                    className="rounded bg-slate-900 border border-slate-700 p-1 text-white font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Dispatch Fairness (No Advisor Favoritism):</span>
                  <select
                    value={dispatchFairnessRating}
                    onChange={(e) => setDispatchFairnessRating(Number(e.target.value))}
                    className="rounded bg-slate-900 border border-slate-700 p-1 text-white font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pay Guarantee Honesty & Timing:</span>
                  <select
                    value={payHonestyRating}
                    onChange={(e) => setPayHonestyRating(Number(e.target.value))}
                    className="rounded bg-slate-900 border border-slate-700 p-1 text-white font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Shop Environment (Heat/AC, Cleanliness):</span>
                  <select
                    value={shopEnvRating}
                    onChange={(e) => setShopEnvRating(Number(e.target.value))}
                    className="rounded bg-slate-900 border border-slate-700 p-1 text-white font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Review Headline</label>
                <input
                  type="text"
                  value={dealerReviewTitle}
                  onChange={(e) => setDealerReviewTitle(e.target.value)}
                  placeholder="e.g. Great shop culture, paid guarantee promptly"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Detailed Shop Assessment</label>
                <textarea
                  rows={3}
                  required
                  value={dealerReviewComment}
                  onChange={(e) => setDealerReviewComment(e.target.value)}
                  placeholder="How was the shop foreman? Did the parts counter stage items promptly? Were RO descriptions accurate?"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDealerReviewOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Submit Shop Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
