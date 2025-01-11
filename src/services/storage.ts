import { CashAccount, Event } from '../types';
import { ValidationService } from './validation';

interface StorageData {
  accounts: CashAccount[];
  events: Event[];
  lastUpdated: string;
  version: number;
}

const STORAGE_KEY = 'trayecto_cash_flow_data';
const CURRENT_VERSION = 1;

export class StorageService {
  static validateData(data: Partial<StorageData>): boolean {
    if (data.accounts) {
      for (const account of data.accounts) {
        const result = ValidationService.validateAccount(account);
        if (!result.isValid) {
          console.error('Invalid account data:', result.errors);
          return false;
        }
      }
    }

    if (data.events) {
      for (const event of data.events) {
        const result = ValidationService.validateEvent(event);
        if (!result.isValid) {
          console.error('Invalid event data:', result.errors);
          return false;
        }
      }
    }

    return true;
  }

  static sanitizeData(data: Partial<StorageData>): Partial<StorageData> {
    return {
      ...data,
      accounts: data.accounts?.map(account => ValidationService.sanitizeAccount(account)),
      events: data.events?.map(event => ValidationService.sanitizeEvent(event))
    };
  }

  static saveData(data: Partial<StorageData>): boolean {
    try {
      const existingData = StorageService.loadData();
      const sanitizedData = StorageService.sanitizeData(data);
      
      if (!StorageService.validateData(sanitizedData)) {
        throw new Error('Invalid data');
      }

      const newData: StorageData = {
        ...existingData,
        ...sanitizedData,
        lastUpdated: new Date().toISOString(),
        version: CURRENT_VERSION
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  static loadData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        
        // Version check and migration could be added here
        if (parsedData.version !== CURRENT_VERSION) {
          console.warn('Data version mismatch, migrations may be needed');
        }

        const sanitizedData = StorageService.sanitizeData(parsedData);
        if (!StorageService.validateData(sanitizedData)) {
          throw new Error('Invalid stored data');
        }

        return sanitizedData as StorageData;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    
    return {
      accounts: [],
      events: [],
      lastUpdated: new Date().toISOString(),
      version: CURRENT_VERSION
    };
  }

  static clearData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
} 