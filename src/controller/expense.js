const Expense = require("../model/expense");


// add expense
exports.add = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    // business logic
    if (!title || !amount || !category) {
      return res.status(400).json({ msg: "fill the all fields correctly" });
    }

    if (title.length < 3) {
      return res.status(400).json({ msg: "title is too short maximum length is 3" });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "amount must be greater than 0" });
    }

   
    const allowed = ["Food", "Travel", "Shopping", "Other"];
    if (!allowed.includes(category)) {
      return res.status(400).json({ msg: "invalid category" });
    }

    // today start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // tomorrow start
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // check duplicate
    const existing = await Expense.findOne({
      title: new RegExp(`^${title}$`, "i"),
      amount: amount,
      category: new RegExp(`^${category}$`, "i"),
      date: { $gte: today, $lt: tomorrow }
    });

    if (existing) {
      return res.status(400).json({ msg: "duplicate expense added" });
    }

    // per day 10
    const count = await Expense.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    if (count >= 10) {
      return res.status(400).json({ msg: "only 10 allowed per day" });
    }

    // save
    const newItem = new Expense({
      title,
      amount,
      category
    });

    await newItem.save();

    res.status(201).json(newItem);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error adding expense" });
  }
};



// get all 
exports.getAll = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = page || 1;
    limit = limit || 5;

    const list = await Expense.find()
      .sort({ date: -1 })   // latest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(list);

  } catch {
    res.status(500).json({ msg: "error fetching data" });
  }
};



// get one
exports.getOne = async (req, res) => {
  try {
    const item = await Expense.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: "not found" });
    }

    res.json(item);

  } catch {
    res.status(400).json({ msg: "invalid id" });
  }
};



// update 
exports.update = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "not found" });
    }

    res.json(updated);

  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "update failed" });
  }
};



// delete 
exports.remove = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "not found" });
    }

    res.json({ msg: "deleted successfully" });

  } catch {
    res.status(400).json({ msg: "delete error" });
  }
};



// total amount
exports.total = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      total: result[0]?.total || 0
    });

  } catch {
    res.status(500).json({ msg: "error calculating total" });
  }
};