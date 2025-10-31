import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['user', 'admin'], required: true }
  }],
  startedFrom: { type: String, enum: ['chatbot', 'direct'], default: 'chatbot' },
  status: { type: String, enum: ['active', 'resolved', 'pending'], default: 'active' },
  lastMessage: { type: String },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);