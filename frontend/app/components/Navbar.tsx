"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { BookOpen, User, LogOut, LogIn, Search, Menu, X, Home, Library, Info, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, children, onClick, className = "" }:any) => (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group
        ${href === pathname 
          ? 'text-yellow-200 bg-yellow-900/30 border border-yellow-600/30' 
          : 'text-amber-100 hover:text-yellow-200 hover:bg-yellow-900/20'
        }
        ${className}
      `}
      style={{
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}
    >
      {children}
      <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300"></div>
    </Link>
  );

  return (
    <>
      <nav
        className="sticky top-0 z-50 text-amber-50 shadow-lg border-b-2 border-yellow-800/30"
        style={{
          background: "linear-gradient(180deg, rgba(25,15,8,0.95) 0%, rgba(45,27,14,0.95) 50%, rgba(35,21,12,0.95) 100%)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,153,0.1)"
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rotate-6"
                style={{
                  backgroundColor: "#ffff99",
                  border: "3px solid #d4af37",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.3), inset 0 0 15px rgba(212,175,55,0.2)"
                }}
              >
                <BookOpen className="h-7 w-7 text-amber-900" />
              </div>
              <div className="flex flex-col">
                <span 
                  className="text-2xl font-bold text-yellow-200 group-hover:text-yellow-100 transition-colors"
                  style={{ fontFamily: '"Cutive Mono", monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                >
                  BookMania
                </span>
                <span className="text-xs text-amber-300 opacity-80 -mt-1">Digital Library</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink href="/">
                <Home className="h-4 w-4 mr-2 inline-block" />
                Home
              </NavLink>
              <NavLink href="/books">
                <Library className="h-4 w-4 mr-2 inline-block" />
                Books
              </NavLink>
              <NavLink href="/about">
                <Info className="h-4 w-4 mr-2 inline-block" />
                About
              </NavLink>
              <NavLink href="/contact">
                <Mail className="h-4 w-4 mr-2 inline-block" />
                Contact
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-all duration-300 hover:bg-yellow-900/20"
              style={{
                backgroundColor: "rgba(255,255,153,0.1)",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-yellow-200" />
              ) : (
                <Menu className="h-6 w-6 text-yellow-200" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-20 left-4 right-4 rounded-xl p-6 max-w-sm mx-auto"
            style={{
              background: "linear-gradient(180deg, rgba(25,15,8,0.98) 0%, rgba(45,27,14,0.98) 100%)",
              border: "2px solid #d4af37",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <NavLink href="/" onClick={() => setIsMenuOpen(false)} className="block w-full text-left">
                <Home className="h-4 w-4 mr-3 inline-block" />
                Home
              </NavLink>
              <NavLink href="/books" onClick={() => setIsMenuOpen(false)} className="block w-full text-left">
                <Library className="h-4 w-4 mr-3 inline-block" />
                Books
              </NavLink>
              <NavLink href="/about" onClick={() => setIsMenuOpen(false)} className="block w-full text-left">
                <Info className="h-4 w-4 mr-3 inline-block" />
                About
              </NavLink>
              <NavLink href="/contact" onClick={() => setIsMenuOpen(false)} className="block w-full text-left">
                <Mail className="h-4 w-4 mr-3 inline-block" />
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;