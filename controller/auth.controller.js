import jwt from "jsonwebtoken";
import User from "../entities/user.js";

const adminEmails = [
  "taivtse151030@fpt.edu.vn",
  // "vinhthse151179@fpt.edu.vn",
  "thinhddse151086@fpt.edu.vn",
];

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const login = async (req, res) => {
  try {
    if (!req.body.accessToken) {
      res.status(400).json({
        status: "Fail",
        messages: "Access token is required!",
      });
      return;
    }

    const googlePayload = jwt.decode(req.body.accessToken);

    if (!googlePayload || !googlePayload.email) {
      res.status(400).json({
        status: "Fail",
        messages: "Invalid access token!",
      });
      return;
    }

    const userLogin = await User.findOne({
      email: googlePayload.email,
      status: true,
    });

    if (userLogin) {
      const payload = {
        id: userLogin.id,
        fullname: userLogin.fullname,
        email: userLogin.email,
        phoneNumber: userLogin.phoneNumber,
        img: userLogin.img,
        status: userLogin.status,
        roleName: userLogin.roleName,
      };

      const accessToken = createAccessToken(payload);

      res.status(200).json({
        status: "Success",
        messages: "Login successfully!",
        data: {
          user: payload,
          accessToken,
        },
      });
    } else {
      const domain = googlePayload.email.substring(
        googlePayload.email.lastIndexOf("@") + 1
      );

      if (domain === "fpt.edu.vn") {
        const roleName = adminEmails.includes(googlePayload.email)
          ? "admin"
          : "user";

        const newUser = {
          fullname: googlePayload.name || "",
          email: googlePayload.email,
          img: googlePayload.picture,
          phoneNumber: googlePayload.phoneNumber || "",
          roleName: roleName,
          status: true,
          point: 100,
        };

        const createdUser = await User.create(newUser);

        const payload = {
          id: createdUser.id,
          fullname: createdUser.fullname,
          email: createdUser.email,
          phoneNumber: createdUser.phoneNumber,
          img: createdUser.img,
          status: createdUser.status,
          roleName: createdUser.roleName,
        };

        const accessToken = createAccessToken(payload);

        res.status(200).json({
          status: "Success",
          messages: "Login successfully!",
          data: {
            user: payload,
            accessToken,
          },
        });
      } else {
        res.status(400).json({
          status: "Fail",
          messages:
            "Your email domain is not supported. Please contact your administrator to support your account!",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      messages: err.message,
    });
  }
};

export { login };
