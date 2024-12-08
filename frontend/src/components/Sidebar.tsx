import CollectionIcon from '@assets/icons/collections.svg';
import FeedIcon from '@assets/icons/feed.svg';
import HistoryIcon from '@assets/icons/history.svg';
import HomeIcon from '@assets/icons/home.svg';
import SignInIcon from '@assets/icons/signin.svg';
import LogoIcon from '@assets/logo.svg';
import { Link, useLocation } from 'react-router-dom';

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
    path: '/collections',
  },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const isInCurrentPathStyle = (path: string) =>
    pathname === path ? 'active-path' : '';

  return (
    <div className="w-full max-w-[72px] h-full flex flex-col items-center px-4 py-6 border-r border-darkAlt2">
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

      <button className="navigation-button mt-auto">
        <img src={SignInIcon} alt="Logout icon" />
      </button>
    </div>
  );
};
