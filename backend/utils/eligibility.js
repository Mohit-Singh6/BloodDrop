/**
 * @param {Date} lastDonationDate - The date the donor last donated blood.
 * @returns {Boolean} - true if eligible, false otherwise.
 */
const calculateEligibility = (lastDonationDate) => {
  if (!lastDonationDate) return true;

  const MINIMUM_GAP_DAYS = 90;
  
  const currentDate = new Date();
  const donationDate = new Date(lastDonationDate);
  
  const diffTime = Math.abs(currentDate - donationDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays >= MINIMUM_GAP_DAYS;
};

module.exports = { calculateEligibility };
