import db from '../lib/db.js';

export const billingService = {
  getAll: async (filter = {}) => {
    let list = await db.getBills();
    if (filter.patientId) list = list.filter(b => b.patientId === filter.patientId || b.patientName === filter.patientName);
    if (filter.status) list = list.filter(b => b.status === filter.status);
    return list;
  },

  getById: async (id) => db.findBillById(id),

  create: async (billData, currentUser) => {
    const bill = await db.createBill({
      ...billData,
      generatedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Billing Counter'
    });

    await db.createNotification({
      profileId: bill.patientId,
      targetRole: 'Patient',
      title: 'New Hospital Invoice',
      message: `Invoice ${bill.invoiceCode} for $${bill.totalAmount.toFixed(2)} has been generated.`
    });

    await db.createActivityLog('Invoice Created', currentUser?.fullName || 'Receptionist', `Generated ${bill.invoiceCode} for ${bill.patientName} ($${bill.totalAmount.toFixed(2)})`);
    return bill;
  },

  updateStatus: async (id, status, currentUser, paymentMethod = 'Credit Card') => {
    if (status === 'Paid') {
      return billingService.markPaid(id, paymentMethod, currentUser);
    }
    if (status === 'Cancelled') {
      return billingService.cancel(id, currentUser);
    }
    const updated = await db.updateBill(id, { status });
    return updated;
  },

  markPaid: async (id, paymentMethod = 'Credit Card', currentUser) => {
    const updated = await db.updateBill(id, {
      status: 'Paid',
      paymentMethod,
      paidDate: new Date().toISOString().split('T')[0]
    });

    if (updated) {
      await db.createNotification({
        profileId: updated.patientId,
        targetRole: 'Patient',
        title: 'Payment Received',
        message: `Payment of $${updated.totalAmount.toFixed(2)} for ${updated.invoiceCode} confirmed via ${paymentMethod}.`
      });

      await db.createActivityLog('Bill Paid', currentUser?.fullName || 'Cashier', `Settled ${updated.invoiceCode} via ${paymentMethod}`);
    }
    return updated;
  },

  cancel: async (id, currentUser) => {
    const updated = await db.updateBill(id, { status: 'Cancelled' });
    if (updated) {
      await db.createActivityLog('Bill Cancelled', currentUser?.fullName || 'Staff', `Cancelled ${updated.invoiceCode}`);
    }
    return updated;
  }
};
