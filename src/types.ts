export interface ChatParticipant {
  id: string
  name: string
  provider: "openai" | "anthropic"
  model: string
  temperature: number
  maxTokens: number
  systemPrompt?: string
  // Enhanced features
  computerUse?: boolean
  terminalAccess?: boolean
  backgroundMode?: boolean
  reasoningBudget?: number
  verbosity?: "low" | "medium" | "high"
  visionEnabled?: boolean
  webSearch?: boolean
  fileSearch?: boolean
  codeExecution?: boolean
  imageGeneration?: boolean
  dalleVersion?: "dall-e-2" | "dall-e-3" | "gpt-image-1"
}

export interface MultiChatConfig {
  participants: ChatParticipant[]
}

export interface StreamMessage {
  type: "chunk" | "error" | "complete" | "delay"
  participant?: string
  model?: string
  provider?: string
  content?: string
  delay?: number
  message?: string
}
