import db from '../lib/db.js';

export const profileService = {
  getAllProfiles: async () => db.getProfiles(),
  getProfileById: async (id) => db.findProfileById(id),
  getProfileByUserId: async (userId) => db.findProfileByUserId(userId),
  updateProfile: async (id, data) => db.updateProfile(id, data),
  getStaffUsers: async () => {
    const profiles = await db.getProfiles();
    return profiles.filter(p => p.role !== 'Patient');
  }
};
