import React, { useState } from 'react';

import CollectionIcon from '@assets/icons/collections.svg';
import FeedIcon from '@assets/icons/feed.svg';
import HistoryIcon from '@assets/icons/history.svg';
import HomeIcon from '@assets/icons/home.svg';
import SignInIcon from '@assets/icons/signin.svg';
import SignOutIcon from '@assets/icons/signout.svg';
import LogoIcon from '@assets/logo.svg';
import CloseIcon from '@assets/icons/close-1.svg';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, openAuthModal } from '@store/slices/authSlice';
import { Link, useLocation } from 'react-router-dom';

import {
  Path,
  HamburgerButtonProps,
  MobileTopBarProps,
  NavigationLinksProps,
  AuthSectionProps
} from '@types';

// Navigation paths configuration
const PATHS: Path[] = [
  { icon: HomeIcon, path: '/', title: 'Generator' },
  { icon: FeedIcon, path: '/feed', title: 'Feed' },
  { icon: HistoryIcon, path: '/history', title: 'History' },
  { icon: CollectionIcon, path: '/collection', title: 'Collection' }
];

// Component for mobile hamburger menu button
const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  showLogout,
  onClick
}) => (
  <button
    onClick={onClick}
    className="w-10 h-10 flex items-center justify-center z-[9999]"
    aria-label={showLogout ? 'Close menu' : 'Open menu'}
    aria-expanded={showLogout}
    aria-controls="mobile-menu"
  >
    <div className="space-y-1 bg-purple p-3 rounded-lg" aria-hidden="true">
      <span className="block w-[18px] h-0.5 bg-white"></span>
      <span className="block w-[18px] h-0.5 bg-white"></span>
      <span className="block w-[18px] h-0.5 bg-white"></span>
    </div>
  </button>
);

// Component for mobile top bar
const MobileTopBar: React.FC<MobileTopBarProps> = ({
  showLogout,
  setShowLogout
}) => (
  <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-dark border-b border-darkAlt2 flex items-center justify-between px-4 z-10">
    <img src={LogoIcon} alt="Logo" className="w-[22px] h-[22px]" />
    <HamburgerButton
      showLogout={showLogout}
      onClick={() => setShowLogout(!showLogout)}
    />
  </header>
);

// Component for navigation links
const NavigationLinks: React.FC<NavigationLinksProps> = ({
  pathname,
  setShowLogout
}) => {
  const isInCurrentPathStyle = (path: string): string =>
    pathname === path ? 'active-path' : '';

  return (
    <nav className="flex flex-col gap-4">
      {PATHS.map(({ icon, path, title }) => (
        <Link
          key={path}
          className={`navigation-button ${isInCurrentPathStyle(path)}`}
          to={path}
          onClick={() => setShowLogout(false)}
        >
          <img src={icon} alt={`${path.slice(1) || 'home'} icon`} />
          <span className="text-label md:hidden max-md:ml-2">{title}</span>
        </Link>
      ))}
    </nav>
  );
};

// Component for user authentication section
const AuthSection: React.FC<AuthSectionProps> = ({
  user,
  openModal,
  handleLogout,
  showLogout,
  setShowLogout
}) =>
  !user ? (
    <button
      className="navigation-button mt-auto w-full max-md:bg-darkAlt2 max-md:rounded-md max-md:p-2"
      onClick={openModal}
    >
      <img src={SignInIcon} alt="Sign in icon" />
      <span className="text-label md:hidden max-md:ml-2">Sign in</span>
    </button>
  ) : (
    <div className="relative mt-auto">
      <div className="flex items-center group">
        <img
          src={user.avatar}
          alt="User avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setShowLogout(!showLogout)}
        />
        <button
          onClick={handleLogout}
          className={`md:absolute w-full left-full ml-2 px-4 py-2 flex items-center justify-center gap-2 bg-darkAlt2 rounded text-sm text-white transition-opacity duration-200
          ${showLogout ? 'opacity-100' : 'opacity-0'} w-[120px] group-hover:opacity-100`}
        >
          <img src={SignOutIcon} alt="Sign out icon" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

export const Sidebar: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const openModal = () => dispatch(openAuthModal());
  const handleLogout = () => dispatch(logout());

  return (
    <>
      <MobileTopBar showLogout={showLogout} setShowLogout={setShowLogout} />

      {/* Background Overlay */}
      <div
        className={`fixed inset-0 z-10 bg-black transition-opacity duration-300 md:hidden ${
          showLogout
            ? 'opacity-50 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowLogout(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static ${showLogout ? 'right-0' : '-right-full'} md:right-auto top-0 max-md:w-full max-w-[300px] lg:w-[72px] lg:max-w-[72px]  h-full flex flex-col md:items-center px-8 md:px-4 py-6 bg-dark md::bg-transparent md:border-l md:border-r border-darkAlt2 transition-all duration-300 z-50`}
      >
        {/* Close Navigation Button for Mobile */}
        <button
          onClick={() => setShowLogout(false)}
          className="md:hidden self-start mb-8 p-2 bg-darkAlt2 rounded-md"
          aria-label="Close navigation"
        >
          <img src={CloseIcon} alt="Close icon" />
        </button>

        {/* Desktop Logo */}
        <div className="hidden md:block">
          <img src={LogoIcon} alt="Logo" className="w-[22px] h-[22px] mb-14" />
        </div>

        <NavigationLinks pathname={pathname} setShowLogout={setShowLogout} />

        <AuthSection
          user={user}
          openModal={openModal}
          handleLogout={handleLogout}
          showLogout={showLogout}
          setShowLogout={setShowLogout}
        />
      </aside>
    </>
  );
};
