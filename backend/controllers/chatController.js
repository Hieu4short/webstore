import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/userModel.js";

// Start new conversation from chatbot
export const startConversation = async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    // Find admin user
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(404).json({ message: "No admin user found" });
    }

    // Create or find existing active conversation
    let conversation = await Conversation.findOne({
      participants: { $elemMatch: { user: userId } },
      status: 'active'
    }).populate('participants.user', 'name email');

    if (!conversation) {
      conversation = new Conversation({
        participants: [
          { user: userId, role: 'user' },
          { user: adminUser._id, role: 'admin' }
        ],
        startedFrom: 'chatbot',
        status: 'active'
      });
      await conversation.save();
    }

    // Create initial message if provided
    if (message) {
      const newMessage = new Message({
        conversation: conversation._id,
        sender: userId,
        content: message
      });
      await newMessage.save();

      // Update conversation last message
      conversation.lastMessage = message;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    res.status(201).json({
      conversationId: conversation._id,
      participants: conversation.participants,
      message: "Conversation started successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      content
    });

    await message.save();

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date()
    });

    // Populate sender info
    await message.populate('sender', 'name email');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation messages
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user conversations
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: { $elemMatch: { user: userId } }
    })
    .populate('participants.user', 'name email')
    .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};