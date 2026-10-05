import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaUserLock,
  FaUserCog,
  FaSignInAlt,
} from "react-icons/fa";
import { FiUsers, FiHelpCircle, FiArrowRight, FiCalendar, FiImage, FiShield } from "react-icons/fi";

const logo = "/images/brand-assets/fsf-icon.png";
const wordmark = "/images/brand-assets/fsf-wordmark.png";

/**
 * Header — two-band structure mirroring the reference site's masthead:
 *
 *  1. Brand band  — near-white strip with the centered icon + wordmark
 *     lockup (the site's "letterhead"). Compact actions (donate, menu)
 *     pin to the right on screens below lg.
 *  2. Tan nav bar — full-width warm-tan band with evenly spaced, plain
 *     light-weight links (active link in sage green). No pill buttons.
 *
 * The mobile menu is `absolute` under the sticky header (not fixed): the
 * header creates a CSS containing block that would trap a fixed child.
 */

const primaryLinks = [
  { label: "Home", path: "/" },
  { label: "Donate", path: "/donate" },
  { label: "Board Members", path: "/board" },
];

const moreLinks = [
  {
    label: "Volunteer",
    path: "/volunteer",
    desc: "Lend your hours and skills",
    icon: FiUsers,
  },
  {
    label: "Support",
    path: "/support",
    desc: "Request help or send feedback",
    icon: FiHelpCircle,
  },
  {
    label: "Events",
    path: "/events",
    desc: "Upcoming programs and outreach",
    icon: FiCalendar,
  },
  {
    label: "Gallery",
    path: "/gallery",
    desc: "Photos and videos from the field",
    icon: FiImage,
  },
];

const adminLinks = [
  { label: "Admin Dashboard", path: "/admin", icon: <FaUserLock /> },
  { label: "Settings", path: "/admin/settings", icon: <FaUserCog /> },
];

