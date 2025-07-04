'use client';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: User;
  expires: string;
}

// Simple client-side authentication using localStorage
export const auth = {
  // Get current user
  get currentUser() {
    const session = this.getSession();
    return session?.user || null;
  },

  // Get current session from localStorage
  getSession: (): AuthSession | null => {
    if (typeof window === 'undefined') return null;
    
    const sessionData = localStorage.getItem('growth-diary-session');
    if (!sessionData) return null;
    
    try {
      const session = JSON.parse(sessionData);
      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        localStorage.removeItem('growth-diary-session');
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  // Sign in with email and name (UI simulation)
  signIn: (email: string, name: string = 'User'): AuthSession => {
    const user: User = {
      id: `user_${Date.now()}`,
      name,
      email,
    };

    const session: AuthSession = {
      user,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    localStorage.setItem('growth-diary-session', JSON.stringify(session));
    return session;
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem('growth-diary-session');
    localStorage.removeItem('growth-diary-entries');
    localStorage.removeItem('growth-diary-goals');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return auth.getSession() !== null;
  }
};

// Data storage helpers
export const storage = {
  // Get entries from localStorage
  getEntries: () => {
    if (typeof window === 'undefined') return [];
    
    const entriesData = localStorage.getItem('growth-diary-entries');
    return entriesData ? JSON.parse(entriesData) : [];
  },

  // Save entries to localStorage
  setEntries: (entries: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('growth-diary-entries', JSON.stringify(entries));
  },

  // Add new entry
  addEntry: (entry: any) => {
    const entries = storage.getEntries();
    const newEntry = {
      ...entry,
      _id: `entry_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    entries.push(newEntry);
    storage.setEntries(entries);
    return newEntry;
  },

  // Get goals from localStorage
  getGoals: () => {
    if (typeof window === 'undefined') return [];
    
    const goalsData = localStorage.getItem('growth-diary-goals');
    return goalsData ? JSON.parse(goalsData) : [];
  },

  // Save goals to localStorage
  setGoals: (goals: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('growth-diary-goals', JSON.stringify(goals));
  },

  // Add new goal
  addGoal: (goal: any) => {
    const goals = storage.getGoals();
    const newGoal = {
      ...goal,
      _id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      currentValue: 0,
      completed: false,
    };
    goals.push(newGoal);
    storage.setGoals(goals);
    return newGoal;
  }
}; 