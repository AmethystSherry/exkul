import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CoordinatorLayout from './components/layout/CoordinatorLayout';
import CoordinatorDashboard from './pages/koordinator/CoordinatorDashboard';
import UserManagement from './pages/koordinator/UserManagement';
import AcademicPeriods from './pages/koordinator/AcademicPeriods';
import ExtracurricularManagement from './pages/koordinator/ExtracurricularManagement';
import RoomManagement from './pages/koordinator/RoomManagement';
import Reports from './pages/koordinator/Reports';
import MembersCoordinator from './pages/koordinator/Members';
import MentorLayout from './components/layout/MentorLayout';
import MentorDashboard from './pages/mentor/MentorDashboard';
import MembersMentor from './pages/mentor/Members';
import MentorReports from './pages/mentor/Reports';
import AttendanceSchedule from './pages/mentor/AttendanceSchedule';
import MentorSettings from './pages/mentor/Settings';
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendanceSchedule from './pages/student/AttendanceSchedule';
import StudentSettings from './pages/student/Settings';
import RegisterExtracurricular from './pages/student/RegisterExtracurricular';
import ParentLayout from './components/layout/ParentLayout';
import ParentDashboard from './pages/parent/ParentDashboard';
import Attendance from './pages/parent/Attendance';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes for Coordinators (Wrapped by Layout) */}
        <Route path="/koordinator" element={<CoordinatorLayout />}>
          <Route index element={<CoordinatorDashboard />} />

          {/* /koordinator/dashboard */}
          <Route path="dashboard" element={<CoordinatorDashboard />} />

          {/* /koordinator/users */}
          <Route path="users" element={<UserManagement />} />

          {/* /koordinator/academic-periods */}
          <Route path="academic-periods" element={<AcademicPeriods />} />

          {/* /koordinator/extracurricular */}
          <Route path="extracurricular" element={<ExtracurricularManagement />} />

          {/* /koordinator/room-management */}
          <Route path="room-management" element={<RoomManagement />} />

          {/* /koordinator/reports */}
          <Route path="reports" element={<Reports />} />

          {/* /koordinator/members */}
          <Route path="members" element={<MembersCoordinator />} />

        </Route>

        {/* Private Routes for Mentor (Wrapped by Layout) */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          {/* /mentor/dashboard */}
          <Route path="dashboard" element={<MentorDashboard />} />

          {/* /mentor/members */}
          <Route path="members" element={<MembersMentor />} />

          {/* /mentor/reports */}
          <Route path="reports" element={<MentorReports />} />

          {/* /mentor/attendance-schedule */}
          <Route path="attendance-schedule" element={<AttendanceSchedule />} />

          {/* /mentor/settings */}
          <Route path="settings" element={<MentorSettings />} />
        </Route>

        {/* Private Routes for Students (Wrapped by Layout) */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          {/* /student/dashboard */}
          <Route path="dashboard" element={<StudentDashboard />} />
          {/* /student/attendance-schedule */}
          <Route path="attendance-schedule" element={<StudentAttendanceSchedule />} />
          {/* /student/settings */}
          <Route path="settings" element={<StudentSettings />} />
          {/* /student/register-extracurricular */}
          <Route path="register-extracurricular" element={<RegisterExtracurricular />} />
        </Route>

        {/* Private Routes for Parents (Wrapped by Layout) */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          {/* /parent/dashboard */}
          <Route path="dashboard" element={<ParentDashboard />} />
          {/* /parent/attendance */}
          <Route path="attendance" element={<Attendance />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;