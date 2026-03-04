// const courseModel = require("../models/courseModel");

// const createCourse = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const created_by = req.user.id;

//     const id = await courseModel.createCourse(
//       title,
//       description,
//       created_by
//     );

//     res.status(201).json({
//       message: "Course created successfully",
//       course_id: id,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getAllCourses = async (req, res) => {
//   try {
//     const courses = await courseModel.getAllCourses();
//     res.json(courses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getCourse = async (req, res) => {
//   try {
//     const course = await courseModel.getCourseById(req.params.id);

//     if (!course)
//       return res.status(404).json({ message: "Course not found" });

//     res.json(course);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // const updateCourse = async (req, res) => {
// //   try {
// //     const { title, description } = req.body;

// //     await courseModel.updateCourse(
// //       req.params.id,
// //       title,
// //       description
// //     );

// //     res.json({ message: "Course updated" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // const deleteCourse = async (req, res) => {
// //   try {
// //     await courseModel.deleteCourse(req.params.id);
// //     res.json({ message: "Course deleted" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// module.exports = {
//   createCourse,
//   getAllCourses,
//   getCourse,
// //   updateCourse,
// //   deleteCourse,
// };



const courseModel = require("../models/courseModel");

const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCourses };
