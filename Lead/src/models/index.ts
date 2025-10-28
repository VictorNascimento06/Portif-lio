import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  _id: string;
  phone: string;
  name?: string;
  email?: string;
  company?: string;
  source: 'whatsapp' | 'form' | 'manual';
  status: 'pending' | 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number; // 1-10 lead quality score
  qualificationScore?: number; // AI qualification score
  qualificationReason?: string; // AI qualification reason
  detectedIntent?: string; // AI detected intent
  temperature: 'cold' | 'warm' | 'hot';
  messages: IMessage[];
  lastContact: Date;
  assignedTo?: string;
  notes?: string;
  tags: string[];
  metadata: {
    company?: string;
    position?: string;
    budget?: string;
    timeline?: string;
    pain_points?: string[];
    interests?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  _id: string;
  leadId: string;
  from: string;
  to: string;
  direction: 'inbound' | 'outbound';
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  messageType: 'text' | 'image' | 'document' | 'audio' | 'video';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  statusUpdatedAt?: Date;
  whatsappMessageId?: string;
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    intent: string;
    entities: string[];
    confidence: number;
  };
  isFromBot: boolean;
}

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'sales' | 'manager';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface IAnalytics extends Document {
  _id: string;
  date: Date;
  metrics: {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
    avgResponseTime: number;
    conversionRate: number;
    revenueGenerated: number;
  };
}

// Lead Schema
const leadSchema = new Schema<ILead>({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  company: { type: String },
  source: { type: String, enum: ['whatsapp', 'form', 'manual'], default: 'whatsapp' },
  status: { type: String, enum: ['pending', 'new', 'contacted', 'qualified', 'converted', 'lost'], default: 'pending' },
  score: { type: Number, min: 1, max: 10, default: 5 },
  qualificationScore: { type: Number, min: 1, max: 10 },
  qualificationReason: { type: String },
  detectedIntent: { type: String },
  temperature: { type: String, enum: ['cold', 'warm', 'hot'], default: 'cold' },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  lastContact: { type: Date, default: Date.now },
  assignedTo: { type: String },
  notes: { type: String },
  tags: [{ type: String }],
  metadata: {
    company: { type: String },
    position: { type: String },
    budget: { type: String },
    timeline: { type: String },
    pain_points: [{ type: String }],
    interests: [{ type: String }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Message Schema
const messageSchema = new Schema<IMessage>({
  leadId: { type: String, required: true, index: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'document', 'audio', 'video'], default: 'text' },
  messageType: { type: String, enum: ['text', 'image', 'document', 'audio', 'video'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'] },
  statusUpdatedAt: { type: Date },
  whatsappMessageId: { type: String },
  aiAnalysis: {
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    intent: { type: String },
    entities: [{ type: String }],
    confidence: { type: Number, min: 0, max: 1 }
  },
  isFromBot: { type: Boolean, default: false }
}, {
  timestamps: true
});

// User Schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sales', 'manager'], default: 'sales' },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

// Analytics Schema
const analyticsSchema = new Schema<IAnalytics>({
  date: { type: Date, required: true, unique: true },
  metrics: {
    totalLeads: { type: Number, default: 0 },
    newLeads: { type: Number, default: 0 },
    qualifiedLeads: { type: Number, default: 0 },
    convertedLeads: { type: Number, default: 0 },
    hotLeads: { type: Number, default: 0 },
    warmLeads: { type: Number, default: 0 },
    coldLeads: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better performance
leadSchema.index({ phone: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ temperature: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ score: -1 });

messageSchema.index({ leadId: 1, timestamp: -1 });
messageSchema.index({ timestamp: -1 });

userSchema.index({ email: 1 });
analyticsSchema.index({ date: -1 });

// Export models
export const Lead = mongoose.model<ILead>('Lead', leadSchema);
export const Message = mongoose.model<IMessage>('Message', messageSchema);
export const User = mongoose.model<IUser>('User', userSchema);
export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);