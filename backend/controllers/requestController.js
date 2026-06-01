const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const { findMatches } = require('../utils/matching');
const { sendNotificationEmail, sendAcceptanceEmail } = require('../utils/notification');

exports.createRequest = async (req, res) => {
  try {
    const { bloodGroup, unitsRequired, city, state, urgencyLevel } = req.body;

    if (!bloodGroup || !unitsRequired || !city || !state || !urgencyLevel) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create the blood request
    const request = new BloodRequest({
      requester: req.user._id,
      bloodGroup,
      unitsRequired,
      city,
      state,
      urgencyLevel
    });

    // Run the matching engine automatically (FR-22)
    const matchedDonors = await findMatches(request);
    request.matchedDonors = matchedDonors;

    await request.save();

    const populatedRequest = await request.populate('matchedDonors.donor');
    for (const match of populatedRequest.matchedDonors) {
      if (match.donor) {
        sendNotificationEmail(match.donor, request);
      }
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    if (req.user.role === 'requester') {
      // Requesters see all requests they created
      const requests = await BloodRequest.find({ requester: req.user._id })
        .populate('matchedDonors.donor', 'name email contactNumber role')
        .populate('matchedDonors.donorProfile', 'bloodGroup isEligible isAvailable');
      return res.json(requests);
    } else if (req.user.role === 'donor') {
      // Donors see all requests they are matched to
      const requests = await BloodRequest.find({
        'matchedDonors.donor': req.user._id
      })
      .populate('requester', 'name email contactNumber city role') // Populate requester info
      .select('-matchedDonors'); // Keep privacy until accepted

      const fullRequests = await BloodRequest.find({
        'matchedDonors.donor': req.user._id
      }).populate('requester', 'name email contactNumber city role');

      const formattedRequests = fullRequests.map(reqObj => {
        const matchEntry = reqObj.matchedDonors.find(m => m.donor.toString() === req.user._id.toString());
        
        // Convert to plain object to edit
        const plainReqObj = reqObj.toObject();
        
        const hasConsented = matchEntry.status === 'Accepted';

        if (!hasConsented) {
          // Strip contact number from requester
          if (plainReqObj.requester) {
            delete plainReqObj.requester.contactNumber;
            delete plainReqObj.requester.email;
          }
        }

        return {
          ...plainReqObj,
          myStatus: matchEntry ? matchEntry.status : 'Notified',
          // Show contact details if and only if donor accepted
          showContactDetails: hasConsented,
          matchedDonors: undefined // Do not share other donors' list
        };
      });

      return res.json(formattedRequests);
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Ignored'
    if (!['Accepted', 'Ignored'].includes(status)) {
      return res.status(400).json({ message: 'Invalid response status' });
    }

    const request = await BloodRequest.findOne({
      _id: req.params.id,
      'matchedDonors.donor': req.user._id
    }).populate('requester');

    if (!request) {
      return res.status(404).json({ message: 'Request invitation not found' });
    }

    // Find the specific donor match entry and update it
    const matchIndex = request.matchedDonors.findIndex(m => m.donor.toString() === req.user._id.toString());
    request.matchedDonors[matchIndex].status = status;
    request.matchedDonors[matchIndex].respondedAt = new Date();

    // If accepted, update the request status to 'Accepted'
    if (status === 'Accepted' && request.status === 'Created') {
      request.status = 'Accepted';
    }

    await request.save();

    // Send email to requester notifying them that this donor accepted
    if (status === 'Accepted') {
      sendAcceptanceEmail(request.requester, req.user, request);
    }

    res.json({ message: `Successfully responded with ${status}`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fulfillRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      requester: req.user._id
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'Completed';
    await request.save();

    res.json({ message: 'Request marked as completed (fulfilled)', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
