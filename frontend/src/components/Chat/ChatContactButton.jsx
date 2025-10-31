import { useState } from "react";
import { useSelector } from "react-redux";
import { useStartConversationMutation } from "../../redux/api/chatApiSlice";
import AdminChatModal from "./AdminChatModal";

const ChatContactButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [startConversation, { isLoading }] = useStartConversationMutation();

  const handleContactAdmin = async () => {
    if (!userInfo) {
      // Redirect to login nếu chưa đăng nhập
      window.location.href = '/login?redirect=/';
      return;
    }

    try {
      const result = await startConversation({
        userId: userInfo._id,
        message: "User requested help from chatbot"
      }).unwrap();
      
      setConversationId(result.conversationId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleContactAdmin}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold"
      >
        💬 Chat with Admin
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </button>

      <AdminChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        conversationId={conversationId}
      />
    </>
  );
};

export default ChatContactButton;