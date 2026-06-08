import React from 'react';
import {
  Building2, Users, Rocket, PieChart, Calendar,
  Search, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Data Mocks
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
];

const tableData = [
  { name: 'Basketball', day: 'Monday', time: '15:00 - 17:00', location: 'Basketball Court' },
  { name: 'Coding Club', day: 'Tuesday', time: '14:00 - 16:00', location: 'Computer Lab' },
  { name: 'Choir', day: 'Wednesday', time: '14:30 - 16:30', location: 'Auditorium' },
  { name: 'Futsal', day: 'Wednesday', time: '15:30 - 17:30', location: 'Futsal Court' },
];

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

  return (
    <div className="p-8 flex flex-col flex-1 gap-6">

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
          <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 flex flex-col p-2">
            {listActivities.map((item, index) => (
              <div key={index} className="flex items-start justify-between p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-gray-900 tracking-tight">{item.title}</span>
                  <span className="text-xs text-gray-400">{item.desc}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 mt-4">

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all"
            />
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 border-r border-gray-200 transition-colors">
              All Extracurricular <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              All Day <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
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
              {tableData.map((row, index) => (
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
          <span>Showing 1-5 of 47 Data</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-gray-900 cursor-pointer">1</span>
            <span className="px-3 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">2</span>
            <span className="px-3 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">3</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoordinatorDashboard;