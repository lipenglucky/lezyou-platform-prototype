export type Role = "guest" | "client" | "designer" | "admin";

export type Specialty = "architecture" | "landscape" | "interior";

export type SubSpecialty =
  | "garden_construction"
  | "greening"
  | "drainage"
  | "electrical"
  | "concept"
  | "construction_doc"
  | "model"
  | "soft_decoration";

export type OnlineStatus = "online" | "offline";
export type WorkloadStatus = "free" | "normal" | "busy";
export type ActivityIndicator = "green" | "yellow" | "red";

export type ServiceMode = "online" | "onsite";
export type BillingMode = "daily" | "monthly";

export interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  cover: string;
  year: number;
}

export interface CalendarSlot {
  date: string;
  available: boolean;
}

export interface Designer {
  id: string;
  name: string;
  avatar: string;
  specialty: Specialty;
  subSpecialties: SubSpecialty[];
  yearsOfExperience: number;
  location: string;
  onlineStatus: OnlineStatus;
  workloadStatus: WorkloadStatus;
  activityIndicator: ActivityIndicator;
  lastActiveAt: string;
  isOpenToTravel: boolean;
  supportsHandDrawing: boolean;
  isInJob: boolean;
  serviceModes: ServiceMode[];
  meetingFlexibility: string;
  tagline: string;
  bio: string;
  expertiseTags: string[];
  projectTypeTags: string[];
  dailyRate: number;
  monthlyRate: number;
  rating: number;
  completedProjects: number;
  reviewCount: number;
  portfolio: PortfolioItem[];
  calendar: CalendarSlot[];
}

export interface Client {
  id: string;
  name: string;
  avatar: string;
  type: "individual" | "enterprise";
  verified: boolean;
  companyName?: string;
  joinedAt: string;
}

export type OrderStatus =
  | "matching"
  | "pending_contract"
  | "in_progress"
  | "pending_review"
  | "in_revision"
  | "completed"
  | "terminated";

export interface PaymentStage {
  id: string;
  name: string;
  amount: number;
  ratio: number;
  status: "pending" | "paid" | "frozen" | "released";
  paidAt?: string;
  releasedAt?: string;
  deliverables?: DeliverableFile[];
}

export interface DeliverableFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  thumbnail?: string;
  locked: boolean;
}

export interface RevisionRequest {
  id: string;
  stageId: string;
  description: string;
  attachments: { name: string }[];
  createdAt: string;
  status: "pending" | "responded";
}

export interface OrderMessage {
  id: string;
  authorId: string;
  authorRole: "client" | "designer" | "system";
  content: string;
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  title: string;
  specialty: Specialty;
  subSpecialty?: SubSpecialty;
  projectType: string;
  designerId: string;
  clientId: string;
  status: OrderStatus;
  serviceMode: ServiceMode;
  billingMode: BillingMode;
  totalAmount: number;
  feeRate: number;
  createdAt: string;
  expectedDeliveryAt: string;
  contractId: string;
  stages: PaymentStage[];
  revisions: RevisionRequest[];
  messages: OrderMessage[];
  description: string;
  onsiteSchedule?: { from: string; to: string; address: string };
}

export interface BountyApplicant {
  designerId: string;
  proposal: string;
  quotedAmount: number;
  estimatedDays: number;
  appliedAt: string;
}

export interface Bounty {
  id: string;
  code: string;
  title: string;
  specialty: Specialty;
  description: string;
  reward: number;
  rewardModel: "fixed" | "negotiable";
  deadline: string;
  publishedAt: string;
  publisherId: string;
  status: "open" | "in_review" | "awarded" | "closed";
  attachments: { name: string }[];
  requirements: string[];
  applicants: BountyApplicant[];
}

export interface WalletTransaction {
  id: string;
  orderCode?: string;
  type: "income" | "withdraw" | "fee" | "refund";
  amount: number;
  status: "frozen" | "available" | "withdrawn";
  occurredAt: string;
  releasedAt?: string;
  note: string;
}

export interface ReviewItem {
  id: string;
  type: "designer" | "enterprise";
  name: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  payload: Record<string, string>;
}
