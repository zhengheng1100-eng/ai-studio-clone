import { Conversation } from './types'

const STORAGE_KEY = 'ai_studio_conversations'
const AUTH_KEY = 'ai_studio_auth'

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveConversation(conversation: Conversation): void {
  if (typeof window === 'undefined') return
  const conversations = getConversations()
  const index = conversations.findIndex(c => c.id === conversation.id)
  
  if (index >= 0) {
    conversations[index] = conversation
  } else {
    conversations.unshift(conversation)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

export function deleteConversation(conversationId: string): void {
  if (typeof window === 'undefined') return
  const conversations = getConversations().filter(c => c.id !== conversationId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

export function getConversation(conversationId: string): Conversation | undefined {
  return getConversations().find(c => c.id === conversationId)
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function login(username: string, password: string): boolean {
  if (username === 'admin36' && password === 'admin36') {
    localStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}