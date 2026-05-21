const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.eventStatus = req.query.status;
    if (req.query.type) filter.eventType = req.query.type;
    if (req.query.city) filter.city = req.query.city;
    
    if (req.query.search) {
      filter.$or = [
        { eventTitle: { $regex: req.query.search, $options: 'i' } },
        { eventSubtitle: { $regex: req.query.search, $options: 'i' } },
        { venue: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(filter).populate('category', 'categoryName');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'categoryName')
      .populate('reviews.user', 'name avatar');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const data = req.body;
    
    // Handle file uploads
    if (req.files?.banner) data.eventBanner = req.files.banner[0].path;
    if (req.files?.poster) data.eventPoster = req.files.poster[0].path;
    if (req.files?.thumbnail) data.eventThumbnail = req.files.thumbnail[0].path;
    if (req.files?.gallery) data.eventGallery = req.files.gallery.map(f => f.path);
    if (req.files?.organizerLogo) data.organizerLogo = req.files.organizerLogo[0].path;
    
    // Handle complex fields if sent as JSON strings (common with multipart/form-data)
    if (typeof data.speakers === 'string') data.speakers = JSON.parse(data.speakers);
    if (typeof data.sponsors === 'string') data.sponsors = JSON.parse(data.sponsors);
    if (typeof data.schedule === 'string') data.schedule = JSON.parse(data.schedule);
    if (typeof data.FAQs === 'string') data.FAQs = JSON.parse(data.FAQs);
    if (typeof data.eventTags === 'string') data.eventTags = data.eventTags.split(',').map(t => t.trim());

    data.suggestedDonation = data.suggestedDonation || data.ticketPrice; // Backward compatibility
    data.estimatedTravelBudget = data.estimatedTravelBudget || 0;

    data.createdBy = req.user._id;
    const event = await Event.create(data);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const data = req.body;
    
    if (req.files?.banner) data.eventBanner = req.files.banner[0].path;
    if (req.files?.poster) data.eventPoster = req.files.poster[0].path;
    if (req.files?.thumbnail) data.eventThumbnail = req.files.thumbnail[0].path;
    if (req.files?.gallery) data.eventGallery = req.files.gallery.map(f => f.path);
    if (req.files?.organizerLogo) data.organizerLogo = req.files.organizerLogo[0].path;
    
    if (typeof data.speakers === 'string') data.speakers = JSON.parse(data.speakers);
    if (typeof data.sponsors === 'string') data.sponsors = JSON.parse(data.sponsors);
    if (typeof data.schedule === 'string') data.schedule = JSON.parse(data.schedule);
    if (typeof data.FAQs === 'string') data.FAQs = JSON.parse(data.FAQs);

    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    event.reviews.push({ user: req.user._id, rating, comment });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
