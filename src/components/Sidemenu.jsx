import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutGrid, Calendar, Stethoscope, ChevronsLeft, Users } from 'lucide-react'
import logo from '../assets/logo.png'

const Sidemenu = () => {
    const user = useMemo(() => {
      return JSON.parse(localStorage.getItem('user'));
    }, [])
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const allMenuItems = [
    { icon: LayoutGrid, name: 'Dashboard', id: 'dashboard', path: '/layout/dashboard' },
    { icon: Calendar, name: 'Appointments', id: 'appointments', path:'/layout/appointments'},
    { icon: Users, name: 'Doctors', id: 'doctors', path: '/layout/doctors' },
    { icon: Calendar, name: 'My Calendar', id: 'calendar', path: '/layout/calendar'},
    { icon: Users, name: 'Users', id: 'users', path: '/layout/users', requiresAdmin: true  },

  ]

  const menuItems = useMemo(()=>{
    return allMenuItems.filter(item =>{
      if(item.requiresAdmin){
        return user?.roleCode ==='ADMINISTRATOR'
      }
      return true
    })
  }, [user])

  const getActiveItem = () => {
    const currentPath = location.pathname
    const activeMenu = menuItems.find(item => item.path === currentPath)
    return activeMenu?.id || 'dashboard'
  }

  const handleMenuClick = (path) => {
    navigate(path)
  }

  const activeItem = getActiveItem()

  return (
    <>
    <div className={`hidden md:flex h-screen rounded-xl flex flex-col bg-white text-blue-500 dark:text-white dark:bg-[#101828]  transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className='flex items-center justify-between p-6 pb-8 gap-3'>
        <div className='flex items-center gap-2'>
          <Stethoscope className='w-8 h-8 text-blue-500 flex-shrink-0' />
          {!isCollapsed && <img src={logo} alt="Logo" className="w-31 h-11" />}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-1 duration-200 flex-shrink-0 hover:bg-white/10 rounded'
            title='Collapse'
          >
            <ChevronsLeft className='w-5 h-5 text-white' />
          </button>
        )}
      </div>

      <nav className='flex-1 px-3 space-y-2'>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <Icon className='w-5 h-5 flex-shrink-0' />
              {!isCollapsed && <span className='text-sm font-medium'>{item.name}</span>}
            </button>
          )
        })}
      </nav>

      {isCollapsed && (
        <div className='p-3'>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors duration-200'
            title='Expand'
          >
            <ChevronsLeft className='w-5 h-5 text-gray-400 rotate-180' />
          </button>
        </div>
      )}
    </div>
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gradient-to-br from-[#0F1419]/95 to-[#1A2234]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl px-3 py-2 flex items-center justify-between">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className={`flex-1 flex flex-col items-center justify-center p-2 ${
                  isActive ? 'text-blue-500' : 'text-gray-300'
                }`}
                aria-label={item.name}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 truncate">{item.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      </>
    
  )
}

export default Sidemenu