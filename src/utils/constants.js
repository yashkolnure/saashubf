export const CATEGORIES = [
  'CRM', 'HR & Payroll', 'Accounting & Finance', 'Project Management',
  'Marketing Automation', 'Customer Support', 'Analytics & BI',
  'DevTools & Infrastructure', 'E-commerce', 'Communication',
  'Security & Compliance', 'ERP', 'Healthcare', 'EdTech',
  'LegalTech', 'Supply Chain', 'FinTech', 'Other'
]

export const PRICING_MODELS = [
  { value: 'per_seat', label: 'Per Seat' },
  { value: 'usage_based', label: 'Usage Based' },
  { value: 'flat_rate', label: 'Flat Rate' },
  { value: 'one_time', label: 'One-time' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'custom', label: 'Custom' }
]

export const DEPLOYMENT_OPTIONS = [
  { value: 'cloud', label: 'Cloud' },
  { value: 'on_premise', label: 'On-Premise' },
  { value: 'hybrid', label: 'Hybrid' }
]

export const PLATFORM_OPTIONS = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'api', label: 'API' }
]

export const COMPANY_SIZE_OPTIONS = [
  { value: 'startup', label: 'Startup (1-10)' },
  { value: 'smb', label: 'SMB (11-100)' },
  { value: 'mid_market', label: 'Mid-Market (100-500)' },
  { value: 'enterprise', label: 'Enterprise (500+)' }
]

export const SUPPORT_CHANNELS = ['email', 'chat', 'phone', 'slack', 'community']

export const STATUS_LABELS = {
  draft: { label: 'Draft', color: 'muted' },
  pending_review: { label: 'Under Review', color: 'amber' },
  active: { label: 'Active', color: 'green' },
  paused: { label: 'Paused', color: 'blue' },
  rejected: { label: 'Rejected', color: 'red' },
  expired: { label: 'Expired', color: 'muted' }
}

export const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const timeAgo = (d) => {
  const seconds = Math.floor((Date.now() - new Date(d)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`
  return `${Math.floor(seconds/86400)}d ago`
}

export const truncate = (str, n = 120) => str?.length > n ? str.slice(0, n) + '…' : str

export const BUYER_DISCLAIMER = `This platform facilitates introductions between buyers and sellers only. It does not verify pricing claims, product capabilities, or seller promises. All negotiations, contracts, and payments happen directly between you and the seller. Never make payments based solely on a message on this platform. Report suspicious behavior immediately.`

export const SELLER_DISCLAIMER = `All listings are the sole responsibility of the seller. This platform does not guarantee the quality, support, uptime, or accuracy of any listed product. Misrepresentation or fraudulent listings will result in permanent account termination.`
