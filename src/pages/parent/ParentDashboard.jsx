import React from "react";
import {
  ClipboardList,
  TrendingUp,
  UserCheck,
  UserMinus,
  XCircle,
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

const ParentDashboard = () => {
  return (
    <div className="p-8 flex flex-col flex-1 gap-6 bg-white font-sans">

      {/* Top Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Card 1: Attendance Overview */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Attendance Overview</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Attendance Rate</span>
                </div>

                <div>
                  <div className="text-3xl font-semibold text-gray-900 leading-none">100%</div>
                  <div className="text-xs text-gray-400 mt-3">Excellent attendance performance</div>
                </div>
              </div>

              <div className="border-l border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Total Present</span>
                </div>

                <div>
                  <div className="text-3xl font-semibold text-gray-900 leading-none">7</div>
                  <div className="text-xs text-gray-400 mt-3">total sessions attended by your child.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Attendance Exceptions */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Attendance Exceptions</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                    <UserMinus size={18} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Excused</span>
                </div>

                <div>
                  <div className="text-3xl font-semibold text-gray-900 leading-none">1</div>
                  <div className="text-xs text-gray-400 mt-3">Sessions with permission</div>
                </div>
              </div>

              <div className="border-l border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                    <XCircle size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Absent</span>
                </div>

                <div>
                  <div className="text-3xl font-semibold text-gray-900 leading-none">1</div>
                  <div className="text-xs text-gray-400 mt-3">Missed sessions without notice</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
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
                  <linearGradient id="parentRed" x1="0" y1="0" x2="0" y2="1">
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
                    <Cell key={index} fill="url(#parentRed)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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

export default ParentDashboard;