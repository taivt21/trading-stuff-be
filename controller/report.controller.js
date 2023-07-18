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

    // Lưu báo cáo
    await newReport.save();
    //gửi mail
    // Lấy thông tin người dùng đăng bài
    const { email } = existingReport.user;
    const reportReason = description;
    sendReportEmail(email, postId, reportReason);
    // Kiểm tra số lượng báo cáo cho bài đăng
    const reportCount = await Reports.countDocuments({ post: postId });
    if (reportCount >= 5) {
      // Nếu số lượng báo cáo đạt đến 5, cập nhật trạng thái và ẩn bài đăng
      const post = await Posts.findById(postId);
      if (post) {
        post.status = "hidden";
        await post.save();
      }
    }
    return res.status(201).json({ message: "Report successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Reports.find().populate("user");
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: error });
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
    return res.status(500).json({ message: error });
  }
};
