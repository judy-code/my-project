export function getContactEmail(contactData) {
  if (!contactData.emailAccount) return ''
  const domain = contactData.emailDomain === 'custom' ? contactData.emailCustomDomain : contactData.emailDomain
  return `${contactData.emailAccount}@${domain}`
}

export function getContactDisplay(contactData) {
  const parts = []
  if (contactData.lastName || contactData.firstName) {
    parts.push(`${contactData.lastName}${contactData.firstName}`.trim())
  }
  if (contactData.phone) parts.push(`${contactData.areaCode} ${contactData.phone}`)
  const email = getContactEmail(contactData)
  if (email) parts.push(email)
  return parts
}
