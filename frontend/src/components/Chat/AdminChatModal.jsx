import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSendMessageMutation, useGetMessagesQuery } from "../../redux/api/chatApiSlice";
import { FaTimes, FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";

const AdminChatModal = ({ isOpen, onClose, conversationId }) => {
  const [message, setMessage] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const { data: messages = [], refetch } = useGetMessagesQuery(conversationId, {
    skip: !conversationId,
    pollingInterval: 3000 // Auto-refresh every 3 seconds
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        conversationId,
        senderId: userInfo._id,
        content: message.trim()
      }).unwrap();
      
      setMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600 rounded-full">
              <FaUser className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Chat with Admin</h3>
              <p className="text-gray-400 text-sm">We'll respond as soon as possible</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender._id === userInfo._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender._id === userInfo._id
                    ? 'bg-pink-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
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
      </div>
    </div>
  );
};

export default AdminChatModal;