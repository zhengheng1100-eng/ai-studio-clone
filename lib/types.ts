export type MessageRole = 'user' | 'model'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  model: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Model {
  id: string
  name: string
  description: string
  provider: string
  contextWindow?: number
}

export const AVAILABLE_MODELS: Model[] = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Advanced multimodal capabilities with large context',
    provider: 'Google',
    contextWindow: 2800000
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient for most tasks',
    provider: 'Google',
    contextWindow: 1000000
  },
  {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    description: 'Advanced language understanding',
    provider: 'Google',
    contextWindow: 2800000
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Balanced performance and speed',
    provider: 'Google',
    contextWindow: 2800000
  }
]