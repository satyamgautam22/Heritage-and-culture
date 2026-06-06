import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"]
      
      
    },
    description: {
      type: String,
      required: [true, "Project description is required"]
    },
    category: {
      type: String,
      required: [true, "Project category is required"]
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"]
    },
  category: {
    type: String,
    required: true,
    trim: true,
},
 uploaderName: {
      type: String,
      required: [true, "Uploader name is required"]
      
 },

likes: {
    type: Number,
    default: 0

    },

likedBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]

  },


  { timestamps: true },

);

export default mongoose.model("Project", projectSchema);
