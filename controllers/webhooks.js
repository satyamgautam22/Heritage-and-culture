import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhook = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        whook.verify(JSON.stringify(req.body), req.headers, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id, // Changed __id to _id for consistency with MongoDB
                    email: data.email,
                    name: data.first_name + " " + data.last_name, // Added space between names
                    imageUrl: data.image_url,
                };
                await User.create(userData);
                res.json({ success: true });
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await User.findOneAndUpdate({ _id: data.id }, userData);
                res.json({ success: true });
                break;
            }

            case "user.deleted": {
                await User.findOneAndDelete({ _id: data.id });
                res.json({ success: true });
                break;
            }

            default:
                res.json({ success: false, message: "Unknown event type" });
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default clerkWebhook;
