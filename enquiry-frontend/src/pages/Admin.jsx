import { useState, useEffect } from 'react'
import axios from 'axios'
import LeadRow from '../components/LeadRow'

export default function Admin() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/webhook/leads')
      const data = Array.isArray(res.data) ? res.data : res.data.leads || []
      setLeads(data)
    } catch (err) {
      console.error('Failed to fetch leads', err)
    } finally {
      setLoading(false)
    }
  }

    const updateStatus = async (phone, status) => {
    await axios.patch('/api/webhook/lead-update', { phone, status })
    fetchLeads()
    }

    const deleteLead = async (phone) => {
    if (!phone) return
    const confirmed = window.confirm('Delete this lead permanently?')
    if (!confirmed) return
    await axios.delete('/api/webhook/lead-delete', { data: { phone } })
    fetchLeads()
    }

  useEffect(() => { fetchLeads() }, [])

  return (
    <main className="admin-page">
      <section className="admin-container">
        <header className="admin-header">
          <div>
            <h2 className="admin-title">Lead Admin Panel</h2>
            <p className="admin-subtitle">Prioritized enquiries from the EduReach assistant</p>
          </div>
          <button onClick={fetchLeads} className="refresh-button">
            Refresh
          </button>
        </header>

        {loading ? <p className="admin-state">Loading leads...</p> : leads.length === 0 ? <p className="admin-state">No leads yet.</p> : (
          <div className="table-wrap">
            <table className="leads-table">
              <thead>
                <tr>
                  {['Name','Phone','Course','Last Message','Priority','Status','Last Active','Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => <LeadRow key={i} lead={lead} onUpdate={updateStatus} onDelete={deleteLead} />)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
