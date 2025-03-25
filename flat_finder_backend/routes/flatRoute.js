const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatController');
const { tokenMiddleware, ownerOrAdminMiddleware } = require('../middleware/authMiddleware');

router.get('/', flatController.getAllFlats);
router.post('/', tokenMiddleware, flatController.createFlat);
router.get('/:flatId', flatController.getFlatById);
router.get('/:ownerId', tokenMiddleware,flatController.getFlatByOwnerId);
router.patch('/:flatId', tokenMiddleware, ownerOrAdminMiddleware, flatController.updateFlat);
router.put('/:flatId', tokenMiddleware, ownerOrAdminMiddleware, flatController.updateFlat);
router.delete('/:flatId', tokenMiddleware, ownerOrAdminMiddleware, flatController.deleteFlat);

module.exports = router;