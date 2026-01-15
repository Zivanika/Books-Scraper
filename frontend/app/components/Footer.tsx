"use client";
import {
  BookOpen,
  Mail,
  Github as GitHub,
  Linkedin,
  Heart,
  Scroll,
  Feather,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="text-amber-50 pt-16 pb-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,9,5,0.95) 0%, rgba(25,15,8,0.98) 50%, rgba(20,12,7,0.99) 100%)",
        borderTop: "3px solid #d4af37",
        boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-50"></div>
      <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
      <div
        className="absolute top-8 right-1/3 w-1 h-1 bg-yellow-300 rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/6 w-1 h-1 bg-yellow-400 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rotate-12"
                style={{
                  backgroundColor: "#ffff99",
                  border: "3px solid #d4af37",
                  boxShadow:
                    "0 8px 16px rgba(0,0,0,0.4), inset 0 0 20px rgba(212,175,55,0.2)",
                }}
              >
                <BookOpen className="h-8 w-8 text-amber-900" />
              </div>
              <div>
                <span
                  className="text-2xl font-bold text-yellow-200 block"
                  style={{
                    fontFamily: '"Cutive Mono", monospace',
                    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  BookMania
                </span>
                <span className="text-sm text-amber-300 opacity-80">
                  Digital Library
                </span>
              </div>
            </div>

            <p className="text-amber-200 mb-6 leading-relaxed text-lg">
              Discover your next favorite book through honest reviews from
              readers like you. Join our literary community today.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                {
                  icon: Linkedin,
                  label: "Linkedin",
                  color: "hover:text-blue-400",
                  to: "https://www.linkedin.com/in/harshita-barnwal-17a732234/",
                },
                {
                  icon: GitHub,
                  label: "GitHub",
                  color: "hover:text-gray-300",
                  to: "https://github.com/Zivanika",
                },
                {
                  icon: Mail,
                  label: "Email",
                  color: "hover:text-green-400",
                  to: "mailto:harshitabarnwal2003@gmail.com",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  target="_blank"
                  href={social.to}
                  className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-110 ${social.color}`}
                  style={{
                    backgroundColor: "rgba(255,255,153,0.1)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    color: "#d4af37",
                  }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3
              className="text-xl font-bold mb-6 text-yellow-200 flex items-center"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              <Scroll className="h-5 w-5 mr-2 text-yellow-400" />
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/books", label: "All Books" },
                { href: "/books?genre=fiction", label: "Fiction" },
                { href: "/books?genre=non-fiction", label: "Non-Fiction" },
                { href: "/books?genre=mystery", label: "Mystery" },
                { href: "/books?genre=sci-fi", label: "Sci-Fi" },
                { href: "/books?genre=romance", label: "Romance" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href || ""}
                    className="text-amber-300 hover:text-yellow-200 transition-all duration-300 text-lg group flex items-center"
                  >
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <h3
              className="text-xl font-bold mb-6 text-yellow-200 flex items-center"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              <Feather className="h-5 w-5 mr-2 text-yellow-400" />
              Account
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/login", label: "Login" },
                { href: "/register", label: "Sign Up" },
                { href: "/profile", label: "Profile" },
                { href: "/profile/reviews", label: "My Reviews" },
                { href: "/profile/favorites", label: "Favorites" },
                { href: "/profile/reading-list", label: "Reading List" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href || ""}
                    className="text-amber-300 hover:text-yellow-200 transition-all duration-300 text-lg group flex items-center"
                  >
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support Section */}
          <div>
            <h3
              className="text-xl font-bold mb-6 text-yellow-200 flex items-center"
              style={{ fontFamily: '"Cutive Mono", monospace' }}
            >
              <BookOpen className="h-5 w-5 mr-2 text-yellow-400" />
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#", label: "Help Center" },
                { href: "#", label: "Contact Us" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Cookie Policy" },
                { href: "#", label: "GDPR Compliance" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href || ""}
                    className="text-amber-300 hover:text-yellow-200 transition-all duration-300 text-lg group flex items-center"
                  >
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div
          className="mt-16 p-8 rounded-xl text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,153,0.1) 0%, rgba(212,175,55,0.1) 100%)",
            border: "2px solid rgba(212,175,55,0.3)",
            boxShadow: "inset 0 0 20px rgba(255,255,153,0.05)",
          }}
        >
          <h3
            className="text-2xl font-bold text-yellow-200 mb-4"
            style={{ fontFamily: '"Cutive Mono", monospace' }}
          >
            Stay Updated with New Books
          </h3>
          <p className="text-amber-300 mb-6 text-lg max-w-2xl mx-auto">
            Get weekly recommendations and be the first to know about new
            additions to our library.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 px-4 py-3 rounded-lg text-amber-900 placeholder-amber-700 outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255,255,153,0.9)",
                border: "2px solid #d4af37",
              }}
            />
            <button
              className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: "#ffff99",
                color: "#2d1b0e",
                border: "2px solid #d4af37",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="mt-12 pt-8 text-center border-t-2"
          style={{ borderColor: "rgba(212,175,55,0.3)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-amber-400 text-lg flex items-center">
              <span>
                &copy; {new Date().getFullYear()} BookMania. Made with
              </span>
              <Heart className="h-4 w-4 mx-2 text-red-400 animate-pulse" />
              <span>for book lovers.</span>
            </p>

            <div className="flex items-center space-x-6 text-amber-400">
              <span className="text-sm">Crafted by Zivanika</span>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
