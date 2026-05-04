import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Chat from './pages/Chat'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <span className="brand-mark">ER</span>
          <span className="brand-name">EduReach</span>
          <Link to="/" className="nav-link">Chat</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
