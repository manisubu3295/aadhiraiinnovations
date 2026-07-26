// Small shared helpers for invoice/quotation generation — used by both the admin invoicing
// routes (server/routes/admin.js) and automatic license invoicing (server/licenseFulfillment.js),
// so the numbering scheme and seller/customer shaping never drift between the two.

export async function nextDocumentNumber(model, prefix) {
  const year = new Date().getFullYear()
  const count = await model.count({
    where: { [prefix === 'QUO' ? 'quotationNumber' : 'invoiceNumber']: { startsWith: `${prefix}-${year}-` } },
  })
  return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`
}

export function sellerFromSettings(settings) {
  return {
    businessName: settings.businessName,
    contactPerson: settings.businessContactPerson,
    address: settings.businessAddress,
    phone: settings.businessPhone,
    email: settings.emailFrom,
    gst: settings.businessGst,
    bankName: settings.bankName,
    accountNumber: settings.bankAccountNumber,
    ifsc: settings.bankIfsc,
    upiId: settings.upiId,
  }
}

export function customerFromClient(client) {
  return { name: client.name, company: client.company, address: client.address, phone: client.phone, email: client.email, gst: client.gstNumber }
}
