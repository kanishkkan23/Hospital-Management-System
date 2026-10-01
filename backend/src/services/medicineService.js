import db from '../lib/db.js';

export const medicineService = {
  getAll: async (filter = {}) => {
    let list = await db.getMedicines();
    if (filter.category) list = list.filter(m => m.category === filter.category);
    if (filter.status) list = list.filter(m => m.status === filter.status);
    return list;
  },

  getById: async (id) => db.findMedicineById(id),

  create: async (data, currentUser) => {
    let status = 'Available';
    const stock = Number(data.stock !== undefined ? data.stock : (data.availableQuantity || 0));
    const threshold = Number(data.minThreshold || data.minimumStock || 30);

    if (stock <= 0) status = 'Expired';
    else if (stock <= threshold) status = 'Low Stock';

    const med = await db.createMedicine({ ...data, stock, status });
    await db.createActivityLog('Medicine Added', currentUser?.fullName || 'Pharmacist', `Added ${med.name} (${med.stock} ${med.unit || 'Units'})`);
    return med;
  },

  update: async (id, data, currentUser) => {
    const med = await db.findMedicineById(id);
    if (!med) throw new Error('Medicine not found.');

    let status = data.status || med.status;
    const stock = data.stock !== undefined ? Number(data.stock) : Number(med.stock);
    const threshold = data.minThreshold !== undefined ? Number(data.minThreshold) : Number(med.minThreshold || 30);

    if (stock <= 0) status = 'Expired';
    else if (stock <= threshold) status = 'Low Stock';
    else status = 'Available';

    const updated = await db.updateMedicine(id, { ...data, stock, status });
    await db.createActivityLog('Medicine Updated', currentUser?.fullName || 'Staff', `Adjusted ${updated.name} (Stock: ${updated.stock})`);
    return updated;
  },

  updateStock: async (id, quantity, operation = 'add', currentUser) => {
    const med = await db.findMedicineById(id);
    if (!med) throw new Error('Medicine not found.');

    let newStock = Number(med.stock || 0);
    const change = Number(quantity || 0);

    if (operation === 'subtract' || operation === 'dispense') {
      if (newStock < change) throw new Error(`Insufficient stock. Available: ${newStock}, requested: ${change}`);
      newStock -= change;
    } else {
      newStock += change;
    }

    let status = 'Available';
    if (newStock <= 0) status = 'Expired';
    else if (newStock <= (med.minThreshold || 30)) status = 'Low Stock';

    const updated = await db.updateMedicine(id, { stock: newStock, status });
    await db.createActivityLog('Stock Adjusted', currentUser?.fullName || 'Pharmacist', `${med.name} stock changed by ${operation} ${change} -> ${newStock}`);
    return updated;
  },

  getLowStock: async () => {
    const medicines = await db.getMedicines();
    return medicines.filter(m => m.status === 'Low Stock' || m.stock <= (m.minThreshold || 30));
  },

  delete: async (id, currentUser) => {
    const deleted = await db.deleteMedicine(id);
    if (deleted) {
      await db.createActivityLog('Medicine Deleted', currentUser?.fullName || 'Admin', `Removed ${deleted.name}`);
    }
    return deleted;
  }
};
