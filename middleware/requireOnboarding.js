

// middleware/requireOnboarding.js
module.exports = (req, res, next) => {
  const { role, profile_completed, employee_verified } = req.user;

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  // Admins bypass onboarding entirely
  if (["super_admin", "admin", "investigator"].includes(role)) {
    return next();
  }

  // Normal user: check onboarding **only for complaint submission**
  if (!profile_completed) {
    return res.status(400).json({ message: "Complete your profile before submitting a complaint" });
  }

  if (!employee_verified) {
    return res.status(400).json({ message: "Complete employee verification before submitting a complaint" });
  }

  next();
};


// // middleware/requireOnboarding.js
// module.exports = (req, res, next) => {
//   const { role } = req.user;

//   if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//   // Admins bypass everything
//   if (["super_admin", "admin", "investigator"].includes(role)) return next();

//   // For complaint/whistleblowing routes, skip profile/verification check
//   if (req.path.startsWith("/complaint") || req.path.startsWith("/whistleblowing")) {
//     return next();
//   }

//   // Optional: enforce profile for other routes
//   if (!req.user.profile_completed) {
//     return res.status(400).json({ message: "Complete your profile first" });
//   }

//   if (!req.user.employee_verified) {
//     return res.status(400).json({ message: "Complete employee verification first" });
//   }

//   next();
// };