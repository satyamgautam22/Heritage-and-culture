import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import GuideBooking from "../models/guideBooking.js";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const { token, bookingId } = socket.handshake.auth || {};
      if (!token || !bookingId) {
        return next(new Error("Auth data missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const booking = await GuideBooking.findById(bookingId);
      if (!booking || booking.paymentStatus !== "paid") {
        return next(new Error("Booking not eligible for chat"));
      }

      const isUser =
        decoded.role === "user" &&
        booking.userId.toString() === decoded.id;
      const isGuide =
        decoded.role === "guide" &&
        booking.guideId.toString() === decoded.id;

      if (!isUser && !isGuide) {
        return next(new Error("Unauthorized for this booking"));
      }

      socket.data = {
        bookingId,
        userId: booking.userId,
        guideId: booking.guideId,
        senderId: decoded.id,
        senderRole: decoded.role,
      };

      next();
    } catch (err) {
      next(new Error("Socket auth failed"));
    }
  });

  io.on("connection", async (socket) => {
    const { bookingId, userId, guideId } = socket.data;
    const roomName = `booking_${bookingId}`;

    let room = await ChatRoom.findOne({ bookingId });
    if (!room) {
      room = await ChatRoom.create({ bookingId, userId, guideId });
    }

    socket.join(roomName);

    // Send history
    const history = await Message.find({ chatRoomId: room._id })
      .sort({ createdAt: 1 })
      .limit(200);

    socket.emit("chatHistory", history);

    socket.on("sendMessage", async (text) => {
      if (!text || !text.trim()) return;

      const msg = await Message.create({
        chatRoomId: room._id,
        senderId: socket.data.senderId,
        senderRole: socket.data.senderRole,
        text: text.trim(),
      });

      io.to(roomName).emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => {
      socket.leave(roomName);
    });
  });
};
