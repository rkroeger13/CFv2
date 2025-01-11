import { CashAccount, Event } from '../types';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidationService {
  static validateAccount(account: Partial<CashAccount>): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields validation
    if (!account.name?.trim()) {
      errors.push({ field: 'name', message: 'Account name is required' });
    } else if (account.name.length > 100) {
      errors.push({ field: 'name', message: 'Account name must be less than 100 characters' });
    }

    if (!account.type) {
      errors.push({ field: 'type', message: 'Account type is required' });
    } else if (!['checking', 'savings'].includes(account.type)) {
      errors.push({ field: 'type', message: 'Invalid account type' });
    }

    if (!account.accountNumber?.trim()) {
      errors.push({ field: 'accountNumber', message: 'Account number is required' });
    } else if (!/^\d{4,17}$/.test(account.accountNumber.replace(/[- ]/g, ''))) {
      errors.push({ field: 'accountNumber', message: 'Invalid account number format' });
    }

    // Numeric fields validation
    if (typeof account.currentBalance !== 'number') {
      errors.push({ field: 'currentBalance', message: 'Current balance must be a number' });
    } else if (account.currentBalance < 0) {
      errors.push({ field: 'currentBalance', message: 'Current balance cannot be negative' });
    }

    if (typeof account.currentInflows !== 'number') {
      errors.push({ field: 'currentInflows', message: 'Current inflows must be a number' });
    } else if (account.currentInflows < 0) {
      errors.push({ field: 'currentInflows', message: 'Current inflows cannot be negative' });
    }

    if (typeof account.currentOutflows !== 'number') {
      errors.push({ field: 'currentOutflows', message: 'Current outflows must be a number' });
    } else if (account.currentOutflows < 0) {
      errors.push({ field: 'currentOutflows', message: 'Current outflows cannot be negative' });
    }

    if (typeof account.yearEndProjected !== 'number') {
      errors.push({ field: 'yearEndProjected', message: 'Year end projection must be a number' });
    }

    // Owner validation
    if (!account.owner?.name?.trim()) {
      errors.push({ field: 'owner.name', message: 'Owner name is required' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEvent(event: Partial<Event>): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields validation
    if (!event.name?.trim()) {
      errors.push({ field: 'name', message: 'Event name is required' });
    } else if (event.name.length > 100) {
      errors.push({ field: 'name', message: 'Event name must be less than 100 characters' });
    }

    if (!event.type) {
      errors.push({ field: 'type', message: 'Event type is required' });
    } else if (!['Emergency Savings', 'Sabbatical', 'Vacation'].includes(event.type)) {
      errors.push({ field: 'type', message: 'Invalid event type' });
    }

    // Amount validation
    if (typeof event.amount !== 'number') {
      errors.push({ field: 'amount', message: 'Amount must be a number' });
    } else if (event.amount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    }

    // Date validation
    if (!event.date) {
      errors.push({ field: 'date', message: 'Date is required' });
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(event.date)) {
        errors.push({ field: 'date', message: 'Invalid date format (YYYY-MM-DD)' });
      } else {
        const date = new Date(event.date);
        if (isNaN(date.getTime())) {
          errors.push({ field: 'date', message: 'Invalid date' });
        }
      }
    }

    // Progress validation
    if (!event.progress) {
      errors.push({ field: 'progress', message: 'Progress status is required' });
    } else if (!['On Track', 'Off Track'].includes(event.progress)) {
      errors.push({ field: 'progress', message: 'Invalid progress status' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeAccount(account: CashAccount): CashAccount {
    return {
      ...account,
      name: account.name.trim(),
      accountNumber: account.accountNumber.replace(/[- ]/g, ''),
      currentBalance: Math.max(0, Number(account.currentBalance)),
      currentInflows: Math.max(0, Number(account.currentInflows)),
      currentOutflows: Math.max(0, Number(account.currentOutflows)),
      yearEndProjected: Number(account.yearEndProjected),
      owner: {
        name: account.owner.name.trim(),
        avatar: account.owner.avatar?.trim()
      }
    };
  }

  static sanitizeEvent(event: Event): Event {
    return {
      ...event,
      name: event.name.trim(),
      amount: Math.max(0, Number(event.amount)),
      date: event.date.trim()
    };
  }
} 