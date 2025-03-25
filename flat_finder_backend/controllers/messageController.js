const Message = require('../models/messageModel');
const Flat = require('../models/flatModel');
const User = require('../models/userModel');

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({ flatId: req.params.flatId }).populate('senderId', 'firstName lastName').populate('receiverId', 'firstName lastName');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserMessages = async (req, res) => {
    try {
        const messages = await Message.find({ flatId: req.params.flatId, senderId: req.params.senderId }).populate('senderId', 'firstName lastName').populate('receiverId', 'firstName lastName');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMessagesForUser = async (req, res) => {
    try {
        const messages = await Message.find({ receiver: req.params.userId }).populate('sender', 'firstName lastName');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.flatId);
        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }

        const receiver = await User.findById(flat.ownerId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        const message = new Message({
            flatId: req.params.flatId,
            senderId: req.user._id,
            receiverId: flat.ownerId,
            content: req.body.content
        });

        const savedMessage = await message.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        console.log('Sender ID:', senderId);
        console.log('Receiver ID:', receiverId);
        console.log('Content:', content);

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
            timestamp: new Date()
        });

        await message.save();
        res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};