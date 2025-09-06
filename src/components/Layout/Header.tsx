import React from 'react';
import { 
  Save, 
  Upload, 
  Download, 
  Share2, 
  Settings, 
  User, 
  Bell,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  projectName: string;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  projectName, 
  onSave, 
  onExport, 
  onImport 
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section - Project Info */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{projectName}</h2>
          <p className="text-sm text-gray-600">Last saved 2 minutes ago</p>
        </div>
      </div>

      {/* Center Section - Quick Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm font-medium">Save</span>
        </button>

        <button
          onClick={onImport}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm">Import</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Export</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center space-x-3">
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </button>

        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-gray-300"></div>

        <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-medium text-gray-900">Dr. Smith</p>
            <p className="text-xs text-gray-600">Premium</p>
          </div>
        </button>
      </div>
    </header>
  );
};