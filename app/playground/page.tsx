'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
// import { isAuthenticated } from '@/lib/storage' // disabled for demo
import { generateId, formatDate } from './lib'
import { AVAILABLE_MODELS } from './lib'

export default function Playground() {
  const router = useRouter()
  const [model, setModel] = useState(AVAILABLE_MODELS[0].id)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => {
    // Load saved messages from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('playground_messages')
        return stored ? JSON.parse(stored) : []
      } catch { return [] }
    }
    return []
  })
  const [loading, setLoading] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Authentication check removed for demo purposes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { id: generateId(), role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => {
        const updated = [...prev, userMsg]
        if (typeof window !== 'undefined') localStorage.setItem('playground_messages', JSON.stringify(updated))
        return updated
      })
    setLoading(true)
    setInput('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [...messages, userMsg], userQuery: input, searchEnabled }),
      })
      const data = await res.json()
      const botMsg = { id: generateId(), role: 'model', content: data.response || 'Error', timestamp: new Date() }
      setMessages(prev => {
        const updated = [...prev, botMsg]
        if (typeof window !== 'undefined') localStorage.setItem('playground_messages', JSON.stringify(updated))
        return updated
      })
    } catch (e) {
      const errMsg = { id: generateId(), role: 'model', content: 'Request failed', timestamp: new Date() }
      setMessages(prev => {
        const updated = [...prev, errMsg]
        if (typeof window !== 'undefined') localStorage.setItem('playground_messages', JSON.stringify(updated))
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-input">
        <h1 className="text-xl font-bold">AI Studio Clone</h1>
        <select className="input w-auto" value={model} onChange={e => setModel(e.target.value)}>
          {AVAILABLE_MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={searchEnabled} onChange={e => setSearchEnabled(e.target.checked)} />
          <span className="text-sm">搜索</span>
        </label>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={msg.role === 'user' ? 'self-end text-right' : 'self-start'}>
            <div className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {msg.content}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{formatDate(new Date(msg.timestamp))}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 border-t border-input flex space-x-2">
        <input
          className="input flex-1"
          placeholder="输入你的问题..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
          {loading ? '发送中...' : '发送'}
        </button>
      </footer>
    </div>
  )
}
