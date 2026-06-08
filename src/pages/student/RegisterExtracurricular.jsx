import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Search as SearchIcon,
  User,
  CalendarDays,
  MapPin,
  Check,
  Sparkles,
  Building2,
  Music2,
  Code2,
  HeartPulse,
  GraduationCap,
  Clock,
  Puzzle,
  Plus,
  Globe
} from "lucide-react";
import NotificationModal from "../../components/ui/NotificationModal";

// Custom SVG Bola Basket
const BasketballIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
    <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
  </svg>
);

// Custom SVG Bola Sepak / Futsal
const SoccerIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55z" />
    <path d="M12 7v-5" />
    <path d="M16.76 10.45l4.74 -1.55" />
    <path d="M15 16l2.5 4.5" />
    <path d="M9 16l-2.5 4.5" />
    <path d="M7.24 10.45l-4.74 -1.55" />
  </svg>
);

const EXTRACURRICULARS = [
  {
    id: "basketball",
    name: "Basketball",
    category: "Sport",
    description:
      "Develop teamwork, discipline, and basketball fundamentals through regular training sessions.",
    mentor: "Ahmad Sarifudin",
    scheduleDay: "Monday",
    scheduleTime: "15:00",
    location: "Basketball Court",
    iconType: "basketball",
  },
  {
    id: "futsal",
    name: "Futsal",
    category: "Sport",
    description:
      "Improve technical skills, teamwork, and sportsmanship through structured futsal training and competitions.",
    mentor: "Rizky Pratama",
    scheduleDay: "Wednesday",
    scheduleTime: "16:00",
    location: "Field",
    iconType: "futsal",
  },
  {
    id: "choir",
    name: "Choir",
    category: "Arts",
    description:
      "Enhance vocal technique and performance through regular practice and stage experience.",
    mentor: "Sinta Nabila",
    scheduleDay: "Tuesday",
    scheduleTime: "15:30",
    location: "Auditorium",
    iconType: "arts",
  },
  {
    id: "coding-club",
    name: "Coding Club",
    category: "Technology",
    description:
      "Learn programming fundamentals, problem-solving, and software development through hands-on projects.",
    mentor: "Galih Nugroho",
    scheduleDay: "Friday",
    scheduleTime: "15:00",
    location: "Computer Laboratory",
    iconType: "tech",
  },
  {
    id: "pmr",
    name: "PMR",
    category: "Social",
    description:
      "Develop first aid skills, health awareness, and social responsibility through practical training and community.",
    mentor: "Dewi Sartika",
    scheduleDay: "Thursday",
    scheduleTime: "16:00",
    location: "Room 201",
    iconType: "social",
  },
  {
    id: "english-club",
    name: "English Club",
    category: "Academic",
    description:
      "Build confidence in speaking, listening, and skills through discussions, debates, and presentations.",
    mentor: "Intan Lestari",
    scheduleDay: "Wednesday",
    scheduleTime: "15:30",
    location: "Language Laboratory",
    iconType: "academic",
  },
];

const CATEGORY_ORDER = [
  "All Category",
  "Sport",
  "Arts",
  "Technology",
  "Social",
  "Academic",
];

const categoryPill = (category) => {
  switch (category) {
    case "Sport":
      return "bg-[#ECFDF3] text-[#027A48]";
    case "Arts":
      return "bg-[#F2F4F7] text-[#344054]";
    case "Technology":
      return "bg-[#FEF3F2] text-[#C1200C]";
    case "Social":
      return "bg-[#FFF6ED] text-[#C4320A]";
    case "Academic":
      return "bg-[#EFF8FF] text-[#175CD3]";
    default:
      return "bg-[#F2F4F7] text-[#667085]";
  }
};

const statusPill = (status) => {
  if (status === "Pending Approval") return "bg-[#FFF6ED] text-[#C4320A]";
  return "bg-[#F2F4F7] text-[#667085]";
};

const formatDateLong = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const CardIcon = ({ type }) => {
  const base =
    "w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center shrink-0";
  const iconClass = "w-[18px] h-[18px] text-[#C1200C]";

  switch (type) {
    case "basketball":
      return <div className={base}><BasketballIcon className={iconClass} strokeWidth={2.5} size={18} /></div>;
    case "futsal":
      return <div className={base}><SoccerIcon className={iconClass} strokeWidth={2.5} size={18} /></div>;
    case "arts":
      return <div className={base}><Music2 className={iconClass} strokeWidth={2.5} /></div>;
    case "tech":
      return <div className={base}><Code2 className={iconClass} strokeWidth={2.5} /></div>;
    case "social":
      return <div className={base}><Plus className={iconClass} strokeWidth={3} /></div>;
    case "academic":
      return <div className={base}><Globe className={iconClass} strokeWidth={2.5} /></div>;
    default:
      return <div className={base}><Sparkles className={iconClass} /></div>;
  }
};

