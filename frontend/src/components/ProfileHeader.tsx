import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  user: any;
  onLogout: () => void;
  onProfileClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onLogout, onProfileClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="bg-primary p-2 rounded-full">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-gray-900">{user.full_name || user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => {
              onProfileClick();
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <hr className="my-1" />
          <button
            onClick={() => {
              onLogout();
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;