export interface User {
  avatar: string;
}

export interface Path {
  icon: string;
  path: string;
  title: string;
}

export interface HamburgerButtonProps {
  showLogout: boolean;
  onClick: () => void;
}

export interface MobileTopBarProps {
  showLogout: boolean;
  setShowLogout: (show: boolean) => void;
}

export interface NavigationLinksProps {
  pathname: string;
  setShowLogout: (show: boolean) => void;
}

export interface AuthSectionProps {
  user: User | null;
  openModal: () => void;
  handleLogout: () => void;
  showLogout: boolean;
  setShowLogout: (show: boolean) => void;
}
