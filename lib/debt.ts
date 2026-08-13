export type Payment = { id: string; amount: number; date: string; note?: string }
export type Loan = {
  id: string; lender: string; notes: string; type?: string; borrowed: number; total: number; dueDate: string; reminder: string
  payoffMode: 'even' | 'fixed'; period: 'weekly' | 'monthly'; fixedAmount?: number; interestRate?: number; startDate?: string; firstPaymentDate?: string; tenureMonths?: number; payments: Payment[]; color: 'blue' | 'orange' | 'violet' | 'red'
}
export type ScheduleRow = { date: string; amount: number; principal: number; interest: number; after: number; status: 'Upcoming' | 'Paid' | 'Overdue' }
export const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, n || 0))
export const paid = (loan: Loan) => loan.payments.reduce((sum, p) => sum + p.amount, 0)
export const remaining = (loan: Loan) => Math.max(0, loan.total - paid(loan))
export const progress = (loan: Loan) => loan.total ? Math.min(100, Math.round(paid(loan) / loan.total * 100)) : 0
export const daysLeft = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
export const monthlyPayment = (loan: Loan) => loan.fixedAmount || (loan.tenureMonths ? loan.total / loan.tenureMonths : remaining(loan))
export const paymentsLeft = (loan: Loan) => { const amount = monthlyPayment(loan); return amount > 0 ? Math.ceil(remaining(loan) / amount) : 0 }
export function schedule(loan: Loan): ScheduleRow[] {
  const rows: ScheduleRow[] = []; let balance = remaining(loan); const rate = (loan.interestRate || 0) / 100 / 12
  const start = new Date(loan.firstPaymentDate || loan.startDate || new Date().toISOString().slice(0, 10)); const count = loan.tenureMonths || Math.max(1, Math.ceil(balance / Math.max(1, monthlyPayment(loan))))
  for (let i = 0; i < count && balance > 0; i++) { const date = new Date(start); if (loan.period === 'weekly') date.setDate(date.getDate() + i * 7); else date.setMonth(date.getMonth() + i); const interest = Math.min(balance, balance * rate); const amount = Math.min(balance + interest, loan.fixedAmount || (rate ? balance * rate / (1 - Math.pow(1 + rate, -Math.max(1, count - i))) : balance / Math.max(1, count - i))); const principal = Math.min(balance, amount - interest); balance = Math.max(0, balance - principal); const isPaid = loan.payments.some(p => p.date.slice(0, 7) === date.toISOString().slice(0, 7)); rows.push({ date: date.toISOString().slice(0, 10), amount, principal, interest, after: balance, status: isPaid ? 'Paid' : daysLeft(date.toISOString().slice(0, 10)) < 0 ? 'Overdue' : 'Upcoming' }) }
  return rows
}
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date + 'T12:00:00'))
export const formatShortDate = (date: string) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(date + 'T12:00:00'))
export const uid = () => Math.random().toString(36).slice(2, 10)
export const demoLoans: Loan[] = [
 { id:'sbi', lender:'SBI Personal Loan', notes:'Personal loan', type:'Personal Loan', borrowed:300000, total:300000, dueDate:'2028-12-18', reminder:'7 days before', payoffMode:'fixed', period:'monthly', fixedAmount:8500, interestRate:14.5, startDate:'2026-01-18', firstPaymentDate:'2026-01-18', tenureMonths:36, payments:[], color:'blue' },
 { id:'hdfc', lender:'HDFC Credit Card', notes:'Credit card', type:'Credit Card', borrowed:68500, total:68500, dueDate:'2028-02-05', reminder:'3 days before', payoffMode:'fixed', period:'monthly', fixedAmount:4500, interestRate:36, startDate:'2026-02-05', firstPaymentDate:'2026-02-05', tenureMonths:24, payments:[], color:'orange' },
 { id:'icici', lender:'ICICI Car Loan', notes:'Car loan', type:'Car Loan', borrowed:420000, total:420000, dueDate:'2030-01-20', reminder:'7 days before', payoffMode:'fixed', period:'monthly', fixedAmount:11500, interestRate:9.2, startDate:'2026-01-20', firstPaymentDate:'2026-01-20', tenureMonths:48, payments:[], color:'violet' }
]
