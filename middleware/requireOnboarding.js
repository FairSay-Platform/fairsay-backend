// module.exports = (req, res, next) => {
//   const user = req.user;

//   if (!user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   // Admin roles bypass onboarding
//   if (['super_admin', 'admin', 'investigator'].includes(user.role)) {
//     return next();
//   }

//   // Normal user checks
//   if (!user.profile_completed) {
//     return res.status(400).json({ message: "Complete profile before submitting a complaint" });
//   }

//   if (!user.course_completed) {
//     return res.status(400).json({ message: "Complete mandatory courses before submitting a complaint" });
//   }

//   // To Add any other pre-checks here...

//   next();
// };


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