const RegisterExtracurricular = () => {
  const [registrationOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Category");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [activeRegistration, setActiveRegistration] = useState({
    extracurricularName: "-",
    registrationDate: "-",
    status: "No Registration Active",
  });

  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!categoryOpen) return;

    const onDown = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setCategoryOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [categoryOpen]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return EXTRACURRICULARS.filter((x) => {
      const matchQ =
        !q ||
        x.name.toLowerCase().includes(q) ||
        x.description.toLowerCase().includes(q) ||
        x.mentor.toLowerCase().includes(q) ||
        x.location.toLowerCase().includes(q);

      const matchCat = category === "All Category" ? true : x.category === category;
      return matchQ && matchCat;
    });
  }, [search, category]);

  const handleRegister = (item) => {
    const now = new Date();
    setActiveRegistration({
      extracurricularName: item.name,
      registrationDate: formatDateLong(now),
      status: "Pending Approval",
    });
    setSuccessOpen(true);
  };

  return (
    <>
      <style>{`
        .re-card-shadow { box-shadow: 0 1px 2px rgba(16,24,40,0.06); }
      `}</style>

      <div className="px-8 pb-10">
        {!registrationOpen ? (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#C1200C]" />
              </div>

              <div className="mt-5 text-xl font-semibold text-gray-900">
                Registration Is Not Available Yet
              </div>

              <div className="mt-2 text-sm text-gray-400 leading-relaxed max-w-130 mx-auto">
                Extracurricular registration has not been opened by the coordinator.
                Please wait until the registration period begins.
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Active Registration */}
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden re-card-shadow">
              <div className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-[#C1200C]" />
                  </div>

                  <div>
                    <div className="text-[15px] font-semibold text-gray-900 leading-tight">
                      Active Registration
                    </div>
                    <div className="text-sm text-gray-400 mt-1 leading-snug">
                      Your registration is currently being reviewed by the coordinator.
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-full text-xs font-medium ${statusPill(activeRegistration.status)}`}>
                  {activeRegistration.status}
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="px-6 py-4 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Puzzle size={16} className="text-gray-400" />
                  <span className="text-gray-400">Extracurricular:</span>
                  <span className="text-gray-900 font-medium">
                    {activeRegistration.extracurricularName}
                  </span>
                </div>

                <div className="h-5 w-px bg-gray-100" />

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  <span className="text-gray-400">Registration Date:</span>
                  <span className="text-gray-900 font-medium">
                    {activeRegistration.registrationDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="mt-6 flex items-center justify-between gap-6">
              <div className="w-[320px]">
                <div className="relative">
                  <SearchIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#C1200C]/10 focus:border-[#C1200C]/30"
                  />
                </div>
              </div>

              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  className="h-12 px-5 rounded-2xl border border-[#C1200C] bg-white text-sm text-gray-500 flex items-center gap-3 cursor-pointer"
                >
                  <span>{category}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {categoryOpen && (
                  <div className="absolute right-0 mt-3 w-55 bg-white border border-gray-200 rounded-2xl overflow-hidden z-20 shadow-[0_10px_25px_rgba(16,24,40,0.08)]">
                    <div className="py-2">
                      {CATEGORY_ORDER.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCategory(c);
                            setCategoryOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer"
                        >
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryPill(c)}`}>
                            {c}
                          </span>
                          {category === c ? <Check size={16} className="text-gray-400" /> : <span />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid cards atau Empty State */}
            {filtered.length === 0 ? (
              <div className="col-span-full min-h-75 flex items-center justify-center mt-6 border border-dashed border-gray-300 rounded-2xl">
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center">
                    <SearchIcon className="w-6 h-6 text-[#C1200C]" />
                  </div>
                  <div className="mt-5 text-[17px] font-semibold text-gray-900">
                    No extracurriculars found
                  </div>
                  <div className="mt-2 text-[14px] text-gray-500 max-w-100 mx-auto leading-relaxed">
                    We couldn't find any extracurriculars matching your search. Try adjusting your filters or search term.
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden re-card-shadow"
                  >
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <CardIcon type={item.iconType} />
                          <div className="text-[15px] font-semibold text-gray-900 truncate">
                            {item.name}
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryPill(item.category)}`}>
                          {item.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <User size={16} className="text-gray-400" />
                          <span className="text-gray-400">Mentor:</span>
                          <span className="text-gray-900 font-medium">{item.mentor}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500">
                          <CalendarDays size={16} className="text-gray-400" />
                          <span className="text-gray-400">Schedule:</span>
                          <span className="text-gray-900 font-medium">{item.scheduleDay}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-900 font-medium">{item.scheduleTime}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-gray-400">Location:</span>
                          <span className="text-gray-900 font-medium">{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => handleRegister(item)}
                        className="w-full h-12 rounded-2xl bg-[#C1200C] text-white text-sm font-medium hover:brightness-95 active:brightness-90 transition cursor-pointer"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <NotificationModal
        isOpen={successOpen}
        type="success"
        title="Registration Success"
        message="Your extracurricular has been registered successfully."
        buttonText="Return to Extracurricular"
        onButtonClick={() => setSuccessOpen(false)}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
};

export default RegisterExtracurricular;