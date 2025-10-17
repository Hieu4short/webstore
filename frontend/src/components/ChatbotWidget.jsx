import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, toggleChat, addMessage } from '../redux/features/chatbot/chatbotSlice';

const ChatbotWidget = () => {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    
    // THÊM FALLBACK ĐỂ TRÁNH LỖI
    const { messages = [], isLoading = false, isChatOpen = false } = useSelector(state => state.chatbot || {});

    // Tự động scroll xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Thêm message của user
        dispatch(addMessage({
            type: 'user',
            text: inputMessage,
            timestamp: new Date().toISOString()
        }));

        const originalMessage = inputMessage;
        setInputMessage('');

        // Gửi đến DialogFlow
        try {
            await dispatch(sendChatMessage({ message: originalMessage })).unwrap();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Nếu chat chưa mở, chỉ hiển thị nút toggle
    if (!isChatOpen) {
        return (
            <button
                onClick={() => dispatch(toggleChat())}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                aria-label="Open virtual assistant"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-lg">WebStore Assistant</h3>
                    <p className="text-blue-100 text-xs">How can I help you today?</p>
                </div>
                <button 
                    onClick={() => dispatch(toggleChat())}
                    className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-blue-700"
                    aria-label="Close virtual assistant"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>Hello! How can I help you?</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block p-3 rounded-2xl max-w-[85%] ${
                                    message.type === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                } ${message.isError ? 'bg-red-100 text-red-800 border-red-200' : ''}`}
                            >
                                {message.text}
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="text-left mb-3">
                        <div className="inline-block p-3 rounded-2xl bg-white border border-gray-200 rounded-bl-none">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question here..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatbotWidget;