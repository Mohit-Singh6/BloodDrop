const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');

const COMPATIBILITY_MAP = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

const findMatches = async (request) => {
  const { bloodGroup, city, state } = request;
  
  // Find compatible blood groups
  const compatibleGroups = COMPATIBILITY_MAP[bloodGroup] || [];

  const donorProfiles = await DonorProfile.find({
    bloodGroup: { $in: compatibleGroups },
    isAvailable: true,
    isEligible: true
  }).populate('user');

  const matches = donorProfiles
    .filter(profile => {
      if (!profile.user) return false;
      const cityMatch = profile.user.city?.toLowerCase() === city?.toLowerCase();
      const stateMatch = !state || !profile.user.state || profile.user.state?.toLowerCase() === state?.toLowerCase();
      return cityMatch && stateMatch;
    })
    .map(profile => ({
      donor: profile.user._id,
      donorProfile: profile._id,
      lastDonationDate: profile.lastDonationDate || new Date(0)
    }));

  matches.sort((a, b) => a.lastDonationDate - b.lastDonationDate);

  return matches.map(match => ({
    donor: match.donor,
    donorProfile: match.donorProfile,
    status: 'Notified',
    notifiedAt: new Date()
  }));
};

module.exports = { findMatches };
