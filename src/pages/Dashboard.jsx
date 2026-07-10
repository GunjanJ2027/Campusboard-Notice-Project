// import { useAuth } from '../context/AuthContext'
// import { useNotices } from '../hooks/useNotices'
// import { useRealtimeNotices } from '../hooks/useRealtimeNotices'
// import Navbar from '../components/Navbar'
// import NoticeForm from '../components/NoticeForm'
// import NoticeCard from '../components/NoticeCard'

// export default function Dashboard() {
//   const { user } = useAuth()
//   const { notices, setNotices, loading, addNotice, deleteNotice } = useNotices()

//   // keeps `notices` state live-synced with DB changes from any user
//   useRealtimeNotices(setNotices)

//   const handleDelete = async (id) => {
//     await deleteNotice(id)
//     // no need to manually update state here - the realtime DELETE
//     // subscription in useRealtimeNotices will remove it from state
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="page-container">
//         <h2>Notice Board</h2>

//         <NoticeForm onAdd={addNotice} userId={user.id} />

//         {loading ? (
//           <p>Loading notices...</p>
//         ) : notices.length === 0 ? (
//           <p>No notices yet. Be the first to post!</p>
//         ) : (
//           <div className="notice-list">
//             {notices.map((notice) => (
//               <NoticeCard
//                 key={notice.id}
//                 notice={notice}
//                 currentUserId={user.id}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotices } from '../hooks/useNotices'
import { useRealtimeNotices } from '../hooks/useRealtimeNotices'
import Navbar from '../components/Navbar'
import NoticeForm from '../components/NoticeForm'
import NoticeCard from '../components/NoticeCard'

export default function Dashboard() {
  const { user } = useAuth()
  const { notices, setNotices, loading, addNotice, deleteNotice } = useNotices()

  // New state variables for the Search and Filter features
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  // keeps `notices` state live-synced with DB changes from any user
  useRealtimeNotices(setNotices)

  const handleDelete = async (id) => {
    await deleteNotice(id)
    // no need to manually update state here - the realtime DELETE
    // subscription in useRealtimeNotices will remove it from state
  }

  // The Magic Filter: Runs every time the user types a search or changes the dropdown
  const filteredNotices = notices.filter((notice) => {
    const titleMatch = notice.title?.toLowerCase().includes(searchTerm.toLowerCase());
    // Fallback to empty string in case the notice has no content text
    const contentMatch = (notice.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || contentMatch;
    
    const matchesCategory = filterCategory === 'All' || notice.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>Notice Board</h2>

        <NoticeForm onAdd={addNotice} userId={user.id} />

        {/* SEARCH AND FILTER UI */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search notices..." 
            style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Events">Events</option>
            <option value="Lost & Found">Lost & Found</option>
          </select>
        </div>

        {loading ? (
          <p>Loading notices...</p>
        ) : filteredNotices.length === 0 ? (
          <p>No notices found matching your search.</p>
        ) : (
          <div className="notice-list">
            {/* We map over filteredNotices instead of notices */}
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                currentUserId={user.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
