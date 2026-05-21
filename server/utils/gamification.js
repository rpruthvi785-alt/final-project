const User = require('../models/User');

const BADGES = {
  'first-event': { name: 'First Steps', icon: '🌟', threshold: 1, type: 'rsvp' },
  'event-organizer': { name: 'Community Builder', icon: '🏗️', threshold: 1, type: 'create' },
  'social-butterfly': { name: 'Social Butterfly', icon: '🦋', threshold: 10, type: 'rsvp' },
  'star-organizer': { name: 'Star Organizer', icon: '⭐', threshold: 5, type: 'create' },
  'community-legend': { name: 'Community Legend', icon: '👑', threshold: 100, type: 'points' }
};

const updateGamification = async (userId, action) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let pointsToAdd = 0;
    
    switch(action) {
      case 'create_event':
        pointsToAdd = 50;
        break;
      case 'rsvp_event':
        pointsToAdd = 10;
        break;
      case 'join_community':
        pointsToAdd = 20;
        break;
      case 'create_post':
        pointsToAdd = 5;
        break;
      default:
        break;
    }

    user.points = (user.points || 0) + pointsToAdd;

    // Ensure badges array exists
    if (!Array.isArray(user.badges)) user.badges = [];
    const userBadges = user.badges;

    // Example logic for "First Steps"
    if (action === 'rsvp_event' && !userBadges.includes('First Steps')) {
      user.badges.push('First Steps');
    }

    // Example logic for "Community Builder"
    if (action === 'create_event' && !userBadges.includes('Community Builder')) {
      user.badges.push('Community Builder');
    }

    // "Community Legend" at 2000 points
    if (user.points >= 2000 && !userBadges.includes('Community Legend')) {
      user.badges.push('Community Legend');
    }

    await user.save();
    return { points: user.points, badges: user.badges };
  } catch (error) {
    console.error('Gamification error:', error);
  }
};

module.exports = { updateGamification };
