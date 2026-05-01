import type { WalletTransaction } from "@/lib/types";

export const designerWallet = {
  totalIncome: 286400,
  pendingFrozen: 21600,
  available: 92800,
  withdrawn: 172000,
  feeAccumulated: 22912,
  monthlyTrend: [
    { month: "2025-12", income: 28000, withdraw: 24000 },
    { month: "2026-01", income: 32000, withdraw: 30000 },
    { month: "2026-02", income: 41200, withdraw: 38000 },
    { month: "2026-03", income: 36800, withdraw: 30000 },
    { month: "2026-04", income: 52400, withdraw: 50000 },
    { month: "2026-05", income: 23600, withdraw: 0 },
  ],
};

export const designerTransactions: WalletTransaction[] = [
  {
    id: "tx_1",
    orderCode: "LZ20260428-001",
    type: "income",
    amount: 14400,
    status: "frozen",
    occurredAt: "2026-04-25T18:00:00+08:00",
    note: "中期款到账(冻结期至 2026-05-25)",
  },
  {
    id: "tx_2",
    orderCode: "LZ20260420-002",
    type: "income",
    amount: 11200,
    status: "frozen",
    occurredAt: "2026-04-28T20:00:00+08:00",
    note: "方案确认款到账(冻结期至 2026-05-28)",
  },
  {
    id: "tx_3",
    orderCode: "LZ20260225-005",
    type: "income",
    amount: 7800,
    status: "available",
    occurredAt: "2026-04-10T16:00:00+08:00",
    releasedAt: "2026-04-12T10:00:00+08:00",
    note: "尾款解冻可提现",
  },
  {
    id: "tx_4",
    orderCode: "LZ20260225-005",
    type: "fee",
    amount: -2080,
    status: "available",
    occurredAt: "2026-04-12T10:00:00+08:00",
    note: "平台手续费 8%",
  },
  {
    id: "tx_5",
    type: "withdraw",
    amount: -50000,
    status: "withdrawn",
    occurredAt: "2026-04-15T11:00:00+08:00",
    note: "提现至中国建设银行(尾号 8821)",
  },
  {
    id: "tx_6",
    orderCode: "LZ20260225-005",
    type: "income",
    amount: 10400,
    status: "available",
    occurredAt: "2026-03-20T11:00:00+08:00",
    releasedAt: "2026-04-02T11:00:00+08:00",
    note: "中期款解冻可提现",
  },
  {
    id: "tx_7",
    orderCode: "LZ20260415-003",
    type: "income",
    amount: 5400,
    status: "available",
    occurredAt: "2026-04-15T12:00:00+08:00",
    releasedAt: "2026-04-18T10:00:00+08:00",
    note: "预付款解冻可提现",
  },
];

export const clientWallet = {
  topUpBalance: 12000,
  totalSpent: 102000,
  pendingPayments: 15400,
  refundableEscrow: 25600,
};

export const clientTransactions: WalletTransaction[] = [
  {
    id: "ctx_1",
    orderCode: "LZ20260428-001",
    type: "income",
    amount: -14400,
    status: "available",
    occurredAt: "2026-04-25T18:00:00+08:00",
    note: "中期款支付(资金已托管)",
  },
  {
    id: "ctx_2",
    orderCode: "LZ20260420-002",
    type: "income",
    amount: -11200,
    status: "available",
    occurredAt: "2026-04-28T20:00:00+08:00",
    note: "方案款支付(资金已托管)",
  },
  {
    id: "ctx_3",
    orderCode: "LZ20260420-002",
    type: "income",
    amount: -8400,
    status: "available",
    occurredAt: "2026-04-20T14:30:00+08:00",
    note: "预付款支付",
  },
];
