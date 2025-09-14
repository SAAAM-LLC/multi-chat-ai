export class MultiChatClient {
  private apiEndpoint: string;
  
  constructor(apiEndpoint: string = '/api/multi-chat') {
    this.apiEndpoint = apiEndpoint;
  }

  async sendMessage(
    messages: any[],
    config: MultiChatConfig,
    options?: {
      systemPrompt?: string;
      extendedThinking?: boolean;
      budgetTokens?: number;
      prefillContent?: string;
      onChunk?: (message: StreamMessage) => void;
      onError?: (error: string) => void;
      onComplete?: () => void;
    }
  ): Promise<void> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          participants: config.participants,
          systemPrompt: options?.systemPrompt || '',
          extendedThinking: options?.extendedThinking || false,
          budgetTokens: options?.budgetTokens || 2000,
          prefillContent: options?.prefillContent || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                options?.onChunk?.(data);
              } else if (data.type === 'error') {
                options?.onError?.(data.message);
              } else if (data.type === 'complete') {
                options?.onComplete?.();
                return;
              }
            } catch (e) {
              console.error('Error parsing stream chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      options?.onError?.(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
