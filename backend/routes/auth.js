import express from 'express';
import { supabase } from '../lib/database.js';
import logger from '../lib/logger.js';

const router = express.Router();

/**
 * @route POST /api/v1/auth/login
 * @desc User login
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      logger.error(`Login error: ${error.message}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (data.user) {
      return res.json({
        access_token: data.session.access_token,
        token_type: 'bearer',
        expires_in: data.session.expires_in,
        user: {
          id: data.user.id,
          email: data.user.email
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({ error: 'Email or password invalid' });
  }
});

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      logger.error(`Registration error: ${error.message}`);
      return res.status(400).json({ error: 'Error creating user' });
    }
    
    if (data.user) {
      return res.json({
        access_token: data.session?.access_token || '',
        token_type: 'bearer',
        expires_in: data.session?.expires_in || 3600,
        user: {
          id: data.user.id,
          email: data.user.email
        }
      });
    } else {
      return res.status(400).json({ error: 'Error creating user' });
    }
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({ error: 'Error creating account' });
  }
});

/**
 * @route POST /api/v1/auth/logout
 * @desc User logout
 * @access Private
 */
router.post('/logout', async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.json({ message: 'Logout successful' }); // Always return success for logout
  }
});

export default router;