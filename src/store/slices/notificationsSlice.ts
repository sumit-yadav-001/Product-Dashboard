import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotifType = 'info' | 'success' | 'warning' | 'error' | 'mention' | 'system';

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  avatar?: string;
  actionUrl?: string;
}

interface NotificationsState {
  items: AppNotification[];
}

// Seed with realistic dummy notifications
const SEED: AppNotification[] = [
  { id: 'n1',  type: 'mention',  title: 'Emily Johnson mentioned you',       message: 'Hey, can you review the Q4 analytics report?',          read: false, createdAt: new Date(Date.now() - 5  * 60000).toISOString(), avatar: 'https://dummyjson.com/icon/emilys/128' },
  { id: 'n2',  type: 'success',  title: 'Backup completed',                  message: 'Full system backup finished successfully (2.4 GB).',     read: false, createdAt: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 'n3',  type: 'warning',  title: 'Storage at 82%',                    message: 'Consider cleaning up old backups or upgrading storage.',  read: false, createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'n4',  type: 'info',     title: 'New user registered',               message: 'Michael Williams just created an account.',              read: true,  createdAt: new Date(Date.now() - 2  * 3600000).toISOString(), avatar: 'https://dummyjson.com/icon/michaelw/128' },
  { id: 'n5',  type: 'error',    title: 'Payment failed',                    message: 'Order #0042 payment could not be processed.',            read: false, createdAt: new Date(Date.now() - 3  * 3600000).toISOString() },
  { id: 'n6',  type: 'system',   title: 'Scheduled maintenance',             message: 'System maintenance window: May 20, 2:00–4:00 AM UTC.',   read: true,  createdAt: new Date(Date.now() - 5  * 3600000).toISOString() },
  { id: 'n7',  type: 'mention',  title: 'Sophia Brown left a comment',       message: 'Great work on the new dashboard design!',                read: true,  createdAt: new Date(Date.now() - 8  * 3600000).toISOString(), avatar: 'https://dummyjson.com/icon/sophiab/128' },
  { id: 'n8',  type: 'success',  title: 'Export ready',                      message: 'Your users.csv export is ready to download.',            read: true,  createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'n9',  type: 'info',     title: 'API rate limit warning',            message: 'You have used 80% of your monthly API quota.',           read: true,  createdAt: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: 'n10', type: 'warning',  title: 'Login from new device',             message: 'New sign-in detected from Chrome on Windows (NYC).',     read: true,  createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
];

const initialState: NotificationsState = { items: SEED };

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markRead: (state, action: PayloadAction<string>) => {
      const n = state.items.find(i => i.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead: (state) => {
      state.items.forEach(n => { n.read = true; });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearAll: (state) => {
      state.items = [];
    },
    addNotification: (state, action: PayloadAction<Omit<AppNotification, 'id' | 'read' | 'createdAt'>>) => {
      state.items.unshift({
        ...action.payload,
        id: `n${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
  },
});

export const { markRead, markAllRead, deleteNotification, clearAll, addNotification } = notificationsSlice.actions;
