import React from 'react';
import LogoFooter from '../../assets/exkul-logo.svg';
import LogoWatermark from '../../assets/exkul-logo-wm-footer.svg';

const Footer = () => {
  return (
    <footer className="w-full bg-white pt-20 px-20 pb-3 relative overflow-hidden flex flex-col gap-31">
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex flex-col gap-2">
          <img
            src={LogoFooter}
            alt="Logo EXKUL"
            className="h-8 w-auto object-contain mb-1"
          />
          <p className="text-gray-500 text-sm">
            Extracurricular Management System
          </p>
        </div>

        <div className="flex gap-25">
          <div className="flex flex-col gap-5">
            <h3 className="font-medium text-gray-900">Navigation</h3>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="#fitur" className="hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="#cara-kerja" className="hover:text-gray-900 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="font-medium text-gray-900">Who Is It For?</h3>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="/koordinator/dashboard" className="hover:text-gray-900 transition-colors">Coordinator</a></li>
              <li><a href="/mentor/dashboard" className="hover:text-gray-900 transition-colors">Mentor</a></li>
              <li><a href="/student/dashboard" className="hover:text-gray-900 transition-colors">Student</a></li>
              <li><a href="/parent/dashboard" className="hover:text-gray-900 transition-colors">Parent</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="font-medium text-gray-900">Legal</h3>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="flex justify-between items-end z-10 relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5 text-gray-800 text-[15px]">
            <p>SMP Telkom Purwokerto</p>
            <p>Purwokerto, Indonesia</p>
            <p>info@smptelkompurwokerto.sch.id</p>
          </div>
          <p className="text-gray-800 text-[15px] mt-2">
            © 2026 Exkul. All rights reserved.
          </p>
        </div>
      </div>

      <img
        src={LogoWatermark}
        alt="Watermark EXKUL"
        className="absolute -bottom-16 right-[0%] h-64 w-auto select-none z-0 pointer-events-none object-contain"
      />

    </footer>
  );
};

export default Footer;