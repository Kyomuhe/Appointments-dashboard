import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import { clearTokens } from '../utils/TokenManager';
import { showToast } from '../utils/util';

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div className="absolute top-20 right-8 z-50 w-64 bg-gradient-to-b from-[#1A2234]/95 to-[#0F1419]/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        

        <div className="py-2">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-sm"
            onClick={onClose}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-sm"
            onClick={onClose}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <div className="my-2 h-px bg-white/10"></div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;