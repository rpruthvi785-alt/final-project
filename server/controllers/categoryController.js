const Category = require('../models/Category');
const Event = require('../models/Event');

exports.getCategories = async (req, res) => {
  try {
    // Aggregation to count events per category
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'category',
          as: 'events'
        }
      },
      {
        $project: {
          categoryName: 1,
          categoryDescription: 1,
          categoryBannerImage: 1,
          categoryThumbnail: 1,
          eventCount: { $size: '$events' }
        }
      }
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;
    const categoryBannerImage = req.files?.banner ? req.files.banner[0].path : '';
    const categoryThumbnail = req.files?.thumbnail ? req.files.thumbnail[0].path : '';
    const category = await Category.create({ 
      categoryName, 
      categoryDescription, 
      categoryBannerImage, 
      categoryThumbnail 
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.files?.banner) data.categoryBannerImage = req.files.banner[0].path;
    if (req.files?.thumbnail) data.categoryThumbnail = req.files.thumbnail[0].path;
    const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
