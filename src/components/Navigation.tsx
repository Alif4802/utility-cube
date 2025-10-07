import { Calculator, Ruler, Type, Sun, Moon, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex-shrink-0" onClick={() => setOpen(false)}>
            <h1 className="text-xl font-bold text-gradient-primary">MultiUtils</h1>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Ruler className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/calculator" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calculator className="w-4 h-4" />
              <span>Calculator</span>
            </NavLink>
            <NavLink to="/editor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Type className="w-4 h-4" />
              <span>Editor</span>
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-4"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden transition-max-height duration-300 ease-in-out overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4 space-y-2">
          <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => `nav-link block ${isActive ? 'active' : ''}`}>
            <Ruler className="w-4 h-4 inline-block mr-2" /> Home
          </NavLink>
          <NavLink to="/calculator" onClick={() => setOpen(false)} className={({ isActive }) => `nav-link block ${isActive ? 'active' : ''}`}>
            <Calculator className="w-4 h-4 inline-block mr-2" /> Calculator
          </NavLink>
          <NavLink to="/editor" onClick={() => setOpen(false)} className={({ isActive }) => `nav-link block ${isActive ? 'active' : ''}`}>
            <Type className="w-4 h-4 inline-block mr-2" /> Editor
          </NavLink>
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); setOpen(false); }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Toggle theme
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};