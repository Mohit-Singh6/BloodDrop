const DonorProfile = require('../models/DonorProfile');
const { calculateEligibility } = require('../utils/eligibility');

exports.getProfile = async (req, res) => {
  try {
    const profile = await DonorProfile.findOne({ user: req.user._id }).populate('user', 'name email contactNumber city');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Evaluate eligibility whenever profile is fetched (FR-10)
    if (profile.lastDonationDate) {
      profile.isEligible = calculateEligibility(profile.lastDonationDate);
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bloodGroup, healthDeclaration, lastDonationDate, isAvailable } = req.body;
    
    // FR-10: Assess eligibility
    let isEligible = true;
    if (lastDonationDate) {
      isEligible = calculateEligibility(lastDonationDate);
    }
    
    let profile = await DonorProfile.findOne({ user: req.user._id });
    
    if (profile) {
      // Update
      profile.bloodGroup = bloodGroup || profile.bloodGroup;
      profile.healthDeclaration = healthDeclaration !== undefined ? healthDeclaration : profile.healthDeclaration;
      profile.lastDonationDate = lastDonationDate || profile.lastDonationDate;
      profile.isAvailable = isAvailable !== undefined ? isAvailable : profile.isAvailable;
      profile.isEligible = isEligible;
      
      await profile.save();
      res.json(profile);
    } else {
      // Create
      profile = await DonorProfile.create({
        user: req.user._id,
        bloodGroup,
        healthDeclaration,
        lastDonationDate,
        isAvailable,
        isEligible
      });
      res.status(201).json(profile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
