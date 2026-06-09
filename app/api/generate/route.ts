import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_KEY || '')

export async function POST(request: Request) {
  try {
    const { model, messages, userQuery, searchEnabled } = await request.json()

    if (!process.env.AI_STUDIO_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const aiModel = genAI.getGenerativeModel({ model })

    // 构建历史上下文
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // 如果启用了网络搜索，在用户查询前添加搜索指令
    let enhancedQuery = userQuery
    if (searchEnabled) {
      enhancedQuery = `Please help me answer the following question. If you need current information, use your search capabilities to find accurate and up-to-date information.

Question: ${userQuery}

Please provide a detailed and helpful response based on your knowledge and any relevant search results.`
    }

    const chat = aiModel.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    })

    const result = await chat.sendMessage(enhancedQuery)
    const response = await result.response
    const text = await response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}