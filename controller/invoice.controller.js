import Invoices from "../entities/invoice.js";
import Users from "../entities/user.js";
export const getInvoce = async (req, res) => {
  try {
    const invoice = await Invoices.find({}).populate("user");
    res.status(200).json({
      status: "Success",
      messages: "Get invoice successfully!",
      data: { invoice },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};
export const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const pointId = req.body.point;
    const img = req.body.img;

    const existingInvoice = await Invoices.findOne({
      user: userId,
      point: pointId,
      status: "pending",
    });
    if (existingInvoice) {
      return res.status(400).json({
        status: "Fail",
        messages: "This invoice has already been pointed by the user",
      });
    }

    const invoice = new Invoices({
      user: userId,
      point: pointId,
      img: img,
    });

    await invoice.save();

    res.status(201).json({
      status: "Success",
      messages: "invoice created successfully!",
      data: { invoice },
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};
export const rejectedInvoice = async (req, res) => {
  try {
    const invoice = await Invoices.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "invoice not found" });
    }
    invoice.status = "rejected";
    await invoice.save(); // Lưu lại điểm đã chỉnh sửa
    res.status(200).json({ message: "invoice status updated to rejected" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const approvedInvoice = async (req, res) => {
  try {
    const invoice = await Invoices.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "invoice not found" });
    } else {
      const userId = req.user.id;
      const user = await Users.findOne({ id: userId });
      console.log(user);
      user.point = user.point + invoice.point;
      invoice.status = "approved";

      await user.save();
      await invoice.save();
      res.status(200).json({ message: "invoice status updated to approved" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoices.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "invoice not found" });
    }
    await invoice.remove(); // Remove the point from the database
    res.status(200).json({ message: "invoice deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
