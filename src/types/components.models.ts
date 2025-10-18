import { UserLogin } from '@/types';

export interface UserSectionProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  isLoading: boolean;
  userLogin: UserLogin | null;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}