// server/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" }, // optional longer problem description
  tags: [{ type: String, trim: true, index: true }],
  lang: { type: String, required: true, index: true },
  solution: { type: String, required: true }, // code as string
  notes: { type: String, default: "" }, // optional explanation
  isPublic: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for searching titles / descriptions / tags
questionSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Question', questionSchema);
