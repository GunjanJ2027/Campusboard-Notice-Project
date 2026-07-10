// import { createContext, useContext, useEffect, useState } from 'react'
// import { supabase } from '../supabaseClient'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // get existing session on load
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//       setLoading(false)
//     })

//     // listen for login/logout/token refresh
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })

//     return () => listener.subscription.unsubscribe()
//   }, [])

//   const signUp = (email, password) => supabase.auth.signUp({ email, password })

//   const signIn = (email, password) =>
//     supabase.auth.signInWithPassword({ email, password })

//   const signOut = () => supabase.auth.signOut()

//   const value = {
//     session,
//     user: session?.user ?? null,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }


import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState('student') // 1. Added role state
  const [loading, setLoading] = useState(true)

  // 2. Define the function to fetch the role
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (data && !error) {
      setUserRole(data.role);
    } else {
      console.error("Error fetching role:", error);
    }
  };

  useEffect(() => {
    // get existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      // 3. Fetch the role if a user session exists on initial load
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // listen for login/logout/token refresh
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // 4. Fetch the role when auth state changes (like a new login)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        // Reset back to default if they log out
        setUserRole('student')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signUp = (email, password) => supabase.auth.signUp({ email, password })

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  // 5. Add userRole to the context value so other components can access it
  const value = {
    session,
    user: session?.user ?? null,
    userRole, 
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}