import React from "react";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ClipboardList,
  CalendarDays,
  UserCheck,
  UserMinus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

// Data Mocks
const attendanceHistoryData = [
  { name: "September", value: 2 },
  { name: "October", value: 6 },
  { name: "November", value: 2 },
  { name: "December", value: 6 },
  { name: "January", value: 7 },
  { name: "February", value: 3 },
];

const upcomingSessions = [
  { title: "Basketball", desc: "Basketball Offensive Training", date: "April 26, 2025" },
  { title: "Basketball", desc: "Basic Dribbling Practice", date: "April 22, 2025" },
  { title: "Basketball", desc: "Mini Match Simulation", date: "April 19, 2025" },
  { title: "Basketball", desc: "Physical Conditioning", date: "April 12, 2025" },
  { title: "Basketball", desc: "Defense Positioning", date: "April 05, 2025" },
  { title: "Basketball", desc: "Shooting Accuracy Drill", date: "March 29, 2025" },
  { title: "Basketball", desc: "Ball Handling Fundamentals", date: "March 22, 2025" },
  { title: "Basketball", desc: "Finishing at the Rim", date: "March 15, 2025" },
];

const tableData = [
  { session: "Shooting Accuracy Drill", date: "April 12, 2025", time: "15:00", status: "Present" },
  { session: "Shooting Accuracy Drill", date: "April 12, 2025", time: "15:00", status: "Absent" },
  { session: "Shooting Accuracy Drill", date: "April 12, 2025", time: "15:00", status: "Present" },
];

const statusPillStyle = (status) => {
  switch (status) {
    case "Present":
      return "bg-[#ECFDF3] text-[#12B76A]";
    case "Absent":
      return "bg-[#FEF2F2] text-[#F04438]";
    default:
      return "bg-[#F2F4F7] text-[#667085]";
  }
};

const StudentDashboard = () => {
  return (
    <div className="p-8 flex flex-col flex-1 gap-6 bg-white font-sans">
      <style>{`
        .upcoming-scroll::-webkit-scrollbar { width: 3px; height: 3px; background-color: transparent; }
        .upcoming-scroll::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 10px; transition: background-color 0.25s ease; }
        .upcoming-scroll-wrap:hover .upcoming-scroll::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.45); }

        .upcoming-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; transition: scrollbar-color 0.25s ease; }
        .upcoming-scroll-wrap:hover .upcoming-scroll { scrollbar-color: rgba(156, 163, 175, 0.45) transparent; }
      `}</style>

      {/* Top Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <div className="bg-[#F8F9FA] rounded-3xl border border-gray-200 p-2">
          <h2 className="text-[16px] font-semibold text-gray-900 tracking-tight mb-3 pl-5">
            Attendance Overview
          </h2>

          <div className="bg-white rounded-2xl border border-gray-200 flex items-stretch shadow-sm overflow-hidden">
            <div className="flex-1 p-5 border-r border-gray-200 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <TrendingUp size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Attendance Rate</span>
              </div>

              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">
                100%
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Excellent attendance performance
              </span>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <UserCheck size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Total Present</span>
              </div>

              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">
                7
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Total attended sessions
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Exceptions */}
        <div className="bg-[#F8F9FA] rounded-3xl border border-gray-200 p-2">
          <h2 className="text-[16px] font-semibold text-gray-900 tracking-tight mb-3 pl-5">
            Attendance Exceptions
          </h2>

          <div className="bg-white rounded-2xl border border-gray-200 flex items-stretch shadow-sm overflow-hidden">
            <div className="flex-1 p-5 border-r border-gray-200 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <UserMinus size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Excused</span>
              </div>

              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">
                1
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Sessions with permission
              </span>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-gray-900 mb-6">
                <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <XCircle size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold">Absent</span>
              </div>

              <span className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">
                1
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Missed sessions without notice
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attendance History Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm xl:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 border border-gray-100 rounded-lg text-gray-400">
              <ClipboardList size={16} />
            </div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
              Attendance History
            </h2>
          </div>

          <div className="flex-1 w-full min-h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceHistoryData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                barCategoryGap="0%"
                barGap={0}
              >
                <defs>
                  <linearGradient id="studentRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.12} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  dx={-10}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  domain={[0, 10]}
                />

                <Tooltip cursor={{ fill: "transparent" }} />

                <Bar dataKey="value">
                  {attendanceHistoryData.map((_, index) => (
                    <Cell key={index} fill="url(#studentRed)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Session */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 border border-gray-100 rounded-lg text-gray-400">
              <CalendarDays size={16} />
            </div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
              Upcoming Session
            </h2>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 flex flex-col p-2 upcoming-scroll-wrap">
            <div className="max-h-85 overflow-y-auto upcoming-scroll">
              {upcomingSessions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {item.desc}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 shrink-0 ml-4">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#F8F9FA]">
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl">
                Session
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200">
                Date
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200">
                Time
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-5 text-sm font-medium text-gray-900">
                  {row.session}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">{row.date}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{row.time}</td>
                <td className="px-6 py-5 text-sm text-gray-500">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block ${statusPillStyle(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;