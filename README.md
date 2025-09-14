# Multi-Chat AI

A React component for configuring and running simultaneous AI conversations with multiple providers (OpenAI, Anthropic).

## Features

- 🤖 Multiple AI participants in one conversation
- ⚡ Simultaneous responses from all participants  
- 🎛️ Per-participant configuration (model, temperature, tokens, system prompts)
- 🛠️ Advanced features: computer use, terminal access, web search, code execution
- 📊 Smart rate limiting and error handling
- 🎨 Clean, accessible UI with Tailwind CSS
- 📦 TypeScript support

## Installation

```bash
npm install multi-chat-ai
```

## Usage

### Basic Setup

```tsx
import { MultiChatPanel, MultiChatClient } from 'multi-chat-ai';
import { useState } from 'react';

function App() {
  const [config, setConfig] = useState(null);
  const client = new MultiChatClient('/api/multi-chat');

  const handleSendMessage = async (message: string) => {
    if (!config) return;

    const messages = [{ role: 'user', content: message }];
    
    await client.sendMessage(messages, config, {
      onChunk: (chunk) => {
        console.log(`${chunk.participant}: ${chunk.content}`);
      },
      onComplete: () => {
        console.log('All participants responded');
      }
    });
  };

  return (
    <div>
      <MultiChatPanel 
        onConfigChange={setConfig}
        className="mb-6"
      />
      {/* Your chat UI here */}
    </div>
  );
}
```

### API Route Setup (Next.js)

Copy the provided API route to `pages/api/multi-chat/route.ts` and ensure these environment variables:

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Configuration

```tsx
const config = {
  participants: [
    {
      id: "gpt",
      name: "GPT-4.1 Assistant", 
      provider: "openai",
      model: "gpt-4.1",
      temperature: 1.0,
      maxTokens: 30000,
      systemPrompt: "You are a helpful assistant.",
      // Advanced features
      computerUse: true,
      webSearch: true,
      codeExecution: true
    },
    {
      id: "claude",
      name: "Claude Assistant",
      provider: "anthropic", 
      model: "claude-4-sonnet-20250514",
      temperature: 0.7,
      maxTokens: 64000,
      systemPrompt: "You are Claude, an AI assistant."
    }
  ]
};
```

## API

### MultiChatPanel Props

- `onConfigChange?: (config: MultiChatConfig) => void` - Called when configuration changes
- `initialConfig?: MultiChatConfig` - Initial participant configuration
- `className?: string` - Additional CSS classes

### MultiChatClient Methods

- `sendMessage(messages, config, options)` - Send message to all participants
- Options include streaming callbacks and advanced settings

### Advanced Features

Enable per-participant:
- **Computer Use**: Screen interaction and automation
- **Terminal Access**: Execute system commands
- **Web Search**: Real-time web search capabilities
- **Code Execution**: Run and interpret code
- **Background Mode**: Long-running tasks
- **Image Generation**: DALL-E integration

## License

MIT License - feel free to use in commercial projects.

## Support

For issues and feature requests, visit our GitHub repository.
