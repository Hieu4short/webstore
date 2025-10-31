import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { 
  useGetUserConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation 
} from "../../redux/api/chatApiSlice";
import { FaComments, FaUser, FaPaperPlane, FaCircle, FaSync } from "react-icons/fa";

const AdminChat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const messagesEndRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

  // Real-time conversations với polling nhanh
  const { 
    data: conversations = [], 
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations 
  } = useGetUserConversationsQuery(userInfo?._id, {
    skip: !userInfo?._id,
    pollingInterval: autoRefresh ? 3000 : 0, // 3 giây khi bật auto refresh
  });

  // Real-time messages với polling nhanh
  const { 
    data: messages = [], 
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages 
  } = useGetMessagesQuery(selectedConversation, {
    skip: !selectedConversation,
    pollingInterval: autoRefresh ? 2000 : 0, // 2 giây khi bật auto refresh
  });

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  // Auto scroll to bottom khi có messages mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto refetch khi select conversation mới
  useEffect(() => {
    if (selectedConversation) {
      refetchMessages();
    }
  }, [selectedConversation, refetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        conversationId: selectedConversation,
        senderId: userInfo._id,
        content: message.trim()
      }).unwrap();
      
      setMessage("");
      // Refetch ngay lập tức sau khi gửi
      setTimeout(() => {
        refetchMessages();
        refetchConversations();
      }, 500);
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  const handleManualRefresh = () => {
    refetchConversations();
    if (selectedConversation) {
      refetchMessages();
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(p => p.role === 'user')?.user;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (conversationsLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-white mt-4">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg">
        {/* Header với refresh controls */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaComments className="text-pink-500 text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-white">Customer Support Chat</h1>
                <p className="text-gray-400">
                  Active conversations: {conversations.length}
                  {autoRefresh && <span className="text-green-400 ml-2">• Live</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleManualRefresh}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition duration-200"
                title="Refresh now"
              >
                <FaSync className={conversationsLoading ? 'animate-spin' : ''} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Auto-refresh</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? 'bg-pink-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-700 bg-gray-900">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
            </div>
            
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <FaComments className="text-gray-600 text-4xl mx-auto mb-4" />
                  <p className="text-gray-400">No conversations yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Customer conversations will appear here when they contact support
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const user = getOtherParticipant(conversation);
                  const isActive = conversation._id === selectedConversation;
                  
                  return (
                    <div
                      key={conversation._id}
                      onClick={() => setSelectedConversation(conversation._id)}
                      className={`p-4 border-b border-gray-700 cursor-pointer transition duration-200 ${
                        isActive ? 'bg-pink-600' : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <FaCircle className="text-green-500 absolute -bottom-1 -right-1 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">
                            {user?.name || 'Customer'}
                          </h3>
                          <p className="text-gray-200 text-sm truncate">
                            {conversation.lastMessage || 'New conversation'}
                          </p>
                          <p className="text-gray-300 text-xs mt-1">
                            {formatTime(conversation.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-800">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-900">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {getOtherParticipant(conversations.find(c => c._id === selectedConversation))?.name || 'Customer'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {getOtherParticipant(conversations.find(c => c._id === selectedConversation))?.email || 'Customer support'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">
                        {messages.length} messages
                      </span>
                      {autoRefresh && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs">Live</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                      <p className="text-gray-400 mt-2">Loading messages...</p>
                    </div>
                  ) : messagesError ? (
                    <div className="text-center py-8">
                      <p className="text-red-400">Error loading messages</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No messages yet</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Start the conversation
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.sender._id === userInfo._id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl ${
                            msg.sender._id === userInfo._id
                              ? 'bg-pink-600 text-white rounded-br-none'
                              : 'bg-gray-700 text-white rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form 
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-700 bg-gray-900"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !message.trim()}
                      className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <FaComments className="text-gray-600 text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {conversations.length > 0 ? 'Select a Conversation' : 'No Conversations'}
                  </h3>
                  <p className="text-gray-400">
                    {conversations.length > 0 
                      ? 'Choose a conversation from the list to start chatting' 
                      : 'When customers contact support, conversations will appear here'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;