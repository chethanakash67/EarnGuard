import { useState, useRef, useEffect } from 'react'
import { t } from '../i18n'
import { BrainIcon } from './Icons'

export default function AIChatAssistant({ lang = 'en' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', text: t('chatTitle', lang) + ' — ' + 'I can help you understand payouts, coverage, weather impact, and more. Ask me anything!' },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        const msg = input.trim()
        if (!msg || loading) return

        setMessages((prev) => [...prev, { role: 'user', text: msg }])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg }),
            })
            const data = await res.json()
            setMessages((prev) => [...prev, { role: 'assistant', text: data.response }])
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                className="chat-fab"
                onClick={() => setIsOpen(!isOpen)}
                title={t('askEarnGuard', lang)}
            >
                <BrainIcon size={24} />
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className="chat-panel">
                    <div className="chat-panel__header">
                        <BrainIcon size={18} />
                        <span>{t('chatTitle', lang)}</span>
                        <button className="chat-panel__close" onClick={() => setIsOpen(false)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="chat-panel__messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-msg chat-msg--assistant">
                                <div className="chat-typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-panel__input">
                        <input
                            type="text"
                            className="form-input"
                            placeholder={t('chatPlaceholder', lang)}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
