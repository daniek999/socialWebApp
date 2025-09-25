const express = require('express')
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. [ Register ]
router.post('/register', async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    // Start Register Module Process
    try {
        // 1. Verify if email exists
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Correo ya existente' });

        // 2. Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // 3. Creates the User
        const newUser = new User({ username, email, password: hashedPass });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' + error });
    }
});


// 2. [ Login ]
router.post(path = '/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. Verifications
        if (!email && !password) return res.status(400).json({ message: 'Debe ingresar correo y clave' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Correo no registrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Clave Incorrecta' });

        // 2. Generating JWT
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 3. Check JWT, grant access to the User
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


module.exports = router;