import asyncHandler from '../middleware/asyncHandler.js'; // Added `.js` for the correct import path
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';
import User from '../model/userModel.js';

const CreateUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new Error("Please enter all Fields");
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate salt and hash the password correctly
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt); // Pass both the password and salt

    user = new User({
      username,
      email,
      password: hashedPass, // Corrected field name: `password`
    });

    await user.save();

    // Generate the JWT token and send it in a cookie (assumed generateToken sets the cookie)
    generateToken(res, user._id);

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username, // Fixed typo `usernmae`
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      // If password is correct, generate token and return user data
      generateToken(res, existingUser._id);
      res.status(200).json({
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
        },
      });
      return;
    } else {
      // Password is incorrect
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
  } else {
    // If user is not found, return error
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
});



const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "logged Out Successfully" });
});


export { CreateUser, loginUser, logout };


