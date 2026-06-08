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
import Members from './pages/koordinator/Members';

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
          <Route path="members" element={<Members />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;