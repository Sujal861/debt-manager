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

export const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
export const paid = (loan: Loan) => loan.payments.reduce((sum, p) => sum + p.amount, 0)
export const remaining = (loan: Loan) => Math.max(0, loan.total - paid(loan))
export const progress = (loan: Loan) => Math.min(100, Math.round((paid(loan) / loan.total) * 100))
export const daysLeft = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
export const paymentsLeft = (loan: Loan) => {
  const outstanding = remaining(loan)
  const monthlyPayment = loan.fixedAmount || (loan.payments.length ? loan.payments[loan.payments.length - 1].amount : 0)
  return monthlyPayment > 0 ? Math.ceil(outstanding / monthlyPayment) : null
}
export function schedule(loan: Loan) {
  const rows: { date: string; amount: number; after: number }[] = []
  let balance = remaining(loan)
  if (balance <= 0) return rows
  const enteredDate = new Date(`${loan.dueDate}T12:00:00`)
  const lastPayment = loan.payments.slice().sort((a, b) => b.date.localeCompare(a.date))[0]
  const firstDate = lastPayment ? new Date(`${lastPayment.date}T12:00:00`) : enteredDate
  const periods = loan.payoffMode === 'fixed' && loan.fixedAmount ? Math.max(1, Math.ceil(balance / loan.fixedAmount)) : 12
  const amount = loan.payoffMode === 'fixed' ? (loan.fixedAmount || 0) : balance / periods
  for (let i = 0; i < periods && balance > 0; i++) {
    const date = new Date(firstDate)
    if (lastPayment || i > 0) {
      if (loan.period === 'weekly') date.setDate(date.getDate() + (i + 1) * 7)
      else date.setMonth(date.getMonth() + (i + 1))
    }
    const payment = Math.min(balance, amount)
    balance -= payment
    rows.push({ date: date.toISOString().slice(0, 10), amount: payment, after: balance })
  }
  return rows
}
export const nextPayment = (loan: Loan) => schedule(loan)[0] || null
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date + 'T12:00:00'))
export const formatShortDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date + 'T12:00:00'))
export const uid = () => Math.random().toString(36).slice(2, 10)
