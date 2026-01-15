
export enum ViewState {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  ASSOCIATIONS = 'ASSOCIATIONS',
  CREATE_POST = 'CREATE_POST',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CHAT_LIST = 'CHAT_LIST',
  CHAT_DETAIL = 'CHAT_DETAIL',
  NEGOTIATION_LIST = 'NEGOTIATION_LIST',
  NEGOTIATION_ROOM = 'NEGOTIATION_ROOM',
  NEGOTIATION_HUB = 'NEGOTIATION_HUB',
  AI_SUGGEST = 'AI_SUGGEST',
  NEWS_EVENTS = 'NEWS_EVENTS',
  PARTNERS = 'PARTNERS'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'user';
}

export interface Certificate {
  id: string;
  name: string;
  image: string;
  issuer: string;
  year: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface LegalRepresentative {
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface ContactPerson {
  name: string;
  department: string;
  position: string;
  mobile: string;
  fax: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  cover: string;
  industry: string;
  description: string;
  verified: boolean;
  email: string;
  phone: string;
  website: string;
  address: {
    province: string;
    district: string;
    ward: string;
    detail: string;
  };
  foundedYear?: string;
  employeeCount?: string;
  taxId?: string;
  enterpriseType?: string;
  legalRepresentative?: LegalRepresentative;
  
  // Section II
  estimatedRevenue?: string;
  coreProducts?: string;
  relatedDocs?: string[];
  desiredPartners?: string;
  marketDomestic?: string[];
  marketInternational?: string[];
  salesMethod?: string;

  // Section III
  foreignCoopCapacity?: string;
  foreignPartners?: string;

  // Section IV
  contactPerson?: ContactPerson;

  associations: string[];
  trustScore?: number;
  dealsCompleted?: number;
  certificates?: Certificate[];
  team?: TeamMember[];
}

export interface Partner {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  mutualFriends: number;
  status: 'connected' | 'pending' | 'suggestion';
  location?: string;
  size?: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    id: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  type: 'post' | 'news' | 'promotion';
  associationId?: string;
}

export interface AssociationMember {
  id: string;
  name: string;
  logo: string;
  role: 'admin' | 'member';
  status: 'connected' | 'connect';
}

export interface AssociationEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  image?: string;
}

export interface AssociationDocument {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'xls';
  size: string;
  date: string;
}

export interface Association {
  id: string;
  name: string;
  membersCount: number;
  status: 'joined' | 'pending' | 'join';
  icon: string;
  industry: string;
  description?: string;
  cover?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  type: 'text' | 'image' | 'file' | 'offer' | 'system' | 'video_call' | 'contract_signed';
  offerDetails?: {
    price: string;
    status: 'pending' | 'accepted' | 'rejected';
    title?: string;
    paymentTerms?: string;
    warranty?: string;
  };
  fileDetails?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface NegotiationStep {
  id: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

export type DealCategory = 'Active' | 'Waiting' | 'Closed';

export interface NegotiationRoom {
  id: string;
  name: string;
  promotionRef: string;
  shortDescription?: string;
  valueRange?: string; 
  status: 'ongoing' | 'closed' | 'cancelled';
  participants: number;
  lastMessage?: string;
  lastMessageDate?: Date;
  currentStep: number; // 1 to 4
  steps: NegotiationStep[];
  priority?: 'High' | 'Normal' | 'Low';
  deadline?: string;
  finalContract?: boolean;
  partnerName?: string;
  partnerLogo?: string;
  category?: DealCategory;
  isVideoCallActive?: boolean;
  assignee?: string;
  assigneeAvatar?: string;
  result?: 'won' | 'lost';
}

export interface AISuggestion {
  title: string;
  description: string;
  type: 'connection' | 'event' | 'strategy';
}
