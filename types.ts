
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentTier?: 'Nexus Basic' | 'Nexus Pro' | 'Nexus Enterprise' | 'Starter Plan' | 'Business Pro' | 'Yearly Pro';
  nextBillingDate?: string;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'PAYMENT' | 'ALERT' | 'SYSTEM' | 'SUCCESS';
  isRead: boolean;
}

export interface Interaction {
  id: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'OTHER';
  title: string;
  description: string;
  timestamp: string;
  direction: 'Inbound' | 'Outbound';
  agent: string;
}

export interface ActivityLog {
  id: string;
  type: 'LOGIN' | 'PAYMENT' | 'PROFILE_CHANGE' | 'SYSTEM';
  status: 'SUCCESS' | 'FAILURE' | 'INFO';
  message: string;
  details?: string;
  timestamp: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;

  status: 'active' | 'pending' | 'paused' | 'cancelled' | 'expired';

  subscriptionId: string;   // usersubs._id
  planId: string;           // subtiers._id
  planName: string;
  price: number;

  paymentMethod?: string;
  autopayEnabled?: boolean;
  avatar?: string;

  history: Interaction[];
  activity: ActivityLog[];
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  status: 'Paid' | 'Overdue' | 'Pending';
  issueDate: string;
  dueDate: string;
  amount: number;
  description: string;
  expiryDate: string;
  paymentMethod: string
}

export interface RevenueData {
  month: string;
  amount: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  features: string[];
}