function Header({ className = "" }) {
  const { user, isAdmin, signOut, loading } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNavToggle = () => setNavOpen((prev) => !prev);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut();
  };

  // Close dropdowns on navigation
  React.useEffect(() => {
    setNavOpen(false);
    setUserMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  // Lock background scroll while the mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  // Scroll-aware elevation: the bar gains a stronger shadow once the
  // page moves, so it reads as detached from the content beneath it.
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Accessibility: close "Get Involved" on outside click or Escape
  React.useEffect(() => {
    if (!moreOpen) return;

    function handleClose(e) {
      if (e.key === "Escape") setMoreOpen(false);
      if (
        !e.target.closest(".header-more-dropdown") &&
        !e.target.closest(".header-more-trigger")
      ) {
        setMoreOpen(false);
      }
    }

    document.addEventListener("keydown", handleClose);
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("keydown", handleClose);
      document.removeEventListener("click", handleClose);
    };
  }, [moreOpen]);

  // Accessibility: close user menu on outside click or Escape
  React.useEffect(() => {
    if (!userMenuOpen) return;

    function handleClose(e) {
      if (e.key === "Escape") setUserMenuOpen(false);
      if (
        !e.target.closest(".header-user-dropdown") &&
        !e.target.closest(".header-user-trigger")
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleClose);
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("keydown", handleClose);
      document.removeEventListener("mousedown", handleClose);
    };
  }, [userMenuOpen]);

  // Accessibility: Escape closes the mobile menu too
  React.useEffect(() => {
    if (!navOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [navOpen]);

  // Tan-bar link styling: plain, light, wide-tracked — active reads sage.
  const idleLink =
    "font-display font-light text-[15px] tracking-wide text-neutral-800 hover:text-brand-700 transition-colors";
  const activeLink =
    "font-display font-light text-[15px] tracking-wide text-brand-700";

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-warm-md" : "shadow-warm-sm"
      } ${className}`}
      data-testid="site-header"
    >
      {/* ------------------------------------------------------------
          Band 1 — brand masthead: centered lockup on near-white,
          exactly like the reference site's letterhead.
         ------------------------------------------------------------ */}
      <div className="relative w-full border-b border-neutral-200/60 bg-[#F8F6F7]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3.5 sm:px-6 sm:py-4">
          <Link
            to="/"
            aria-label="Flourishing Souls Foundation Home"
            className="flex items-center gap-3 sm:gap-4"
          >
            <img
              src={logo}
              alt=""
              className="h-15 w-15 sm:h-12 sm:w-12 lg:h-13 lg:w-13"
            />
            <img
              src={wordmark}
              alt="Flourishing Souls Foundation"
              className="h-15 w-auto sm:h-12 lg:h-14"
            />
          </Link>
        </div>

        {/* Compact actions — pinned right on screens below lg */}
        <div className="absolute inset-y-0 right-3 flex items-center gap-2 sm:right-5 lg:hidden">
          {!loading && !user && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-500 transition hover:text-brand-700"
              title="For foundation staff"
            >
              <FaSignInAlt className="text-[10px]" /> Staff
            </Link>
          )}
          <Link
            to="/donate"
            className="inline-flex items-center rounded-full bg-brand-600 px-3.5 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white shadow-warm-sm transition hover:bg-brand-700"
          >
            Donate
          </Link>
          <button
            type="button"
            onClick={handleNavToggle}
            aria-label={
              navOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-controls="header-nav"
            aria-expanded={navOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
            data-testid="headerMobileNavToggle"
          >
            {navOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------
          Band 2 — tan nav bar: full-width, evenly spaced plain links
          (lg+ only; smaller screens use the grouped mobile menu).
         ------------------------------------------------------------ */}
      <nav
        className="hidden lg:block w-full bg-[#789055]"
        aria-label="Site navigation"
      >
        <div className="relative mx-auto max-w-7xl px-6 xl:px-8">
          <ul className="flex items-center justify-center gap-6 py-4">
            {primaryLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`px-2 py-1 ${
                    location.pathname === link.path ? activeLink : idleLink
                  }`}
                  aria-current={
                    location.pathname === link.path ? "page" : undefined
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                className={`header-more-trigger flex items-center gap-1.5 px-2 py-1 ${
                  moreLinks.some((l) => l.path === location.pathname)
                    ? activeLink
                    : idleLink
                }`}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((o) => !o)}
              >
                Get Involved
                <FaChevronDown
                  className={`text-[10px] transition-transform duration-200 ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {moreOpen && (
                <div
                  className="header-more-dropdown absolute left-0 top-full pt-3 w-72 z-50"
                  role="menu"
                >
                  <div className="bg-white border border-[#789055] shadow-warm-lg rounded overflow-hidden p-1.5">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        role="menuitem"
                        className={`flex items-start gap-3 px-3 py-2.5 rounded transition-colors ${
                          location.pathname === link.path
                            ? "bg-brand-50"
                            : "hover:bg-neutral-100"
                        }`}
                      >
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-brand-50 text-brand-600">
                          <link.icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span
                            className={`block text-sm font-medium ${
                              location.pathname === link.path
                                ? "text-brand-700"
                                : "text-neutral-900"
                            }`}
                          >
                            {link.label}
                          </span>
                          <span className="block text-xs text-neutral-400">
                            {link.desc}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          </ul>


        </div>
      </nav>

      {/* Backdrop: dims the page behind the open mobile menu and closes it on tap */}
      <div
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
        className={`lg:hidden absolute inset-x-0 top-full h-screen bg-neutral-950/40 backdrop-blur-[1px] z-30 transition-opacity duration-200 ${
          navOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile / tablet menu — grouped sections, pinned CTA, auth actions */}
      <nav
        id="header-nav"
        className={`lg:hidden bg-white border-t border-neutral-100 shadow-warm-lg absolute top-full left-0 right-0 z-40 origin-top transition-all duration-200 ease-out ${
          navOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!navOpen}
        aria-label="Mobile navigation"
        data-testid="headerMobileNavMenu"
      >
        <div className="px-4 sm:px-6 py-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Pinned donate CTA */}
          <Link
            to="/donate"
            className="reveal group flex items-center justify-between rounded-2xl bg-brand-600 px-5 py-3.5 text-white shadow-warm-md transition hover:bg-brand-700"
          >
            <span className="flex flex-col">
              <span className="font-display text-base">Donate now</span>
              <span className="text-xs text-white/85">
                Every gift reaches a program directly
              </span>
            </span>
            <FiArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* Explore */}
          <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            Explore
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {primaryLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block rounded-xl px-4 py-3 font-display font-light text-base transition-colors ${
                    location.pathname === link.path
                      ? "bg-brand-50 text-brand-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                  aria-current={
                    location.pathname === link.path ? "page" : undefined
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Get involved */}
          <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            Get involved
          </p>
          <ul className="space-y-2">
            {moreLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                    location.pathname === link.path
                      ? "bg-brand-50"
                      : "hover:bg-neutral-100"
                  }`}
                  aria-current={
                    location.pathname === link.path ? "page" : undefined
                  }
                >
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      location.pathname === link.path
                        ? "bg-brand-100 text-brand-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-medium text-base text-neutral-900">
                      {link.label}
                    </span>
                    <span className="block text-xs text-neutral-400">
                      {link.desc}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Staff access (donors never need an account) */}
          {!loading && !user && (
            <div className="mt-6 border-t border-neutral-100 pt-5">
              <Link
                to="/admin"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 font-medium text-sm text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-700"
              >
                <FaSignInAlt className="text-xs" /> Staff login
              </Link>
              <p className="mt-3 text-center text-[11px] text-neutral-400">
                Donations never need an account — just give, securely.
              </p>
            </div>
          )}

          {user && (
            <div className="mt-6 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                <img
                  src={user.avatar || "/images/brand-assets/fsf-icon.png"}
                  alt={user.fullName || user.email}
                  className="w-10 h-10 rounded-full border border-neutral-200 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900">
                    {user.fullName || user.email}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {isAdmin ? "Administrator" : "Member"}
                  </div>
                </div>
              </div>
              <ul className="mt-2 space-y-0.5">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-neutral-800 hover:bg-brand-50 font-medium text-base transition-all"
                    data-testid="headerMobileProfile"
                  >
                    <FaUserCircle className="text-neutral-400" /> Profile
                  </Link>
                </li>
                {isAdmin &&
                  adminLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-neutral-800 hover:bg-brand-50 rounded-xl font-medium text-base transition-all"
                      >
                        <span className="text-neutral-400">{link.icon}</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-error-600 hover:bg-error-50 rounded-xl font-medium text-base transition"
                    data-testid="headerMobileLogout"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
