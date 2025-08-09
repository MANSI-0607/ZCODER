// server/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const controller = require('../controllers/questionController');

router.post('/', protect, controller.createQuestion);           // create
router.get('/me', protect, controller.getMyQuestions);          // list my uploads
router.get('/public', controller.getPublicQuestions);           // public feed (no auth)
router.get('/:id', controller.getQuestionById);                 // view single (public/private check inside model if needed)
router.put('/:id', protect, controller.updateQuestion);         // update (owner)
router.delete('/:id', protect, controller.deleteQuestion);      // delete (owner)
router.post('/:id/like', protect, controller.toggleLike);       // like/unlike

module.exports = router;
