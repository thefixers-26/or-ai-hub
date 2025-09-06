import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Brain, 
  Lightbulb,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { aiService } from '../../services/aiService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIAssistantProps {
  visible: boolean;
  onToggle: () => void;
  onProblemGenerated: (problem: any) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  visible,
  onToggle,
  onProblemGenerated
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Operations Research assistant. I can help you formulate optimization problems, interpret solutions, and provide insights. Try describing your problem in natural language!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');

    try {
      const response = await aiService.interpretNaturalLanguage(input);
      
      setMessages(prev => {
        const newMessages = prev.filter(m => !m.isLoading);
        
        let assistantContent = `I've analyzed your problem and detected it as **${response.problem_type.replace('_', ' ')}** with ${(response.confidence * 100).toFixed(0)}% confidence.`;
        
        if (response.extracted_data) {
          assistantContent += `\n\n**Structured Problem:**\n`;
          assistantContent += `- Objective: ${response.extracted_data.objective.type} ${response.extracted_data.objective.coefficients.join('x₁ + ') + 'x₂'}\n`;
          assistantContent += `- Variables: ${response.extracted_data.variables.join(', ')}\n`;
          assistantContent += `- Constraints: ${response.extracted_data.constraints.length} identified\n`;
          
          onProblemGenerated(response.extracted_data);
        }

        if (response.suggestions && response.suggestions.length > 0) {
          assistantContent += `\n\n**Suggestions:**\n${response.suggestions.map((s: string) => `• ${s}`).join('\n')}`;
        }

        return [...newMessages, {
          id: Date.now().toString(),
          type: 'assistant',
          content: assistantContent,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = prev.filter(m => !m.isLoading);
        return [...newMessages, {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again with a different formulation.',
          timestamp: new Date()
        }];
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!visible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-105"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-90">Ready to help optimize</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Analyzing...</span>
                      </div>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    )}
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your optimization problem..."
                    className="w-full p-3 pr-10 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                  <div className="absolute bottom-2 right-2">
                    <Lightbulb className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};