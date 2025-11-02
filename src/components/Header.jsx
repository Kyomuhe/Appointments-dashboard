import { Bell, Search } from "lucide-react"
import avatar from '../assets/default.png'
import { useState } from 'react'
import ProfileModal from "../models/Profile"
import { useGreeting } from "../hooks/useGreeting"
import logo from "../assets/logo.png"
import { useSelector } from "react-redux"

const Header = () => {
  const greeting = useGreeting()
  // const user = useMemo(() => {
  //   return JSON.parse(localStorage.getItem('user'));
  // }, []) //useFocus useCallback

  const user = useSelector((state) => state.auth.user);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // useEffect(
  //   ()=>{
  //     useGreeting()
  //   },[]
  // )


  return (
    <div className="w-full h-20  flex items-center md:justify-between justify-center px-4 md:px-8 dark:text-white">
      <div className="flex flex-col">
        <h1 className="hidden md:flex text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent object-contain">
          {greeting}
        </h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-3 bg-white dark:bg-white/5 rounded-lg px-4 py-2.5 dark:hover:bg-white/10 transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent focus:outline-none placeholder:text-gray-500 text-sm w-40"
          />
        </div>

        <div className="flex justify-center md:justify-end gap-2">
          <img 
          className="block md:hidden h-15 w-35"
          src ={logo}
          />

        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
    

        <button 
        onClick = {() => setIsProfileModalOpen(!isProfileModalOpen)}
        className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="flex flex-col text-right text-xs">
            <span className="font-medium text-white">{user?.firstName}  {user?.lastName}</span>
            <span className="text-gray-400">@{user?.username}</span>
          </div>
          <img 
            src={avatar} 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover border border-blue-500/30"
          />
        </button>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose = {() => setIsProfileModalOpen(false)}
      />
    </div>
  )
}

export default Header