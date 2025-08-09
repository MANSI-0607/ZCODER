// server/controllers/questionController.js
const Question = require('../models/Questions');
const Comment = require('../models/Comments'); // optional

// Create a question (protected)
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags = [], lang, solution, notes = '', isPublic = true } = req.body;

    if (!title || !lang || !solution || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: title, tags, lang, solution' });
    }

    const q = await Question.create({
      title,
      description,
      tags,
      lang,
      solution,
      notes,
      isPublic,
      createdBy: req.user._id
    });

    res.status(201).json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create question failed', error: err.message });
  }
};

// Get questions for the logged-in user (dashboard)
exports.getMyQuestions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      Question.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments({ createdBy: req.user._id })
    ]);

    res.json({ data: questions, page, limit, total });
  } catch (err) {
    res.status(500).json({ message: 'Fetch user questions failed', error: err.message });
  }
};

// Get public listing (with optional filters / search)
exports.getPublicQuestions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const filter = { isPublic: true };
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.lang) filter.lang = req.query.lang;
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .select('-solution') // omit solution for listing to reduce payload
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'username avatar'),
      Question.countDocuments(filter)
    ]);

    res.json({ data: questions, page, limit, total });
  } catch (err) {
    res.status(500).json({ message: 'Fetch public questions failed', error: err.message });
  }
};

// Get single question by id (increments view)
exports.getQuestionById = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id).populate('createdBy', 'username avatar');
    if (!q) return res.status(404).json({ message: 'Question not found' });

    // increment views (simple)
    q.views = (q.views || 0) + 1;
    await q.save();

    res.json(q);
  } catch (err) {
    res.status(500).json({ message: 'Fetch question failed', error: err.message });
  }
};

// Update question (only owner)
exports.updateQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    if (!q.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    const fields = ['title', 'description', 'tags', 'lang', 'solution', 'notes', 'isPublic'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) q[f] = req.body[f];
    });

    await q.save();
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete question (only owner)
exports.deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    if (!q.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    await q.remove();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Toggle like/unlike
exports.toggleLike = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });

    const uid = req.user._id;
    const already = q.likes.some(id => id.equals(uid));
    if (already) {
      q.likes.pull(uid);
    } else {
      q.likes.push(uid);
    }
    await q.save();

    res.json({ liked: !already, likesCount: q.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Like toggle failed', error: err.message });
  }
};
