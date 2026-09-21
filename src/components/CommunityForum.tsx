import React, { useState } from 'react';
import { WaveReport, SurfSpot, RegionKey } from '../types';
import { MessageSquare, ThumbsUp, Send, Camera, Sparkles, MapPin, Wind, Waves, User, Clock, ShieldCheck, Filter } from 'lucide-react';

interface CommunityForumProps {
  reports: WaveReport[];
  spots: SurfSpot[];
  onAddReport: (newReport: WaveReport) => void;
  onToggleShaka: (reportId: string) => void;
  onAddComment: (reportId: string, authorName: string, text: string) => void;
  preselectedSpotId?: string | null;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  reports,
  spots,
  onAddReport,
  onToggleShaka,
  onAddComment,
  preselectedSpotId
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | RegionKey>('All');
  const [isPosting, setIsPosting] = useState(false);

  // New report form state
  const [spotId, setSpotId] = useState(preselectedSpotId || spots[0]?.id || 'super');
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [waveSize, setWaveSize] = useState('3–4ft (Chest to Head)');
  const [waveQuality, setWaveQuality] = useState<'Epic' | 'Good' | 'Fair' | 'Messy'>('Good');
  const [windNote, setWindNote] = useState('Light offshore breeze');
  const [crowdLevel, setCrowdLevel] = useState<WaveReport['crowdLevel']>('Mellow (3-8 out)');
  const [tideStage, setTideStage] = useState<WaveReport['tideStage']>('Mid Rising');
  const [boardRecommended, setBoardRecommended] = useState('Standard Shortboard / Fish');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Comment input per report state
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthor, setCommentAuthor] = useState('Surf Explorer');

  const filteredReports = reports.filter((rep) => {
    if (selectedRegion === 'All') return true;
    return rep.region === selectedRegion;
  });

  const handlePostReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !notes.trim()) return;

    const spot = spots.find((s) => s.id === spotId) || spots[0];

    const newReport: WaveReport = {
      id: `rep-${Date.now()}`,
      spotId: spot.id,
      spotName: spot.name,
      region: spot.region,
      authorName: authorName.trim(),
      authorHandle: authorHandle.trim()
        ? authorHandle.startsWith('@')
          ? authorHandle.trim()
          : `@${authorHandle.trim()}`
        : `@${authorName.trim().toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      waveSize,
      waveQuality,
      windNote,
      crowdLevel,
      tideStage,
      boardRecommended,
      notes: notes.trim(),
      photoUrl:
        photoUrl.trim() ||
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
      shakasCount: 1,
      hasUserShaka: true,
      comments: []
    };

    onAddReport(newReport);
    setIsPosting(false);
    setNotes('');
    setPhotoUrl('');
  };

  const handleSendComment = (reportId: string) => {
    const text = commentInputs[reportId];
    if (!text || !text.trim()) return;
    onAddComment(reportId, commentAuthor || 'Local Surfer', text.trim());
    setCommentInputs({ ...commentInputs, [reportId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Forum Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <span>🤙</span> Real-time Community Reports
            </span>
            <span className="text-xs text-slate-400">Crowd & Condition Intel</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Cabinet_Grotesk']">
            South Africa Wave Reports & Lineup Social
          </h2>
          <p className="text-xs text-slate-400">
            Real surfers reporting real beach conditions from Cape Town to J-Bay, Garden Route and Durban
          </p>
        </div>

        <button
          onClick={() => setIsPosting(!isPosting)}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{isPosting ? 'Close Form' : 'Post Live Beach Report'}</span>
        </button>
      </div>

      {/* Regional filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
        {(['All', 'West Coast', 'Cape Peninsula', 'Table Bay', 'Overberg', 'Garden Route', 'Eastern Cape', 'KwaZulu-Natal'] as const).map(
          (reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                selectedRegion === reg
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {reg === 'All' ? 'All South Africa' : reg}
            </button>
          )
        )}
      </div>

      {/* New Report Submission Form */}
      {isPosting && (
        <form
          onSubmit={handlePostReport}
          className="p-5 rounded-3xl bg-slate-900 border border-teal-500/40 space-y-4 shadow-xl text-xs animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>🌊</span>
              <span>Submit Fresh Live Wave Report</span>
            </h3>
            <span className="text-[11px] text-teal-400 font-bold">Instantly Broadcasts to Feed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Spot Selection */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Surf Break *</label>
              <select
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
              >
                {spots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.town})
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter Name */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Your Name / Nickname *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Kyle Botha"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Handle */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Social Handle</label>
              <input
                type="text"
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                placeholder="@kyle_surfs"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Wave Size */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Wave Height</label>
              <select
                value={waveSize}
                onChange={(e) => setWaveSize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="1–2ft (Ankle to Knee)">1–2ft (Ankle to Knee)</option>
                <option value="2–3ft (Waist high)">2–3ft (Waist high)</option>
                <option value="3–4ft (Chest to Head)">3–4ft (Chest to Head)</option>
                <option value="4–6ft (Overhead pumping)">4–6ft (Overhead pumping)</option>
                <option value="6–8ft+ (Heavy / Dungeons scale)">6–8ft+ (Heavy / Dungeons scale)</option>
              </select>
            </div>

            {/* Wave Quality */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Wave Shape Quality</label>
              <select
                value={waveQuality}
                onChange={(e) => setWaveQuality(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Epic">🔥 Epic / Firing Barrels</option>
                <option value="Good">🌊 Good / Clean Lines</option>
                <option value="Fair">🤙 Fair / Playable</option>
                <option value="Messy">💨 Messy / Choppy Wind</option>
              </select>
            </div>

            {/* Crowd Level */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Lineup Crowd Level</label>
              <select
                value={crowdLevel}
                onChange={(e) => setCrowdLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Empty (1-2 out)">Empty (1-2 out)</option>
                <option value="Mellow (3-8 out)">Mellow (3-8 out)</option>
                <option value="Busy (10-20 out)">Busy (10-20 out)</option>
                <option value="Packed (Crowded)">Packed (Crowded)</option>
              </select>
            </div>

            {/* Wind note */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Wind Conditions</label>
              <input
                type="text"
                value={windNote}
                onChange={(e) => setWindNote(e.target.value)}
                placeholder="e.g. Light offshore SE, glassy face"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Tide stage */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tide Stage</label>
              <select
                value={tideStage}
                onChange={(e) => setTideStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Low">Low Tide</option>
                <option value="Mid Rising">Mid Tide (Rising)</option>
                <option value="High">High Tide</option>
                <option value="Mid Dropping">Mid Tide (Dropping)</option>
              </select>
            </div>

            {/* Board recommendation */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Board Recommendation</label>
              <input
                type="text"
                value={boardRecommended}
                onChange={(e) => setBoardRecommended(e.target.value)}
                placeholder="e.g. Twin fin, 6'0 shorty, longboard"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Lineup Notes & Hazards *</label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are the banks holding? Any rips, water temperature, shark flags, or parking info..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Photo attachment */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Photo Attachment URL (Optional)</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black transition-colors cursor-pointer"
            >
              Publish Wave Report
            </button>
          </div>
        </form>
      )}

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 p-6 text-slate-400">
            <p>No wave reports in this region yet. Be the first to share one!</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-5 transition-all shadow-md"
            >
              {/* Report Header: Author, Spot, Time */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={report.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={report.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{report.authorName}</span>
                      <span className="text-xs text-slate-400">{report.authorHandle}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <strong className="text-teal-300">{report.spotName}</strong>
                      <span>•</span>
                      <span>{report.region}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {report.timeAgo}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      report.waveQuality === 'Epic'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : report.waveQuality === 'Good'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        : report.waveQuality === 'Fair'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {report.waveQuality}
                  </span>
                </div>
              </div>

              {/* Conditions Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Wave Size</span>
                  <span className="font-bold text-white">{report.waveSize}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Wind</span>
                  <span className="font-bold text-sky-300 truncate block">{report.windNote}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Crowd</span>
                  <span className="font-bold text-slate-300">{report.crowdLevel}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Recommended Board</span>
                  <span className="font-bold text-teal-300 truncate block">{report.boardRecommended}</span>
                </div>
              </div>

              {/* Report Writeup */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed my-3 font-sans">
                {report.notes}
              </p>

              {/* Photo if provided */}
              {report.photoUrl && (
                <div className="my-3 rounded-2xl overflow-hidden max-h-72 border border-slate-800">
                  <img
                    src={report.photoUrl}
                    alt="Beach conditions"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Interaction Bar: Shakas (🤙) & Comments */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleShaka(report.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      report.hasUserShaka
                        ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>🤙</span>
                    <span>{report.shakasCount} Shakas</span>
                  </button>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{report.comments.length} Comments</span>
                  </span>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <strong className="text-teal-300">{comment.authorName}</strong>
                      <span className="text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{comment.text}</p>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[report.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [report.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendComment(report.id);
                    }}
                    placeholder="Ask about crowd, tide, or conditions..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={() => handleSendComment(report.id)}
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
