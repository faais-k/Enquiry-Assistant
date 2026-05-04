export default function MessageBubble({ from, text, isLoading }) {
  const isUser = from === 'user'
  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      <div className={`message-bubble ${isLoading ? 'loading' : ''}`}>
        {isLoading ? (
          <span className="typing-dots" aria-label={text}>
            <span />
            <span />
            <span />
          </span>
        ) : text}
        <span className="message-meta">now</span>
      </div>
    </div>
  )
}
