// SECURITY NOTE: This is an MVP-level authentication system using local storage.
// In a production environment, you MUST use:
// 1. Server-side authentication
// 2. Strong hashing algorithms (bcrypt/argon2), NOT simple encoding
// 3. Secure HTTP-only cookies or JWTs
// 4. Proper SSL/TLS encryption

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string; // MVP: Base64 encoded (NOT SECURE)
  name: string;
  createdAt: string;
  plan: 'free' | 'pro' | 'team';
}

export interface AuthSession {
  userId: string;
  expiry: number;
}

const STORAGE_USERS_KEY = 'meetmind_users';
const STORAGE_SESSION_KEY = 'meetmind_session';
const STORAGE_ATTEMPTS_KEY = 'meetmind_login_attempts';

// --- Helpers ---

// Mock hashing function (DO NOT USE IN PRODUCTION)
const hashPassword = (password: string): string => {
  return btoa(password + "_meetmind_salt"); 
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const checkPasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length > 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
};

// --- Storage Logic ---

const getUsers = (): UserAccount[] => {
  const users = localStorage.getItem(STORAGE_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUser = (user: UserAccount) => {
  const users = getUsers();
  // Check if user exists to update or push new
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

// --- Auth Actions ---

export const login = (email: string, password: string): { success: boolean; user?: UserAccount; error?: string } => {
  // Rate limiting check
  const attemptsObj = JSON.parse(localStorage.getItem(STORAGE_ATTEMPTS_KEY) || '{"count": 0, "lockout": 0}');
  const now = Date.now();
  
  if (attemptsObj.lockout > now) {
    const remaining = Math.ceil((attemptsObj.lockout - now) / 1000);
    return { success: false, error: `Too many attempts. Try again in ${remaining}s` };
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (user && user.passwordHash === hashPassword(password)) {
    // Reset attempts
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
    
    // Create session
    const session: AuthSession = {
      userId: user.id,
      expiry: now + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    return { success: true, user };
  }

  // Handle failure & Rate limit increment
  attemptsObj.count += 1;
  if (attemptsObj.count >= 5) {
    attemptsObj.lockout = now + (60 * 1000); // 1 minute lockout
    attemptsObj.count = 0;
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(attemptsObj));
    return { success: false, error: "Too many failed attempts. Account locked for 1 minute." };
  } else {
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(attemptsObj));
    return { success: false, error: "Invalid email or password" };
  }
};

export const signup = (name: string, email: string, password: string): { success: boolean; user?: UserAccount; error?: string } => {
  const users = getUsers();
  
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Email already exists" };
  }

  const newUser: UserAccount = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    plan: 'free'
  };

  saveUser(newUser);

  // Auto login
  const session: AuthSession = {
    userId: newUser.id,
    expiry: Date.now() + (24 * 60 * 60 * 1000)
  };
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));

  return { success: true, user: newUser };
};

export const loginAsDemoUser = (): { success: boolean; user: UserAccount } => {
  const demoUser: UserAccount = {
    id: 'demo-user-id',
    email: 'demo@meetmind.ai',
    name: 'Demo Admin',
    passwordHash: hashPassword('demo123'),
    createdAt: new Date().toISOString(),
    plan: 'team' // Unlocks all features
  };

  saveUser(demoUser);

  const session: AuthSession = {
    userId: demoUser.id,
    expiry: Date.now() + (24 * 60 * 60 * 1000)
  };
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));

  return { success: true, user: demoUser };
};

export const logout = () => {
  localStorage.removeItem(STORAGE_SESSION_KEY);
};

export const getCurrentSession = (): UserAccount | null => {
  const sessionStr = localStorage.getItem(STORAGE_SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session: AuthSession = JSON.parse(sessionStr);
    if (Date.now() > session.expiry) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }

    const users = getUsers();
    return users.find(u => u.id === session.userId) || null;
  } catch (e) {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    return null;
  }
};