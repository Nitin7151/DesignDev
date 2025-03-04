import React, { useState, useEffect } from 'react';
import { User, Settings, Code, History, Star } from 'lucide-react';

interface ProfileSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const Profile = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const sections: ProfileSection[] = [
    {
      id: 'personal',
      title: 'Personal Info',
      icon: <User className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-100">Personal Information</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-100">{user?.name}</h3>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'templates',
      title: 'My Templates',
      icon: <Code className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-100">My Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
                    Template {i}
                  </h3>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-400 mt-2">Created on March {i}, 2024</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'history',
      title: 'History',
      icon: <History className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-100">Activity History</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-full">
                      <Code className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-100 font-medium">Generated Template {i}</h3>
                      <p className="text-sm text-gray-400">{i} hour{i !== 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-100">Settings</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-100">Preferences</h3>
              <div className="space-y-4">
                {['Email Notifications', 'Dark Mode', 'Auto-save Templates'].map((setting) => (
                  <div key={setting} className="flex items-center justify-between">
                    <span className="text-gray-300">{setting}</span>
                    <button className="w-12 h-6 rounded-full bg-blue-600 relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={"w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 " + (
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-6">
              {sections.find((s) => s.id === activeSection)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;