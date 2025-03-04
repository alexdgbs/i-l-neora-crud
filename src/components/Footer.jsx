import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-emerald-500 text-white font-medium py-4 shadow-lg text-center text-md">
      <div className="container mx-auto px-4 md:px-6">
      <p>&copy; {currentYear} i`l neora.</p>
      </div>
    </footer>
  );
};

export default Footer;