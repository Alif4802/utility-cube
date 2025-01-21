import { Calculator, Ruler, Type } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">MultiUtils</h1>
          </div>
          <div className="flex space-x-4">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Ruler className="w-4 h-4" />
              <span>Converter</span>
            </NavLink>
            <NavLink to="/calculator" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calculator className="w-4 h-4" />
              <span>Calculator</span>
            </NavLink>
            <NavLink to="/editor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Type className="w-4 h-4" />
              <span>Editor</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};