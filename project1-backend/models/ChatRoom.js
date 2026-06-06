import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuideBooking",
      required: true,
      unique: true, // 1 booking = 1 room
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema);
