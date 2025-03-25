const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { tokenMiddleware, adminMiddleware, ownerOrAdminMiddleware } = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', tokenMiddleware, userController.getCurrentUser);
router.get('/myFlats', tokenMiddleware, userController.getUserFlats);
router.get('/:userId', tokenMiddleware, userController.getUserById);
router.patch('/:userId', tokenMiddleware, ownerOrAdminMiddleware, userController.updateUser);
router.delete('/:userId', tokenMiddleware, ownerOrAdminMiddleware, userController.deleteUser);
router.get('/', tokenMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/favorites/:flatId', tokenMiddleware, userController.addFlatToFavorites);
router.delete('/favorites/:flatId', tokenMiddleware, userController.removeFlatFromFavorites);
router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:resetToken', userController.resetPassword);

module.exports = router;