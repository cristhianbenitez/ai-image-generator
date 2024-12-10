export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: () => void;
  logout: () => void;
  setUser: (user: User) => void;
}
