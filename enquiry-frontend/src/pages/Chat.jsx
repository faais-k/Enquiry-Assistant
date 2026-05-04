import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageBubble from '../components/MessageBubble'

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! Welcome to EduReach Training Academy.\n\nTell me your name, the course you're interested in, and your phone number - I'll get you all the details!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    let sid = localStorage.getItem('er_session_id')
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('er_session_id', sid)
    }
    setSessionId(sid)
  }, [])

  const sendMessage = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : input.trim()
    if (!text || loading) return

    // Handle help command locally
    if (text.toLowerCase() === '.help') {
      setMessages(prev => [...prev, 
        { from: 'user', text },
        { from: 'bot', text: "How to use EduReach Enquiry Assistant:\n\nTo get the best course details, please provide:\n1. Your Name\n2. Your Phone Number (so we can call you back)\n3. The course you're interested in:\n   • Python for Professionals\n   • Full Stack Web Development\n   • Data Science & ML\n   • Digital Marketing Mastery\n\nCommands:\n• Type '.help' to see this message again.\n• Ask about 'fees', 'duration', or 'batches' for any course." }
      ])
      setInput('')
      return
    }

    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const res = await axios.post('/api/webhook/enquiry', { 
        message: text,
        sessionId: sessionId 
      })
      setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Our systems are currently busy. We have recorded your message and a human agent will assist you soon.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="chat-page">
      <section className="chat-shell">
        <header className="chat-header">
          <div className="chat-avatar">EA</div>
          <div className="chat-title-block">
            <div className="chat-title">EduReach Academy</div>
            <div className="chat-status">
              <span className="online-dot" />
              <span>AI Enquiry Assistant - online</span>
            </div>
          </div>
          <div className="chat-menu">...</div>
        </header>

        <div className="messages-panel">
          {messages.map((msg, i) => <MessageBubble key={i} from={msg.from} text={msg.text} />)}
          {loading && <MessageBubble from="bot" text="Typing..." isLoading />}
        </div>

        <div className="composer">
          <button className="composer-icon" type="button" aria-label="Attach file" tabIndex="-1">+</button>
          <input
            className="composer-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input.trim())}
            placeholder="Type a message or .help"
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={() => sendMessage(input.trim())}
            disabled={loading}
            aria-label="Send message"
          >
            &gt;
          </button>
        </div>
      </section>
    </main>
  )
}
