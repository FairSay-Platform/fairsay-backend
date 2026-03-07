// const moduleModel = require("../models/moduleModel");

// const createModule = async (req, res) => {
//   try {
//     const { course_id, title, content, module_order } = req.body;

//     const id = await moduleModel.createModule(
//       course_id,
//       title,
//       content,
//       module_order
//     );

//     res.status(201).json({
//       message: "Module created",
//       module_id: id,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { createModule };