import React from 'react';
import Logo from '../../assets/exkul-logo.svg';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full h-21 bg-white flex items-center justify-between py-5 px-12 sticky top-0 z-50">
      <div className="flex items-center">
        <a href="#">
          <img src={Logo} alt="Exkul Logo" className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer" />
        </a>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-10">
        <a href="#fitur" className="text-base font-medium text-gray-700 hover:text-[#C1200C] transition-colors">Fitur</a>
        <a href="#cara-kerja" className="text-base font-medium text-gray-700 hover:text-[#C1200C] transition-colors">Cara Kerja</a>
        <a href="#faq" className="text-base font-medium text-gray-700 hover:text-[#C1200C] transition-colors">FAQ</a>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="text-base font-medium py-2 px-6 rounded-lg h-auto"
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
        <Button
          className="bg-[#C1200C] hover:bg-[#A31B0A] shadow-none py-2 px-6 rounded-lg text-base h-auto text-white"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;