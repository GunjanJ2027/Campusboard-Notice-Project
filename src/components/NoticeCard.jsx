// import { formatDate } from '../utils/formatDate'

// export default function NoticeCard({ notice, currentUserId, onDelete }) {
//   const isOwner = notice.user_id === currentUserId

//   return (
//     <div className="notice-card">
//       <h3>{notice.title}</h3>
//       <p>{notice.content}</p>
//       <div className="notice-meta">
//         <small>{formatDate(notice.created_at)}</small>
//         {isOwner && (
//           <button className="link-button" onClick={() => onDelete(notice.id)}>
//             Delete
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }


import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/formatDate'

export default function NoticeCard({ notice, onDelete }) {
  const { user, userRole } = useAuth() // Grab the user AND their role

  // Check if they have permission to delete (Author OR Admin)
  const canDelete = user?.id === notice.user_id || userRole === 'admin'

  return (
    <div className="notice-card" style={{ border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      
      {/* Category Badge */}
      <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
        {notice.category || 'General'}
      </span>
      
      <h3 style={{ marginTop: '0', marginBottom: '0.5rem' }}>{notice.title}</h3>
      <p>{notice.content}</p>
      
      <div className="notice-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <small style={{ color: '#6b7280' }}>{formatDate(notice.created_at)}</small>
        
        {/* Conditionally render the delete button using the canDelete check */}
        {canDelete && (
          <button 
            className="link-button" 
            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => onDelete(notice.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}