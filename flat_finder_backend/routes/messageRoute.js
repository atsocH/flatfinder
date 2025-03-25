const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { tokenMiddleware, ownerOrAdminMiddleware } = require('../middleware/authMiddleware');

router.get('/flats/:flatId/messages', tokenMiddleware, ownerOrAdminMiddleware, messageController.getAllMessages);
router.get('/flats/:flatId/messages/:senderId', tokenMiddleware, messageController.getUserMessages);
router.get('/user/:userId', tokenMiddleware, messageController.getMessagesForUser);
router.post('/flats/:flatId/messages', tokenMiddleware, messageController.addMessage);
router.post('/', tokenMiddleware, messageController.createMessage);

module.exports = router;