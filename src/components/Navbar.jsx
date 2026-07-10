// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import NotificationBell from './NotificationBell'

// export default function Navbar() {
//   const { user, signOut } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await signOut()
//     navigate('/login')
//   }

//   return (
//     <nav className="navbar">
//       <Link to="/dashboard" className="navbar-brand">
//         CampusBoard
//       </Link>

//       {user && (
//         <div className="navbar-right">
//           <NotificationBell userId={user.id} />
//           <Link to="/profile">Profile</Link>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       )}
//     </nav>
//   )
// }



import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  // 1. Dark Mode State
  const [isDark, setIsDark] = useState(false)

  // 2. Toggle the class on the root HTML element whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        CampusBoard
      </Link>

      {user && (
        <div className="navbar-right">
          
          {/* 3. Dark Mode Toggle Button */}
          <button 
            onClick={() => setIsDark(!isDark)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          <NotificationBell userId={user.id} />
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  )
}