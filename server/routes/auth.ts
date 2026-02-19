import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { query } from '../db';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';
import { UserResponse } from '../types/user';

const router = Router();

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const mapGender = (gender?: string): string | null => {
  if (!gender) return null;
  const mapping: Record<string, string> = {
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'prefer_not_to_say': 'Prefer not to say',
  };
  return mapping[gender] || gender;
};

// POST /register - Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors.map(e => e.message)
      });
    }

    const { full_name, email, phone, password, gender } = validation.data;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user with free subscription by default
    const result = await query(
      `INSERT INTO users (full_name, email, phone, password_hash, gender, subscription_status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, phone, gender, subscription_status, created_at`,
      [full_name, email.toLowerCase(), phone || null, password_hash, mapGender(gender), 'free']
    );

    const user: UserResponse = result.rows[0];

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /login - Login with email/password
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors.map(e => e.message)
      });
    }

    const { email, password } = validation.data;

    // Find user
    const result = await query(
      'SELECT id, full_name, email, phone, gender, subscription_status, password_hash, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Return user without password_hash
    const userResponse: UserResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      subscription_status: user.subscription_status,
      created_at: user.created_at,
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /me - Get current user (protected)
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await query(
      'SELECT id, full_name, email, phone, gender, subscription_status, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
