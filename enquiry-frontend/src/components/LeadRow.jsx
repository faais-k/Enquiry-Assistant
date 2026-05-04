export default function LeadRow({ lead, onUpdate, onDelete }) {
  const score = Number(lead.priority_score) || 0
  const priority = score >= 70 ? { label: 'High', bg: '#d4edda' }
    : score >= 40 ? { label: 'Med', bg: '#fff3cd' }
    : { label: 'Low', bg: '#f8d7da' }

  const statusBg = {
    new: '#cce5ff', manual_review: '#f8d7da',
    follow_up_due: '#ffe5b4', contacted: '#d4edda', closed: '#e2e3e5'
  }

  const time = lead.last_contacted_at || lead.created_at
    ? new Date(lead.last_contacted_at || lead.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '-'

  const msg = lead.last_message || lead.raw_message || '-';
  const truncatedMsg = msg.length > 35 ? msg.substring(0, 35) + '...' : msg;
  const interactions = lead.interaction_count || 1;

  return (
    <tr className="lead-row">
      <td className="lead-cell">{lead.name || '-'}</td>
      <td className="lead-cell">{lead.phone || '-'}</td>
      <td className="lead-cell">{lead.course_interest || '-'}</td>
      <td className="lead-cell" title={msg}>{truncatedMsg}</td>
      <td className="lead-cell">
        <span className="badge" style={{ background: priority.bg }}>
          {priority.label} {score}
        </span>
      </td>
      <td className="lead-cell">
        <span className="badge" style={{ background: statusBg[lead.status] || '#eee' }}>
          {lead.status}
        </span>
      </td>
      <td className="lead-cell">
        <div className="time-col">
          <span>{time}</span>
          {interactions > 1 && <span className="interaction-badge">{interactions} msgs</span>}
        </div>
      </td>
      <td className="lead-cell">
        <div className="row-actions">
          <select value={lead.status} onChange={e => onUpdate(lead.phone, e.target.value)}
            className="status-select">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up_due">Follow Up Due</option>
            <option value="manual_review">Manual Review</option>
            <option value="closed">Closed</option>
          </select>
          <button
            className="delete-lead-button"
            type="button"
            onClick={() => onDelete(lead.phone)}
            disabled={!lead.phone}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
