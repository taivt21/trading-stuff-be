import Reports from "../entities/report.js";
import { sendReportEmail } from "../config/sendmail.js";
import Posts from "../entities/post.js";

// Create a report
export const createReport = async (req, res) => {
  try {
    const { postId, description } = req.body;
    const userId = req.user.id;

    // Kiểm tra xem người dùng đã báo cáo bài đăng này trước đó chưa
    const existingReport = await Reports.findOne({
      post: postId,
      user: userId,
    }).populate("user");
    if (existingReport) {
      return res.status(400).json({ message: "You already report this post" });
    }

    // Tạo báo cáo mới
    const newReport = new Reports({
      description,
      user: userId,
      post: postId,
    });
    console.log(newReport);
    // Lưu báo cáo
    await newReport.save();
    //gửi mail
    const user = await newReport.populate("user");
    const { email } = user.user;
    console.log(email);
    const reportReason = description;
    sendReportEmail(email, postId, reportReason);
    // Kiểm tra số lượng báo cáo cho bài đăng
    const reportCount = await Reports.countDocuments({ post: postId });
    if (reportCount >= 2) {
      // Nếu số lượng báo cáo đạt đến 2, cập nhật trạng thái và ẩn bài đăng
      const post = await Posts.findById(postId);
      if (post) {
        post.status = "limited";
        await post.save();
      }
    }
    return res.status(201).json({ message: "Report successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Reports.find().populate("user post");
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Xóa báo cáo
    await Reports.findByIdAndDelete(reportId);

    return res.status(200).json({ message: "Delete successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
