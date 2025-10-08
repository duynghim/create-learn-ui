export interface UserSectionProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  isLoading: boolean;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}