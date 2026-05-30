import { create } from 'zustand';

export type BootPhase = 'grub' | 'booting' | 'login' | 'desktop';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

export interface User {
  username: string;
  password: string;
  avatar: string;
  isGuest?: boolean;
}

export interface SystemState {
  bootPhase: BootPhase;
  user: User;
  currentTime: Date;
  workspaces: number[];
  activeWorkspace: number;
  notifications: Notification[];
  isLocked: boolean;
  bootSequenceStarted: boolean;

  // Actions
  setBootPhase: (phase: BootPhase) => void;
  login: (username: string, password: string) => boolean;
  loginAsGuest: () => void;
  switchUser: (user: User) => void;
  logout: () => void;
  bootSequence: () => void;
  setCurrentTime: (time: Date) => void;
  setActiveWorkspace: (workspace: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  powerOff: () => void;
  restart: () => void;
  sleep: () => void;
  lock: () => void;
  unlock: (password: string) => boolean;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  bootPhase: 'grub',
  user: {
    username: 'Henry',
    password: '15240254891',
    avatar: './user-avatar.png',
  },
  currentTime: new Date(),
  workspaces: [1, 2, 3],
  activeWorkspace: 1,
  notifications: [
    {
      id: 'welcome-1',
      title: 'Welcome to WebOS',
      message: 'Your WebOS system is ready to use. Explore the applications!',
      type: 'info',
      read: false,
      timestamp: new Date(),
    },
  ],
  isLocked: false,
  bootSequenceStarted: false,

  setBootPhase: (phase) => set({ bootPhase: phase }),

  login: (username, password) => {
    const state = get();
    if (username === state.user.username && password === state.user.password) {
      set({ bootPhase: 'desktop' });
      return true;
    }
    return false;
  },

  loginAsGuest: () => {
    set({
      user: {
        username: 'Guest',
        password: '',
        avatar: '',
        isGuest: true,
      },
      bootPhase: 'desktop',
      isLocked: false,
      notifications: [
        {
          id: 'welcome-guest',
          title: 'Welcome, Guest!',
          message: 'You are logged in as a guest user. All features are available. Your data will not be saved after logout.',
          type: 'info',
          read: false,
          timestamp: new Date(),
        },
      ],
    });
  },

  switchUser: (newUser) => {
    set({
      user: newUser,
      bootPhase: 'desktop',
      isLocked: false,
      notifications: [
        {
          id: `welcome-${Date.now()}`,
          title: `Welcome, ${newUser.username}!`,
          message: newUser.isGuest
            ? 'You are logged in as a guest user. All features are available.'
            : 'Your WebOS session is ready.',
          type: 'info',
          read: false,
          timestamp: new Date(),
        },
      ],
    });
  },

  logout: () => {
    set({ bootPhase: 'login', isLocked: false });
  },

  bootSequence: () => {
    const state = get();
    if (state.bootSequenceStarted) return;
    set({ bootPhase: 'grub', bootSequenceStarted: true });
    setTimeout(() => {
      set({ bootPhase: 'booting' });
      setTimeout(() => {
        set({ bootPhase: 'login' });
      }, 7000);
    }, 5500);
  },

  setCurrentTime: (time) => set({ currentTime: time }),

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),

  powerOff: () => {
    set({ bootPhase: 'grub' });
    window.location.reload();
  },

  restart: () => {
    set({ bootPhase: 'grub' });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  },

  sleep: () => {
    set({ isLocked: true, bootPhase: 'login' });
  },

  lock: () => {
    set({ isLocked: true, bootPhase: 'login' });
  },

  unlock: (password) => {
    const state = get();
    if (password === state.user.password) {
      set({ isLocked: false, bootPhase: 'desktop' });
      return true;
    }
    return false;
  },
}));
