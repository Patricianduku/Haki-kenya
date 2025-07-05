import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Phone,
  Video,
  FileText,
  Smile,
  Paperclip
} from "lucide-react";
import { useTranslation } from "@/components/i18n/translations";

interface ChatMessage {
  id: string;
  sender: 'client' | 'lawyer';
  message: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
}

interface ChatWidgetProps {
  lawyerId?: string;
  lawyerName?: string;
  lawyerAvatar?: string;
  isOnline?: boolean;
}

export const ChatWidget = ({ 
  lawyerId, 
  lawyerName = "Legal Assistant", 
  lawyerAvatar,
  isOnline = true 
}: ChatWidgetProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "lawyer",
      message: "Hello! I'm here to help you with your legal questions. How can I assist you today?",
      timestamp: new Date(),
      isRead: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "client",
      message: message.trim(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    // Analyze message and provide intelligent response
    setTimeout(() => {
      const userMessage = newMessage.message.toLowerCase();
      
      // Check if message is gibberish or unclear
      const isGibberish = /^[^a-zA-Z]*$/.test(userMessage) || 
                         userMessage.length < 3 || 
                         /^[a-z]{1,2}$/.test(userMessage) ||
                         /^[0-9\s]+$/.test(userMessage);
      
      let response = "";
      
      if (isGibberish) {
        response = "I didn't quite understand your message. Could you please rephrase your question or let me know how I can help you with your legal matter?";
      } else if (userMessage.includes('divorce') || userMessage.includes('marriage') || userMessage.includes('separation')) {
        response = "I can help you with family law matters including divorce and separation. Would you like to schedule a consultation to discuss your specific situation?";
      } else if (userMessage.includes('contract') || userMessage.includes('agreement') || userMessage.includes('business')) {
        response = "For contract and business law matters, I'd be happy to review your situation. Would you like to book a consultation?";
      } else if (userMessage.includes('criminal') || userMessage.includes('arrest') || userMessage.includes('charge')) {
        response = "Criminal law matters require immediate attention. I recommend scheduling a consultation as soon as possible to discuss your case.";
      } else if (userMessage.includes('property') || userMessage.includes('land') || userMessage.includes('real estate')) {
        response = "Property and real estate law can be complex. I can help you understand your rights and options. Would you like to discuss this further?";
      } else if (userMessage.includes('employment') || userMessage.includes('work') || userMessage.includes('job')) {
        response = "Employment law issues can significantly impact your career. I'd be happy to help you understand your rights and options.";
      } else if (userMessage.includes('consultation') || userMessage.includes('book') || userMessage.includes('appointment')) {
        response = "Great! I can help you schedule a consultation. You can book an appointment through our consultation booking system or I can connect you with a specialist.";
      } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('help')) {
        response = "Hello! I'm here to help you with your legal questions. What type of legal matter would you like to discuss today?";
      } else {
        response = "Thank you for your message. I'd be happy to help you with your legal matter. Could you provide more details about your situation so I can better assist you?";
      }
      
      const lawyerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "lawyer",
        message: response,
        timestamp: new Date(),
        isRead: false
      };

      setMessages(prev => [...prev, lawyerMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          aria-label={t('chat.openChat')}
        >
          <MessageCircle className="w-6 h-6" />
          {messages.filter(m => !m.isRead && m.sender === 'lawyer').length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 text-xs">
              {messages.filter(m => !m.isRead && m.sender === 'lawyer').length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-xl flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={lawyerAvatar} />
                <AvatarFallback>{lawyerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold">{lawyerName}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-muted-foreground">
                    {isOnline ? t('chat.online') : t('chat.offline')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Video className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender === 'client'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t flex-shrink-0 bg-background">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                  <Smile className="w-4 h-4" />
                </Button>
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.typeMessage')}
                  className="flex-1 min-w-0"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!message.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}; 