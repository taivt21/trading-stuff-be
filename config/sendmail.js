import nodemailer from "nodemailer";
import { URL } from "url";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendReportEmail = (email, postId, reportReason) => {
  const reportURL = new URL(
    `/post/${postId}`,
    "https://trading-stuff-be-iphg.vercel.app/"
  ).href;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Báo cáo bài đăng",
    html: `<p>Bài đăng của bạn đã bị báo cáo với lý do: ${reportReason}.</p>
             <p>Vui lòng kiểm tra bài đăng tại đường dẫn sau:</p>
             <a href="${reportURL}">Xem bài đăng</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Gửi email không thành công:", error);
    } else {
      console.log("Gửi email thành công:", info.response);
    }
  });
};

export const sendExchangeInfoEmail = (email, postId, message) => {
  const postURL = new URL(
    `/post/${postId}`,
    "https://trading-stuff-be-iphg.vercel.app/"
  ).href;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Thông tin trao đổi đồ",
    html: `<p>Bạn nhận được thông tin về trao đổi đồ từ người dùng khác.</p>
             <p>Thông tin chi tiết và liên hệ được gửi tại bài đăng sau:</p>
             <a href="${postURL}">Xem bài đăng</a>
             <p>Tin nhắn: ${message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Gửi email không thành công:", error);
    } else {
      console.log("Gửi email thành công:", info.response);
    }
  });
};
export const sendConfirmationEmail = (email, invoiceId) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Confirmation Email",
    text: `Your invoice (ID: ${invoiceId}) has been approved.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Sending email failed:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

export const sendRejectionEmail = (email, invoiceId) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Rejection Email",
    text: `Your invoice (ID: ${invoiceId}) has been rejected.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Sending email failed:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};
