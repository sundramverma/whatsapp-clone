import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
{
    conversationId: {
        type: String
    },
    senderId: {
        type: String
    },
    receiverId: {
        type: String
    },
    text: {
        type: String   // text OR file URL
    },
    fileName: {
        type: String   // 🔥 YE LINE ADD KARO
    },
    type: {
        type: String   // "text" | "file"
    }
},
{ 
    timestamps: true
});

const message = mongoose.model('Message', MessageSchema);
export default message;
