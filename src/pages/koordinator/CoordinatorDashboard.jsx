import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Building2, Users, Rocket, PieChart, Calendar,
  Search, ChevronDown, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Data Mocks Chart & Activities
const chartData = [
  { name: 'Basketball', value: 40 },
  { name: 'Choir', value: 25 },
  { name: 'Coding Club', value: 12 },
  { name: 'PMR', value: 36 },
  { name: 'Futsal', value: 30 },
  { name: 'Graphic Design', value: 14 },
];

const listActivities = [
  { title: 'Basketball', desc: 'Monthly report for March approved', time: '2 hours ago' },
  { title: 'Coding Club', desc: 'Monthly report for March approved', time: '5 hours ago' },
  { title: 'Choir', desc: 'Practice schedule updated', time: '1 day ago' },
  { title: 'PMR', desc: 'Report awaiting approval', time: '1 day ago' },
  { title: 'Futsal', desc: 'Friendly match schedule added', time: '2 days ago' },
  { title: 'English Club', desc: 'Debate competition preparation', time: '2 days ago' },
  { title: 'Graphic Design', desc: 'Poster submission deadline', time: '3 days ago' },
  { title: 'Photography', desc: 'New equipment requested', time: '4 days ago' },
];

// Data Mocks Table
const initialTableData = [
  { name: 'Basketball', day: 'Monday', time: '15:00 - 17:00', location: 'Basketball Court' },
  { name: 'Coding Club', day: 'Tuesday', time: '14:00 - 16:00', location: 'Computer Lab' },
  { name: 'Choir', day: 'Wednesday', time: '14:30 - 16:30', location: 'Auditorium' },
  { name: 'Futsal', day: 'Wednesday', time: '15:30 - 17:30', location: 'Futsal Court' },
  { name: 'PMR', day: 'Thursday', time: '16:00 - 17:30', location: 'Room 201' },
  { name: 'English Club', day: 'Friday', time: '15:00 - 16:30', location: 'Language Lab' },
  { name: 'Graphic Design', day: 'Saturday', time: '10:00 - 12:00', location: 'Computer Lab' },
];

// Filter Options
const EXTRA_OPTIONS = ['All Extracurricular', 'Basketball', 'Choir', 'Coding Club', 'English Club', 'Futsal', 'Graphic Design', 'PMR'];
const DAY_OPTIONS = ['All Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <g>
      <rect x={x} y={y} width={width + 1} height={height} fill={fill} stroke="none" />
      <line x1={x} y1={y} x2={x + width + 1} y2={y} stroke="#ef4444" strokeWidth={1} />
    </g>
  );
};

