import React, { useState } from 'react';
import { Plus, Trash2, Settings, Brain, Zap, Globe, Terminal, Code, Image } from 'lucide-react';
import { ChatParticipant, MultiChatConfig } from './types';

interface MultiChatPanelProps {
  onConfigChange?: (config: MultiChatConfig) => void
  initialConfig?: MultiChatConfig
  className?: string
}

export const MultiChatPanel: React.FC<MultiChatPanelProps> = ({
  onConfigChange,
  initialConfig,
  className = ""
}) => {
  const [chatParticipants, setChatParticipants] = useState<ChatParticipant[]>(
    initialConfig?.participants || [
      {
        id: "participant-1",
        name: "GPT-4.1 Assistant",
        provider: "openai",
        model: "gpt-4.1",
        temperature: 1.0,
        maxTokens: 30000,
        systemPrompt: ""
      },
      {
        id: "participant-2", 
        name: "Claude Assistant",
        provider: "anthropic",
        model: "claude-4-sonnet-20250514",
        temperature: 0.7,
        maxTokens: 64000,
        systemPrompt: ""
      }
    ]
  );

  const baseOpenAIModels = [
    "gpt-4.1",
    "gpt-4o",
    "gpt-4o-mini", 
    "gpt-4-turbo",
    "gpt-3.5-turbo",
    "o3-mini",
  ];

  const baseAnthropicModels = [
    "claude-4-opus-20250514",
    "claude-4-sonnet-20250514", 
    "claude-3-7-sonnet-20250219",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
  ];

  const getMaxTokenLimit = (model: string): number => {
    const tokenLimits: Record<string, number> = {
      "claude-4-opus-20250514": 64000,
      "claude-4-sonnet-20250514": 64000,
      "claude-3-7-sonnet-20250219": 64000,
      "claude-3-5-sonnet-20241022": 8192,
      "claude-3-5-haiku-20241022": 8192,
      "gpt-4.1": 30000,
      "gpt-4o": 16384,
      "gpt-4o-mini": 16384,
      "gpt-4-turbo": 4096,
      "gpt-3.5-turbo": 4096,
      "o3-mini": 16384,
    };
    return tokenLimits[model] || 4096;
  };

  const getDefaultTemperature = (model: string): number => {
    return model.startsWith('gpt-5') ? 1.0 : 0.7;
  };

  const updateConfig = (newParticipants: ChatParticipant[]) => {
    setChatParticipants(newParticipants);
    onConfigChange?.({ participants: newParticipants });
  };

  const addParticipant = () => {
    const newParticipant: ChatParticipant = {
      id: `participant-${Date.now()}`,
      name: `Assistant ${chatParticipants.length + 1}`,
      provider: "openai",
      model: "gpt-4.1",
      temperature: 1.0,
      maxTokens: 30000,
      systemPrompt: ""
    };
    updateConfig([...chatParticipants, newParticipant]);
  };

  const removeParticipant = (participantId: string) => {
    if (chatParticipants.length > 1) {
      updateConfig(chatParticipants.filter(p => p.id !== participantId));
    }
  };

  const updateParticipant = (index: number, field: keyof ChatParticipant, value: any) => {
    const updated = [...chatParticipants];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'provider') {
      if (value === "openai") {
        updated[index].model = "gpt-4.1";
        updated[index].temperature = 1.0;
        updated[index].maxTokens = 30000;
      } else {
        updated[index].model = "claude-4-sonnet-20250514";
        updated[index].temperature = 0.7;
        updated[index].maxTokens = 64000;
      }
    }
    
    if (field === 'model') {
      updated[index].temperature = getDefaultTemperature(value);
      updated[index].maxTokens = Math.min(updated[index].maxTokens, getMaxTokenLimit(value));
    }
    
    updateConfig(updated);
  };

  const applyPreset = (presetName: string) => {
    const presets: Record<string, ChatParticipant[]> = {
      'claude-duo': [
        {
          id: "participant-1",
          name: "Claude 4 Sonnet",
          provider: "anthropic",
          model: "claude-4-sonnet-20250514",
          temperature: 0.7,
          maxTokens: 64000,
          systemPrompt: ""
        },
        {
          id: "participant-2",
          name: "Claude 3.7 Sonnet", 
          provider: "anthropic",
          model: "claude-3-7-sonnet-20250219",
          temperature: 0.7,
          maxTokens: 64000,
          systemPrompt: ""
        }
      ],
      'gpt-duo': [
        {
          id: "participant-1",
          name: "GPT-4.1",
          provider: "openai",
          model: "gpt-4.1",
          temperature: 1.0,
          maxTokens: 30000,
          systemPrompt: ""
        },
        {
          id: "participant-2",
          name: "GPT-4o",
          provider: "openai", 
          model: "gpt-4o",
          temperature: 0.7,
          maxTokens: 16384,
          systemPrompt: ""
        }
      ],
      'mixed-trio': [
        {
          id: "participant-1",
          name: "GPT-4.1",
          provider: "openai",
          model: "gpt-4.1", 
          temperature: 1.0,
          maxTokens: 30000,
          systemPrompt: ""
        },
        {
          id: "participant-2",
          name: "Claude 4 Sonnet",
          provider: "anthropic",
          model: "claude-4-sonnet-20250514",
          temperature: 0.7,
          maxTokens: 64000,
          systemPrompt: ""
        },
        {
          id: "participant-3", 
          name: "Claude 3.7 Sonnet",
          provider: "anthropic",
          model: "claude-3-7-sonnet-20250219",
          temperature: 0.7,
          maxTokens: 64000,
          systemPrompt: ""
        }
      ]
    };
    
    if (presets[presetName]) {
      updateConfig(presets[presetName]);
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-400">Multi-Chat Configuration</h2>
        </div>
        <div className="text-sm text-gray-400">
          {chatParticipants.length} participants
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-400">
            Configure AI participants for simultaneous responses
          </span>
          
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  applyPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded hover:bg-blue-500 transition-colors border-none outline-none"
              defaultValue=""
            >
              <option value="">Quick Setup</option>
              <option value="claude-duo">Claude Duo</option>
              <option value="gpt-duo">GPT Duo</option>
              <option value="mixed-trio">Mixed Trio</option>
            </select>
            
            <button
              onClick={addParticipant}
              className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded hover:bg-blue-500 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Participant
            </button>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {chatParticipants.map((participant, index) => (
          <div key={participant.id} className="p-4 bg-gray-800/50 rounded-lg border border-blue-500/20">
            {/* Participant Header */}
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={participant.name}
                onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Participant name"
              />
              <button
                onClick={() => removeParticipant(participant.id)}
                className="ml-3 px-3 py-2 bg-red-600 text-red-100 text-xs rounded hover:bg-red-500 transition-colors flex items-center gap-1"
                disabled={chatParticipants.length <= 1}
                title={chatParticipants.length <= 1 ? "Cannot remove last participant" : "Remove participant"}
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>

            {/* Provider and Model */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-blue-400/80 mb-1 font-medium">Provider</label>
                <select
                  value={participant.provider}
                  onChange={(e) => updateParticipant(index, 'provider', e.target.value as "openai" | "anthropic")}
                  className="w-full px-3 py-2 rounded border bg-gray-700 border-gray-600 text-blue-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-blue-400/80 mb-1 font-medium">Model</label>
                <select
                  value={participant.model}
                  onChange={(e) => updateParticipant(index, 'model', e.target.value)}
                  className="w-full px-3 py-2 rounded border bg-gray-700 border-gray-600 text-blue-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {participant.provider === "openai" 
                    ? baseOpenAIModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))
                    : baseAnthropicModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))
                  }
                </select>
              </div>
            </div>

            {/* Temperature and Max Tokens */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-blue-400/80 mb-1 font-medium">
                  Temperature ({participant.temperature})
                  {participant.model.startsWith('gpt-5') && (
                    <span className="text-yellow-400 ml-1">(Fixed at 1.0)</span>
                  )}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={participant.temperature}
                  onChange={(e) => updateParticipant(index, 'temperature', parseFloat(e.target.value))}
                  disabled={participant.model.startsWith('gpt-5')}
                  className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${
                    participant.model.startsWith('gpt-5') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <div className="flex justify-between text-xs text-blue-400/60 mt-1">
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-blue-400/80 mb-1 font-medium">
                  Max Tokens ({participant.maxTokens.toLocaleString()})
                </label>
                <input
                  type="range"
                  min="100"
                  max={getMaxTokenLimit(participant.model)}
                  step="100"
                  value={participant.maxTokens}
                  onChange={(e) => updateParticipant(index, 'maxTokens', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-blue-400/60 mt-1">
                  <span>100</span>
                  <span>{getMaxTokenLimit(participant.model).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="mb-3">
              <label className="block text-xs text-blue-400/80 mb-2 font-medium">Advanced Features</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { key: 'computerUse', label: 'Computer Use', icon: Brain },
                  { key: 'terminalAccess', label: 'Terminal', icon: Terminal },
                  { key: 'webSearch', label: 'Web Search', icon: Globe },
                  { key: 'codeExecution', label: 'Code', icon: Code },
                  { key: 'imageGeneration', label: 'Images', icon: Image },
                  { key: 'backgroundMode', label: 'Background', icon: Zap },
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center gap-1 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean((participant as any)[key])}
                      onChange={(e) => updateParticipant(index, key as keyof ChatParticipant, e.target.checked)}
                      className="w-3 h-3 text-blue-500 rounded"
                    />
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom System Prompt */}
            <div>
              <label className="block text-xs text-blue-400/80 mb-1 font-medium">
                Custom System Prompt (Optional)
              </label>
              <textarea
                value={participant.systemPrompt || ''}
                onChange={(e) => updateParticipant(index, 'systemPrompt', e.target.value)}
                className="w-full px-3 py-2 rounded border bg-gray-700 border-gray-600 text-blue-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Additional instructions for this participant..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Usage Information */}
      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <h3 className="text-sm font-medium text-green-400 mb-2">Usage Notes:</h3>
        <ul className="text-xs text-green-300/80 space-y-1">
          <li>• All participants respond simultaneously to each message</li>
          <li>• GPT-5 models require temperature = 1.0 (automatically enforced)</li>
          <li>• Token limits are set conservatively for API tier compatibility</li>
          <li>• Advanced features require proper API configuration</li>
        </ul>
      </div>

      {/* Export/Import */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            const config = { participants: chatParticipants };
            navigator.clipboard.writeText(JSON.stringify(config, null, 2));
            alert('Configuration copied to clipboard');
          }}
          className="px-3 py-1 bg-gray-600 text-gray-200 text-xs rounded hover:bg-gray-500 transition-colors"
        >
          Export Config
        </button>
        
        <button
          onClick={() => {
            const input = prompt('Paste configuration JSON:');
            if (input) {
              try {
                const config = JSON.parse(input);
                updateConfig(config.participants);
                alert('Configuration imported successfully');
              } catch (e) {
                alert('Invalid configuration format');
              }
            }
          }}
          className="px-3 py-1 bg-gray-600 text-gray-200 text-xs rounded hover:bg-gray-500 transition-colors"
        >
          Import Config
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 0 2px #1f2937;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
};
