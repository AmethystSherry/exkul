import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Users, Calendar, CalendarDays, FileText,
  Settings, LogOut, Bell, BellOff, DoorClosed,
  Building, UserCog, LayoutGrid, Ticket
} from 'lucide-react';
import ExkulLogo from '../../assets/exkul-logo.svg';

const CoordinatorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/koordinator/dashboard':
      case '/koordinator':
        return {
          title: 'Dashboard',
          subtitle: 'Monitor extracurricular activities, members, and schedules.'
        };
      case '/koordinator/users':
        return {
          title: 'User Management',
          subtitle: 'Manage admin, coordinator, and mentor accounts.'
        };
      case '/koordinator/academic-periods':
        return {
          title: 'Academic Periods',
          subtitle: 'Manage and organize academic periods and their active semesters'
        };
      case '/koordinator/register-extracurricular':
        return {
          title: 'Register Extracurricular',
          subtitle: 'Track student enrollment, class, and activity participation'
        };
      case '/koordinator/extracurricular':
        return {
          title: 'Extracurricular',
          subtitle: 'Manage extracurricular activities, mentors, and schedules.'
        };
      case '/koordinator/room-management':
        return {
          title: 'Room Management',
          subtitle: 'Manage rooms and locations for extracurricular activities.'
        };
      case '/koordinator/reports':
        return {
          title: 'Extracurricular Reports',
          subtitle: 'Manage and review extracurricular activity proposals and reports.'
        };
      case '/koordinator/members':
        return {
          title: 'Members',
          subtitle: 'Placeholder Description'
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
      ? "flex items-center gap-3 mx-4 px-4 py-3 bg-[#FEF2F2] text-[#C1200C] rounded-xl relative overflow-hidden transition-colors shrink-0"
      : "flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors shrink-0";

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
      `}</style>

      <div className="min-h-screen bg-white flex font-sans relative">

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

              <NavLink to="/koordinator/dashboard" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <LayoutGrid size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Dashboard</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/users" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <Users size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>User Management</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/academic-periods" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <Calendar size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Academic Periods</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/register-extracurricular" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <Ticket size={20} className={isActive ? 'text-[#C1200C]' : ''} fill={isActive ? 'currentColor' : 'none'} />
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>Register Extracurricular</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/room-management" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <DoorClosed size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Room Management</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/extracurricular" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <Building size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Extracurricular</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/members" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <UserCog size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Members</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/koordinator/reports" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C1200C] rounded-r-sm"></div>}
                    <FileText size={20} className={isActive ? "text-[#C1200C]" : ""} fill={isActive ? "currentColor" : "none"} />
                    <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Reports</span>
                  </>
                )}
              </NavLink>
            </div>

            <div className="flex flex-col gap-1 mt-auto pb-6 shrink-0">
              <span className="px-8 text-xs font-normal text-gray-400 mb-2 shrink-0">Others</span>
              <button onClick={() => navigate('/login')} className="flex items-center gap-3 mx-4 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors mt-1 w-full text-left cursor-pointer shrink-0">
                <LogOut size={20} className="text-[#C1200C]" />
                <span className="text-sm font-normal text-gray-500">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-73 flex flex-col min-h-screen bg-white">
          <header className="h-24 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{headerInfo.title}</h1>
              <p className="text-sm text-gray-400 mt-1">{headerInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Bell size={18} />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                      <h3 className="text-base font-medium text-gray-900">Notification</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto max-h-100 p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mb-4">
                        <BellOff size={28} className="text-[#C1200C]" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Notifications Yet</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        You're all caught up. New notifications will appear here when there's an update.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 ml-2 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white overflow-hidden shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Kim+Jiwon&background=111827&color=fff" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">Kim Jiwon</span>
                  <span className="text-xs text-gray-500">Coordinator</span>
                </div>
              </div>
            </div>
          </header>

          <div className="px-8">
            <hr className="border-gray-100" />
          </div>

          <Outlet />
        </main>
      </div>
    </>
  );
};

export default CoordinatorLayout;