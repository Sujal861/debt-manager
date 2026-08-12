export type Payment = { id: string; amount: number; date: string; note?: string }
export type Loan = {
  id: string
  lender: string
  notes: string
  borrowed: number
  total: number
  dueDate: string
  reminder: string
  payoffMode: 'even' | 'fixed'
  period: 'weekly' | 'monthly'
  fixedAmount?: number
  payments: Payment[]
  color: 'blue' | 'orange' | 'violet' | 'red'
}

export const seedLoans: Loan[] = [
  { id: 'klarna', lender: 'Klarna', notes: 'Standing desk', borrowed: 680, total: 720, dueDate: '2026-09-02', reminder: '7 days before', payoffMode: 'even', period: 'monthly', payments: [{ id: 'p1', amount: 240, date: '2026-07-02' }], color: 'blue' },
  { id: 'capital-one', lender: 'Capital One', notes: 'Travel card', borrowed: 2100, total: 2380, dueDate: '2026-10-14', reminder: '14 days before', payoffMode: 'fixed', period: 'monthly', fixedAmount: 290, payments: [{ id: 'p2', amount: 580, date: '2026-07-14' }], color: 'orange' },
  { id: 'affirm', lender: 'Affirm', notes: 'New camera', borrowed: 1240, total: 1320, dueDate: '2027-01-12', reminder: '3 days before', payoffMode: 'even', period: 'monthly', payments: [{ id: 'p3', amount: 330, date: '2026-06-12' }], color: 'violet' },
]

export const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
export const paid = (loan: Loan) => loan.payments.reduce((sum, p) => sum + p.amount, 0)
export const remaining = (loan: Loan) => Math.max(0, loan.total - paid(loan))
export const progress = (loan: Loan) => Math.min(100, Math.round((paid(loan) / loan.total) * 100))
export const daysLeft = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
export function schedule(loan: Loan) {
  const rows: { date: string; amount: number; after: number }[] = []
  let balance = remaining(loan)
  const start = new Date()
  const end = new Date(loan.dueDate)
  const periods = loan.period === 'weekly' ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 604800000)) : Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1)
  const amount = loan.payoffMode === 'fixed' ? (loan.fixedAmount || 0) : balance / periods
  for (let i = 1; i <= periods && balance > 0; i++) {
    const date = new Date(start)
    if (loan.period === 'weekly') date.setDate(date.getDate() + i * 7)
    else date.setMonth(date.getMonth() + i)
    const payment = Math.min(balance, amount)
    balance -= payment
    rows.push({ date: date.toISOString().slice(0, 10), amount: payment, after: balance })
  }
  return rows
}
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date + 'T12:00:00'))
export const formatShortDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date + 'T12:00:00'))
export const uid = () => Math.random().toString(36).slice(2, 10)
