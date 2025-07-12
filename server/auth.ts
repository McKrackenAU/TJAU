import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { User } from "@shared/schema";

// Extend Express User interface
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Omit<import('@shared/schema').User, 'stripeCustomerId' | 'stripeSubscriptionId'> {
      stripeCustomerId: string;
      stripeSubscriptionId: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Check if it's a bcrypt hash (starts with $2b$)
  if (stored.startsWith('$2b$')) {
    return await bcrypt.compare(supplied, stored);
  }
  
  // Handle legacy scrypt format
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Detect if running in production (deployed) environment
  const isProduction = process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === 'true';
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "tarot-journey-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: isProduction, // Use secure cookies in production (HTTPS)
      httpOnly: true, // Prevent client-side access for security
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: isProduction ? 'lax' : 'lax' // Allow cross-site requests
    }
  };

  console.log('Auth setup - Production mode:', isProduction);
  console.log('Cookie settings:', sessionSettings.cookie);
  console.log('Session store configured:', !!sessionSettings.store);

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log('Login attempt for username:', username);
        const user = await storage.getUserByUsername(username);
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
          console.log('User not found');
          return done(null, false);
        }
        
        console.log('Comparing password for user:', user.username);
        
        let passwordMatch = false;
        try {
          passwordMatch = await comparePasswords(password, user.password);
          console.log('Password match:', passwordMatch);
        } catch (error) {
          console.error('Password comparison error:', error);
          return done(error);
        }
        
        if (!passwordMatch) {
          console.log('Password mismatch');
          return done(null, false);
        }
        
        // Cast to Express.User type with required string fields
        const authUser = {
          ...user,
          stripeCustomerId: user.stripeCustomerId || '',
          stripeSubscriptionId: user.stripeSubscriptionId || ''
        };
        console.log('Login successful for user:', user.username);
        return done(null, authUser);
      } catch (error) {
        console.error('Login error:', error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, {
          ...user,
          stripeCustomerId: user.stripeCustomerId || '',
          stripeSubscriptionId: user.stripeSubscriptionId || ''
        });
      } else {
        done(null, null);
      }
    } catch (error) {
      done(error, null);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create new user
      const user = await storage.createUser({
        username: String(username),
        email: String(email),
        password: await hashPassword(password),
        isAdmin: false,
        isSubscribed: false,
        hasUsedFreeTrial: false
      });

      // Log the user in automatically
      req.login({
        ...user,
        stripeCustomerId: user.stripeCustomerId || '',
        stripeSubscriptionId: user.stripeSubscriptionId || '',
      }, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    console.log('Session ID:', req.sessionID);
    console.log('Session data before auth:', req.session);
    
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      console.log('Passport authenticate callback - err:', err, 'user:', user ? 'found' : 'not found', 'info:', info);
      
      if (err) {
        console.error('Passport authentication error:', err);
        return next(err);
      }
      
      if (!user) {
        console.log('Authentication failed - no user returned');
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      console.log('Authentication successful, logging in user:', user.username);
      req.login(user, (err: any) => {
        if (err) {
          console.error('req.login error:', err);
          return next(err);
        }
        console.log('Login successful, session after login:', req.session);
        console.log('User authenticated:', req.isAuthenticated());
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('=== USER ENDPOINT ===');
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    console.log('User authenticated:', req.isAuthenticated());
    console.log('User in session:', req.user);
    
    if (!req.isAuthenticated()) {
      console.log('User not authenticated, returning 401');
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}