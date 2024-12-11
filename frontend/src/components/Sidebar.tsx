import CollectionIcon from '@assets/icons/collections.svg';
import FeedIcon from '@assets/icons/feed.svg';
import HistoryIcon from '@assets/icons/history.svg';
import HomeIcon from '@assets/icons/home.svg';
import SignInIcon from '@assets/icons/signin.svg';
import SignOutIcon from '@assets/icons/signout.svg';
import LogoIcon from '@assets/logo.svg';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, openAuthModal } from '@store/slices/authSlice';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// TODO: Move to a constant file
const PATHS = [
  {
    icon: HomeIcon,
    path: '/',
  },
  {
    icon: FeedIcon,
    path: '/feed',
  },
  {
    icon: HistoryIcon,
    path: '/history',
  },
  {
    icon: CollectionIcon,
    path: '/collection',
  },
];

export const Sidebar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const openModal = () => dispatch(openAuthModal());
  const handleLogout = () => dispatch(logout());

  const isInCurrentPathStyle = (path: string) =>
    pathname === path ? 'active-path' : '';

  return (
    <aside className="w-full max-w-[72px] h-full flex flex-col items-center px-4 py-6 border-r border-darkAlt2">
      <img src={LogoIcon} alt="Logo" className="w-[22px] h-[22px] mb-14" />

      <div className="flex flex-col gap-4">
        {PATHS.map(({ icon, path }) => (
          <Link
            key={path}
            role="navigation"
            className={`navigation-button ${isInCurrentPathStyle(path)}`}
            to={path}
          >
            <img src={icon} alt={`${path.slice(1) || 'home'} icon`} />
          </Link>
        ))}
      </div>

      {!user ? (
        <button className="navigation-button mt-auto" onClick={openModal}>
          <img src={SignInIcon} alt="Sign in icon" />
        </button>
      ) : (
        <div className="relative mt-auto ">
          <div className="flex items-center group">
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-8 h-8 rounded-full cursor-pointer "
              onClick={() => setShowLogout(!showLogout)}
            />
            <button
              onClick={handleLogout}
              className={`absolute left-full ml-2 px-4 py-2 flex items-center justify-center gap-2 bg-darkAlt2 rounded text-sm text-white transition-opacity duration-200
              ${
                showLogout ? 'opacity-100' : 'opacity-0'
              } w-[120px] group-hover:opacity-100`}
            >
              <img src={SignOutIcon} alt="Sign out icon" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
