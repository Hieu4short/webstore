import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendChatMessage, addMessage } from "../redux/features/chatbot/chatbotSlice";
import ChatContactButton from "./Chat/ChatContactButton";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import RichProductCard from "./Chat/RichProductCard";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showAdminButton, setShowAdminButton] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { messages, isLoading } = useSelector((state) => state.chatbot);
  const dispatch = useDispatch();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage?.text?.toLowerCase() || '';
    
    // Hiển thị nút admin khi có từ khóa liên quan đến support
    if (lastMessageText.includes('admin') || 
        lastMessageText.includes('contact support') || 
        lastMessageText.includes('human assistance') ||
        lastMessageText.includes('click "💬 chat with admin"')) {
      setShowAdminButton(true);
    } else {
      setShowAdminButton(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { 
      type: 'user', 
      text: inputMessage,
      timestamp: new Date().toISOString()
    };
    dispatch(addMessage(userMessage));
    setInputMessage("");

    try {
      await dispatch(sendChatMessage({ 
        message: inputMessage, 
        sessionId: `user-session-${Date.now()}` 
      })).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(addMessage({ 
        type: 'bot', 
        text: "Sorry, I'm having trouble responding. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true
      }));
    }
  };

  // Hàm render rich content
  const renderRichContent = (message) => {
    if (!message.payload) return null;

    console.log('🎨 Rendering rich payload:', message.payload);

    switch (message.payload.type) {
      case 'rich_card':
        return (
          <div className="flex justify-start mt-2">
            <div className="max-w-xs">
              <RichProductCard 
                product={message.payload.product}
                onAddToCart={(productName) => {
                  // Thêm message xác nhận
                  dispatch(addMessage({
                    type: 'user',
                    text: `Added ${productName} to cart!`,
                    timestamp: new Date().toISOString()
                  }));
                }}
              />
            </div>
          </div>
        );

      case 'rich_carousel':
        return (
          <div className="flex justify-start mt-2">
            <div className="max-w-xs space-y-3">
              <p className="text-sm text-gray-600 font-medium">Recommended products:</p>
              {message.payload.products.slice(0, 3).map((product, index) => (
                <RichProductCard 
                  key={index}
                  product={product}
                  compact={true}
                  onAddToCart={(productName) => {
                    dispatch(addMessage({
                      type: 'user',
                      text: `Added ${productName} to cart!`,
                      timestamp: new Date().toISOString()
                    }));
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'quick_replies':
        return (
          <div className="flex justify-start mt-2">
            <div className="flex flex-wrap gap-2">
              {message.payload.buttons?.map((button, index) => (
                <button
                  key={index}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition duration-200 border border-pink-300"
                  onClick={() => {
                    dispatch(addMessage({
                      type: 'user',
                      text: button.text,
                      timestamp: new Date().toISOString()
                    }));
                    dispatch(sendChatMessage({ 
                      message: button.text, 
                      sessionId: `user-session-${Date.now()}`
                    }));
                  }}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        // Fallback cho các payload type khác
        return (
          <div className="flex justify-start mt-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-xs">
              <p className="text-sm text-yellow-800">
                🔗 Rich content available (type: {message.payload.type})
              </p>
            </div>
          </div>
        );
    }
  };

  // Hàm render message
  const renderMessage = (message, index) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={index} className="space-y-1">
        {/* Regular Message Bubble */}
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs px-3 py-2 rounded-lg ${
            isUser
              ? 'bg-pink-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}>
            {message.text}
          </div>
        </div>

        {/* Rich Content */}
        {!isUser && renderRichContent(message)}

        {/* Timestamp */}
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-2`}>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label="Open chatbot"
        >
          <FaRobot size={24} />
        </button>
      )}

      {/* Chatbot Interface */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[500px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-pink-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot className="animate-pulse" />
              <span className="font-semibold">Store Assistant</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowAdminButton(false);
              }}
              className="text-white hover:text-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                <FaRobot className="mx-auto text-2xl text-gray-300 mb-2" />
                <p>Hi! I'm your Store Assistant.</p>
                <p>Ask me about products, prices, or shipping!</p>
              </div>
            )}
            
            {messages.map(renderMessage)}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* ADMIN CHAT BUTTON - Hiển thị khi cần */}
          {showAdminButton && (
            <div className="px-4 pb-2 border-t border-gray-200 pt-2">
              <ChatContactButton />
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Ask about products, prices, shipping, or orders
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;