import { prisma } from './prismaClient.js'

const SINGLETON_ID = 'singleton'

// Merges the DB-configured settings (editable from the admin Settings page) over env-var
// defaults, so existing deployments keep working until an admin explicitly overrides them.
export async function getSettings() {
  const row = await prisma.setting.findUnique({ where: { id: SINGLETON_ID } })
  const smtpPort = row?.smtpPort ?? (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null)
  return {
    smtpHost: row?.smtpHost || process.env.SMTP_HOST || '',
    smtpPort,
    smtpSecure: row?.smtpSecure ?? smtpPort === 465,
    smtpUser: row?.smtpUser || process.env.SMTP_USER || '',
    smtpPass: row?.smtpPass || process.env.SMTP_PASS || '',
    emailFrom: row?.emailFrom || process.env.EMAIL_FROM || row?.smtpUser || process.env.SMTP_USER || '',
    ticketNotifyEmail: row?.ticketNotifyEmail || process.env.TICKET_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL || '',
    enquiryNotifyEmail: row?.enquiryNotifyEmail || process.env.ENQUIRY_TO_EMAIL || '',
    enquiryReplyTo: row?.enquiryReplyTo || process.env.ENQUIRY_REPLY_TO || '',

    businessName: row?.businessName || 'Aadhirai Innovations',
    businessContactPerson: row?.businessContactPerson || '',
    businessAddress: row?.businessAddress || '',
    businessPhone: row?.businessPhone || '',
    businessGst: row?.businessGst || '',
    bankName: row?.bankName || '',
    bankAccountNumber: row?.bankAccountNumber || '',
    bankIfsc: row?.bankIfsc || '',
    upiId: row?.upiId || '',
    logoUrl: row?.logoUrl || '',

    whatsappEnabled: row?.whatsappEnabled ?? (process.env.WHATSAPP_ENABLED === 'true'),
    whatsappPhoneNumberId: row?.whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    whatsappAccessToken: row?.whatsappAccessToken || process.env.WHATSAPP_ACCESS_TOKEN || '',
    whatsappBusinessAccountId: row?.whatsappBusinessAccountId || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    whatsappApiVersion: row?.whatsappApiVersion || process.env.WHATSAPP_API_VERSION || 'v21.0',
    whatsappStaffNotifyNumber: row?.whatsappStaffNotifyNumber || process.env.WHATSAPP_STAFF_NOTIFY_NUMBER || '',

    adminMenuKeys: row?.adminMenuKeys || [],
    staffMenuKeys: row?.staffMenuKeys || [],

    licenseDownloadUrl: row?.licenseDownloadUrl || '',
    licenseInstallGuideUrl: row?.licenseInstallGuideUrl || '',
    licensePlan3MoPrice: row?.licensePlan3MoPrice ?? null,
    licensePlan6MoPrice: row?.licensePlan6MoPrice ?? null,
    licensePlan1YrPrice: row?.licensePlan1YrPrice ?? null,
  }
}

export async function updateSettings(data) {
  return prisma.setting.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...data },
    update: data,
  })
}
