const express = require('express');
const router = express.Router();
const { register, login, getAllUsers,approveAndAssignUser, getUserById} = require("../Controller/UserControllerr");
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:userId/approve', authMiddleware,approveAndAssignUser);
router.get('/users/:userId', authMiddleware, getUserById);


module.exports = router;
