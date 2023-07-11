function isAdmin(req, res, next) {
  const { roleName } = req.user;

  if (roleName !== "admin") {
    return res.status(403).json({
      msg: "You dont have permission to access",
    });
  }

  next();
}
export { isAdmin };