const CoordinatorDashboard = () => {
  // State untuk Search dan Filter
  const [search, setSearch] = useState('');
  const [extraFilter, setExtraFilter] = useState('All Extracurricular');
  const [dayFilter, setDayFilter] = useState('All Day');

  // State untuk buka/tutup Dropdown
  const [extraOpen, setExtraOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);

  const extraRef = useRef(null);
  const dayRef = useRef(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (extraRef.current && !extraRef.current.contains(e.target)) setExtraOpen(false);
      if (dayRef.current && !dayRef.current.contains(e.target)) setDayOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Logic
  const filteredTableData = useMemo(() => {
    const q = search.trim().toLowerCase();
    
    return initialTableData.filter(item => {
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        item.day.toLowerCase().includes(q) || 
        item.time.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q);

      const matchExtra = extraFilter === 'All Extracurricular' || item.name === extraFilter;
      
      const matchDay = dayFilter === 'All Day' || item.day === dayFilter;

      return matchSearch && matchExtra && matchDay;
    });
  }, [search, extraFilter, dayFilter]);

  return (
    <div className="p-8 flex flex-col flex-1 gap-6">
      <style>{`
        .academic-scroll::-webkit-scrollbar { width: 3px; height: 3px; background-color: transparent; }
        .academic-scroll::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 10px; transition: background-color 0.25s ease; }
        .academic-scroll-wrap:hover .academic-scroll::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.45); }

        .academic-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; transition: scrollbar-color 0.25s ease; }
        .academic-scroll-wrap:hover .academic-scroll { scrollbar-color: rgba(156, 163, 175, 0.45) transparent; }
      `}</style>

      {/* Top Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Box 1: Extracurricular */}
        <div className="bg-[#F8F9FA] rounded-3xl border border-gray-200 p-2">
          <h2 className="text-[16px] font-semibold text-gray-900 tracking-tight mb-3 pl-5">Extracurricular</h2>
          <div className="bg-white rounded-2xl border border-gray-200 flex items-stretch shadow-sm">
            <div className="flex-1 p-5 border-r border-gray-200 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <Building2 size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Total Extracurricular</span>
              </div>
              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">15</span>
              <span className="text-xs text-gray-400 font-medium">Active Programs</span>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <Users size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Total Members</span>
              </div>
              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">500</span>
              <span className="text-xs text-gray-400 font-medium">Registered Members</span>
            </div>
          </div>
        </div>

        {/* Box 2: Management */}
        <div className="bg-[#F8F9FA] rounded-3xl border border-gray-200 p-2">
          <h2 className="text-[16px] font-semibold text-gray-900 tracking-tight mb-3 pl-5">Management</h2>
          <div className="bg-white rounded-2xl border border-gray-200 flex items-stretch shadow-sm">
            <div className="flex-1 p-5 border-r border-gray-200 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <Users size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Total Mentors</span>
              </div>
              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">20</span>
              <span className="text-xs text-gray-400 font-medium">Active Mentors</span>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <Rocket size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Monthly Activities</span>
              </div>
              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">48</span>
              <span className="text-xs text-gray-400 font-medium">Activities This Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm xl:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 border border-gray-100 rounded-lg text-gray-400"><PieChart size={16} /></div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">Extracurricular Members Overview</h2>
          </div>

          <div className="flex-1 w-full min-h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barCategoryGap="0%" barGap={0}>
                <defs>
                  <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dx={-10} ticks={[0, 10, 20, 30, 40, 50]} domain={[0, 50]} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" shape={<CustomBarShape />}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorRed)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List: Academic Period */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 border border-gray-100 rounded-lg text-gray-400"><Calendar size={16} /></div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">Academic Period</h2>
          </div>
          <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 flex flex-col p-2 academic-scroll-wrap">
            <div className="max-h-85 overflow-y-auto academic-scroll">
              {listActivities.map((item, index) => (
                <div key={index} className="flex items-start justify-between p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col gap-1.5 min-w-0 pr-2">
                    <span className="text-sm font-semibold text-gray-900 tracking-tight">{item.title}</span>
                    <span className="text-xs text-gray-400 truncate">{item.desc}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 mt-4">

        {/* Search & Filters */}
        <div className="flex items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schedule..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all bg-white"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
            
            {/* Extracurricular Filter */}
            <div ref={extraRef} className="relative border-r border-gray-200">
              <button
                onClick={() => { setExtraOpen(!extraOpen); setDayOpen(false); }}
                className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors rounded-l-xl cursor-pointer"
              >
                {extraFilter}
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${extraOpen ? 'rotate-180 text-[#C1200C]' : ''}`} />
              </button>

              {extraOpen && (
                <div className="absolute right-0 mt-3 w-55 bg-white border border-gray-200 rounded-2xl overflow-hidden z-20 shadow-[0_10px_25px_rgba(16,24,40,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2 max-h-60 overflow-y-auto">
                    {EXTRA_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setExtraFilter(c); setExtraOpen(false); }}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 text-left text-sm text-gray-700 cursor-pointer transition-colors"
                      >
                        <span className={extraFilter === c ? "font-medium text-[#C1200C]" : ""}>{c}</span>
                        {extraFilter === c && <Check size={16} className="text-[#C1200C]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Day Filter */}
            <div ref={dayRef} className="relative">
              <button
                onClick={() => { setDayOpen(!dayOpen); setExtraOpen(false); }}
                className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors rounded-r-xl cursor-pointer"
              >
                {dayFilter}
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dayOpen ? 'rotate-180 text-[#C1200C]' : ''}`} />
              </button>

              {dayOpen && (
                <div className="absolute right-0 mt-3 w-45 bg-white border border-gray-200 rounded-2xl overflow-hidden z-20 shadow-[0_10px_25px_rgba(16,24,40,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2 max-h-60 overflow-y-auto">
                    {DAY_OPTIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDayFilter(d); setDayOpen(false); }}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 text-left text-sm text-gray-700 cursor-pointer transition-colors"
                      >
                        <span className={dayFilter === d ? "font-medium text-[#C1200C]" : ""}>{d}</span>
                        {dayFilter === d && <Check size={16} className="text-[#C1200C]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tabel or Empty State */}
        {filteredTableData.length === 0 ? (
          <div className="w-full min-h-75 flex items-center justify-center border border-dashed border-gray-300 rounded-2xl mt-2 bg-[#F9FAFB]/50">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center">
                <Search className="w-6 h-6 text-[#C1200C]" />
              </div>
              <div className="mt-5 text-[17px] font-semibold text-gray-900">
                No schedule found
              </div>
              <div className="mt-2 text-[14px] text-gray-500 max-w-100 mx-auto leading-relaxed">
                We couldn't find any schedule matching your search or filters. Try adjusting them.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto mt-2">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F8F9FA]">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl">
                      Extracurricular
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200">
                      Day
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200">
                      Time
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.day}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.time}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-2 text-sm text-gray-900 font-medium mb-8">
              <span>
                Showing {filteredTableData.length > 0 ? 1 : 0}-{Math.min(5, filteredTableData.length)} of {filteredTableData.length} Data
              </span>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 text-gray-900 cursor-pointer">1</span>
                <span className="px-3 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">2</span>
                <span className="px-3 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">3</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CoordinatorDashboard;