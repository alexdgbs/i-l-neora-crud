import React from "react";

const Footer = () => {
  return (
    <footer className="bg-emerald-500 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold">
          &copy; {new Date().getFullYear()} i`l neora
        </p>
        <p className="text-sm mt-2 opacity-90">Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
