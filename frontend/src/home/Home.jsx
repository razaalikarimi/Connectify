import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {

  const [selectedUser , setSelectedUser] = useState(null);
  const [isSidebarVisible , setIsSidebarVisible]= useState(true);

  const handelUserSelect=(user)=>{
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar=()=>{
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  return (
    <div className='fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 w-full h-full overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative z-10 w-full h-full flex'>
        <div className='flex w-full h-full gap-0'>
          {/* Sidebar - 1 part (25%) */}
          <div className={`w-full md:w-1/4 transition-all duration-300 h-full ${isSidebarVisible ? 'block' : 'hidden md:block'}`}>
            <div className='h-full bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/50 overflow-hidden'>
              <Sidebar onSelectUser={handelUserSelect}/>
            </div>
          </div>

          {/* Divider */}
          <div className={`hidden md:block w-px bg-gray-700/50 ${isSidebarVisible && selectedUser ? '' : 'hidden'}`}></div>

          {/* Message Container - 3 parts (75%) */}
          <div className={`w-full md:w-3/4 transition-all duration-300 h-full ${selectedUser ? 'block' : 'hidden md:block'}`}>
            <div className='h-full bg-gray-900/80 backdrop-blur-xl overflow-hidden'>
              <MessageContainer onBackUser={handelShowSidebar}/>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;

