import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Calendar, CalendarDays, FileText, 
  Settings, LogOut, Bell, Search, DoorClosed, 
  Building, UserCog, LayoutGrid 
} from 'lucide-react';
import ExkulLogo from '../../assets/exkul-logo.svg';

const CoordinatorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          subtitle: 'Manage academic years and semesters.'
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
      ? "flex items-center gap-3 mx-4 px-4 py-3 bg-[#FEF2F2] text-[#C1200C] rounded-xl relative overflow-hidden transition-colors"
      : "flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors";

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      
      {/* Sidebar */}
      <aside className="w-65 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-full z-20">
        <div className="pt-8 pb-5 px-8 flex items-center text-[#C1200C]">
           <img src={ExkulLogo} alt="Exkul Logo" className="h-10 w-auto origin-left transform scale-150" />
        </div>
        <div className="px-8 mb-4">
          <hr className="border-gray-200" />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="px-8 text-xs font-normal text-gray-400 mb-2">Main Menu</span>
            
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
                  <Calendar size={20} />
                  <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>Academic Periods</span>
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

            <a href="#" className="flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <UserCog size={20} />
              <span className="text-sm font-normal">Members</span>
            </a>
            <a href="#" className="flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <CalendarDays size={20} />
              <span className="text-sm font-normal">Schedule</span>
            </a>
            <a href="#" className="flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <FileText size={20} />
              <span className="text-sm font-normal">Reports</span>
            </a>
          </div>

          <div className="flex flex-col gap-1 mt-auto pb-6">
            <span className="px-8 text-xs font-normal text-gray-400 mb-2">Others</span>
            <a href="#" className="flex items-center gap-3 mx-4 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <Settings size={20} />
              <span className="text-sm font-normal">Settings</span>
            </a>
            <button onClick={() => navigate('/login')} className="flex items-center gap-3 mx-4 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors mt-1 w-full text-left cursor-pointer">
              <LogOut size={20} className="text-[#C1200C]" />
              <span className="text-sm font-normal text-gray-500">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-65 flex flex-col min-h-screen bg-white">
        
        <header className="h-24 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{headerInfo.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{headerInfo.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <Search size={18} />
            </button>
            
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
  );
};

export default CoordinatorLayout;