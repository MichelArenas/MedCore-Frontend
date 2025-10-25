import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black py-4 mt-10 shadow-inner">
      <div className="text-center text-sm font-medium">
        © {new Date().getFullYear()} MedCore. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
