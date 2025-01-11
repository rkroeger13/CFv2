import { create } from 'zustand';
import { CashAccount, Event, ValidationError } from '../types';
import { StorageService } from '../services/storage';
import { ValidationService } from '../services/validation';

const mockAccounts: CashAccount[] = [
  {
    id: '1',
    name: 'Ally Checking-5678',
    type: 'checking',
    accountNumber: '5678',
    currentBalance: 12000,
    currentInflows: 5202,
    currentOutflows: 3202,
    surplusDeficit: 2000,
    yearEndProjected: 20999,
    owner: {
      name: 'Colin Overcash',
      avatar: 'https://ui-avatars.com/api/?name=Colin+Overcash'
    }
  },
  {
    id: '2',
    name: 'Chase Savings-5678',
    type: 'savings',
    accountNumber: '5678',
    currentBalance: 12000,
    currentInflows: 5202,
    currentOutflows: 3202,
    surplusDeficit: 2000,
    yearEndProjected: 20999,
    owner: {
      name: 'Colin Overcash',
      avatar: 'https://ui-avatars.com/api/?name=Colin+Overcash'
    }
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    type: 'Emergency Savings',
    name: 'Emergency Fund',
    amount: 20000,
    date: '2024-03-01',
    progress: 'On Track'
  },
  {
    id: '2',
    type: 'Sabbatical',
    name: 'Summer Break',
    amount: 20000,
    date: '2024-06-01',
    progress: 'Off Track'
  },
  {
    id: '3',
    type: 'Vacation',
    name: 'Thanksgiving Family Vacation',
    amount: 20000,
    date: '2024-11-01',
    progress: 'Off Track'
  }
];

interface CashFlowState {
  accounts: CashAccount[];
  events: Event[];
  totalBalance: number;
  totalEarmarked: number;
  totalInflows: number;
  totalOutflows: number;
  surplusDeficit: number;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationError[];
  
  // Actions
  initializeStore: () => Promise<void>;
  setAccounts: (accounts: CashAccount[]) => Promise<void>;
  setEvents: (events: Event[]) => Promise<void>;
  updateAccount: (account: CashAccount) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  recalculateTotals: () => void;
  clearValidationErrors: () => void;
}

export const useCashFlowStore = create<CashFlowState>((set, get) => ({
  accounts: [],
  events: [],
  totalBalance: 0,
  totalEarmarked: 0,
  totalInflows: 0,
  totalOutflows: 0,
  surplusDeficit: 0,
  isLoading: true,
  error: null,
  validationErrors: [],

  initializeStore: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = StorageService.loadData();
      
      if (data.accounts.length === 0 && data.events.length === 0) {
        // Load mock data only if no data exists
        data.accounts = mockAccounts;
        data.events = mockEvents;
        StorageService.saveData(data);
      }

      set({ 
        accounts: data.accounts,
        events: data.events,
        isLoading: false
      });
      
      get().recalculateTotals();
    } catch (error) {
      set({ 
        error: 'Failed to initialize data',
        isLoading: false
      });
    }
  },
  
  setAccounts: async (accounts) => {
    try {
      set({ accounts });
      await StorageService.saveData({ accounts });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to save accounts' });
    }
  },
  
  setEvents: async (events) => {
    try {
      set({ events });
      await StorageService.saveData({ events });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to save events' });
    }
  },
  
  updateAccount: async (updatedAccount) => {
    try {
      const accounts = get().accounts.map(account =>
        account.id === updatedAccount.id ? updatedAccount : account
      );
      set({ accounts });
      await StorageService.saveData({ accounts });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to update account' });
    }
  },
  
  deleteAccount: async (accountId) => {
    try {
      const accounts = get().accounts.filter(account => account.id !== accountId);
      set({ accounts });
      await StorageService.saveData({ accounts });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to delete account' });
    }
  },
  
  addEvent: async (event) => {
    try {
      const validation = ValidationService.validateEvent(event);
      if (!validation.isValid) {
        set({ validationErrors: validation.errors });
        throw new Error('Validation failed');
      }

      const sanitizedEvent = ValidationService.sanitizeEvent(event);
      const events = [...get().events, sanitizedEvent];
      set({ events, validationErrors: [] });
      await StorageService.saveData({ events });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to add event' });
    }
  },
  
  updateEvent: async (updatedEvent) => {
    try {
      const events = get().events.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      set({ events });
      await StorageService.saveData({ events });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to update event' });
    }
  },
  
  deleteEvent: async (eventId) => {
    try {
      const events = get().events.filter(event => event.id !== eventId);
      set({ events });
      await StorageService.saveData({ events });
      get().recalculateTotals();
    } catch (error) {
      set({ error: 'Failed to delete event' });
    }
  },

  recalculateTotals: () => {
    const { accounts, events } = get();
    
    const totalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
    const totalEarmarked = events.reduce((sum, event) => sum + event.amount, 0);
    const totalInflows = accounts.reduce((sum, account) => sum + account.currentInflows, 0);
    const totalOutflows = accounts.reduce((sum, account) => sum + account.currentOutflows, 0);
    const surplusDeficit = totalInflows - totalOutflows;

    set({
      totalBalance,
      totalEarmarked,
      totalInflows,
      totalOutflows,
      surplusDeficit
    });
  },

  clearValidationErrors: () => set({ validationErrors: [] })
})); 