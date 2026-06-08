import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Building,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  ArrowRight,
  Ticket
} from 'lucide-react';
import ExkulLogo from '../../assets/exkul-logo.svg';

const PodiumIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 9h4v11h-4z" />
    <path d="M14 13h4v7h-4z" />
    <path d="M6 16h4v4H6z" />
    <circle cx="12" cy="5" r="2" />
    <path d="M2 20h20" />
  </svg>
);

const BasketballIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
    <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
  </svg>
);

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    firstName: 'Kim',
    lastName: 'Jiwon',
    email: 'kimjiwon@gmail.com',
    nis: '123456789',
    studentClass: 'VII A',
    avatar: 'https://ui-avatars.com/api/?name=Kim+Jiwon&background=111827&color=fff'
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const notifWrapRef = useRef(null);
  const bellBtnRef = useRef(null);
  const panelRef = useRef(null);
  const [caretLeft, setCaretLeft] = useState(48);

  const notifications = useMemo(
    () => [
      {
        id: 'n1',
        title: 'Your extracurricular registrat...',
        time: '1 minutes ago',
        unread: true,
        icon: <PodiumIcon className="text-[#C1200C]" size={20} strokeWidth={1.8} />,
        path: '/student/register-extracurricular'
      },
      {
        id: 'n2',
        title: 'Basketball training will start i...',
        time: '20 minutes ago',
        unread: true,
        icon: <BasketballIcon className="text-[#C1200C]" size={20} strokeWidth={1.8} />,
        path: '/student/attendance-schedule?tab=schedule'
      }
    ],
    []
  );

  useEffect(() => {
    if (!notifOpen) return;

    const onDown = (e) => {
      if (!notifWrapRef.current) return;
      if (!notifWrapRef.current.contains(e.target)) setNotifOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [notifOpen]);

  useLayoutEffect(() => {
    if (!notifOpen) return;

    const compute = () => {
      const bell = bellBtnRef.current;
      const panel = panelRef.current;
      if (!bell || !panel) return;

      const bellRect = bell.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const bellCenter = bellRect.left + bellRect.width / 2;
      const leftInsidePanel = bellCenter - panelRect.left;

      const caretSize = 16;
      const min = 18;
      const max = panelRect.width - 18 - caretSize;

      const next = Math.max(min, Math.min(leftInsidePanel - caretSize / 2, max));
      setCaretLeft(next);
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [notifOpen]);

  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/student/dashboard':
      case '/student':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your extracurricular activities and schedule.'
        };
      case '/student/register-extracurricular':
        return {
          title: 'Register Extracurricular',
          subtitle: 'Explore and join available extracurricular programs.'
        };
      case '/student/attendance-schedule':
        return {
          title: 'Attendance & Schedule',
          subtitle: 'View your upcoming schedules and attendance history.'
        };
      case '/student/talent-assessment':
        return {
          title: 'Talent Assessment',
          subtitle: 'Check your talent assessment results and feedback.'
        };
      case '/student/settings':
        return {
          title: 'Settings',
          subtitle: 'Manage your profile information and account settings'
        };
      default:
        return {
          title: 'Exkul App',
          subtitle: 'Sistem Manajemen Ekstrakurikuler'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-3 mx-4 px-4 py-3 bg-[#FEF2F2] text-[#C1200C] rounded-xl relative overflow-hidden transition-colors shrink-0'
      : 'flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors shrink-0';

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sidebar-animate { animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .sidebar-scroll::-webkit-scrollbar { width: 3px; height: 3px; background-color: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 10px; }
        aside:hover .sidebar-scroll::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); }

        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; transition: scrollbar-color 0.3s ease; }
        aside:hover .sidebar-scroll { scrollbar-color: rgba(156, 163, 175, 0.4) transparent; }

        .notif-shadow { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); }

        .notif-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; transition: scrollbar-color 0.3s ease; }
        .notif-scroll:hover { scrollbar-color: rgba(156, 163, 175, 0.4) transparent; }
        .notif-scroll::-webkit-scrollbar { width: 4px; }
        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 10px; }
        .notif-scroll:hover::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); }
      `}</style>

      <div className="min-h-screen bg-[#F9FAFB] flex font-sans relative">
        <aside className="w-65 bg-white border border-gray-200 flex flex-col fixed top-4 left-4 bottom-4 rounded-3xl z-20 overflow-hidden shadow-sm sidebar-animate">
          <div className="pt-6 pb-4 px-8 flex items-center text-[#C1200C] shrink-0">
            <img src={ExkulLogo} alt="Exkul Logo" className="h-10 w-auto origin-left transform scale-150" />
          </div>

          <div className="px-8 mb-3 shrink-0">
            <hr className="border-gray-100" />
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-6 sidebar-scroll">
            <div className="flex flex-col gap-1">
              <span className="px-8 text-xs font-normal text-gray-400 mb-2 shrink-0">Main Menu</span>

              <NavLink to="/student/dashboard" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <LayoutGrid size={20} className={isActive ? 'text-[#C1200C]' : ''} fill={isActive ? 'currentColor' : 'none'} />
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>Dashboard</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/student/register-extracurricular" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <Ticket size={20} className={isActive ? 'text-[#C1200C]' : ''} fill={isActive ? 'currentColor' : 'none'} />
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>Register Extracurricular</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/student/attendance-schedule" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <CalendarDays size={20} className={isActive ? 'text-[#C1200C]' : ''} fill={isActive ? 'currentColor' : 'none'} />
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>Attendance &amp; Schedule</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/student/talent-assessment" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <ClipboardList size={20} className={isActive ? 'text-[#C1200C]' : ''} fill={isActive ? 'currentColor' : 'none'} />
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>Talent Assessment</span>
                  </>
                )}
              </NavLink>
            </div>

            <div className="flex flex-col gap-1 mt-auto pb-6 shrink-0">
              <span className="px-8 text-xs font-normal text-gray-400 mb-2 shrink-0">Others</span>

              <NavLink to="/student/settings" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <Settings size={20} className={isActive ? 'text-[#C1200C]' : ''} fill={isActive ? 'currentColor' : 'none'} />
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>Settings</span>
                  </>
                )}
              </NavLink>

              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-3 mx-4 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors mt-1 w-full text-left cursor-pointer shrink-0"
              >
                <LogOut size={20} className="text-[#C1200C]" />
                <span className="text-sm font-normal text-gray-500">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-70 flex flex-col min-h-screen bg-white">
          <header className="h-24 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{headerInfo.title}</h1>
              <p className="text-sm text-gray-400 mt-1">{headerInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-4 ml-auto relative">
              <div ref={notifWrapRef} className="relative">
                <button
                  ref={bellBtnRef}
                  onClick={() => setNotifOpen((v) => !v)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative`}
                >
                  <Bell size={18} />
                  <span className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full bg-[#C1200C]" />
                </button>

                {notifOpen && (
                  <div
                    ref={panelRef}
                    className="absolute right-0 mt-4 w-95 bg-white border border-gray-200 rounded-[20px] notif-shadow overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div
                      className="absolute -top-2 w-4 h-4 bg-gray-50 border-l border-t border-gray-200 rotate-45"
                      style={{ left: caretLeft }}
                    />

                    <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-gray-50">
                      <div className="text-[17px] font-medium text-gray-900">Notification</div>
                    </div>

                    <div className="p-2 flex flex-col gap-1 bg-white max-h-80 overflow-y-auto notif-scroll">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifOpen(false);
                            navigate(n.path);
                          }}
                          className="flex items-center gap-4 px-3 py-3 rounded-[14px] hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-12 h-12 rounded-[14px] border border-gray-200 bg-white flex items-center justify-center shrink-0">
                            {n.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-medium text-gray-900 truncate">
                              {n.title}
                            </div>
                            <div className="text-[13px] text-gray-500 mt-0.5">
                              {n.time}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}

                            <div className="w-10 h-10 rounded-[14px] border border-gray-200 bg-white flex items-center justify-center text-gray-800 transition">
                              <ArrowRight size={18} strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="flex items-center gap-3 ml-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/student/settings')}
              >
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white overflow-hidden shrink-0">
                  <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {userProfile.firstName} {userProfile.lastName}
                  </span>
                  <span className="text-xs text-gray-500">Student</span>
                </div>
              </div>
            </div>
          </header>

          <div className="px-8">
            <hr className="border-gray-100" />
          </div>

          <Outlet context={{ userProfile, setUserProfile }} />
        </main>
      </div>
    </>
  );
};

export default StudentLayout;