import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#004936] w-full py-10 px-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 max-w-7xl mx-auto">

        {/* Left Section - Logo + Tagline */}
     <div className="flex flex-col items-center md:items-start -mt-6">

          <img
            src="/assets/logo1.png"
            alt="logo"
            className="w-[140px] h-[130px] mb-2"
          />
          <p className="font-semibold text-base leading-tight">Adopt a Tree.</p>
          <p className="text-sm mt-1 text-[#F5EF67]">Leave a legacy</p>
        </div>

        {/* Middle Section - Navigation + Copyright */}
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-center gap-[8rem] text-base font-medium">
            <p>Home</p>
            <p>About Us</p>
            <p>How it Works</p>
          </div>
          <p className="text-sm md:text-base mt-8 font-normal tracking-wide leading-relaxed ">
            Copyright 2025 Adopt a Tree. All rights reserved
          </p>
        </div>

        {/* Right Section - Location */}
        <div className="flex flex-col items-center md:items-end text-sm leading-tight">
          <p className="font-semibold text-[#F5EF67]">Adopt a Tree.</p>
          <p>Nairobi,</p>
          <p>Kenya</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
