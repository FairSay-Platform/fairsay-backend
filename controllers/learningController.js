// const db = require("../config/db");

// exports.getCourses = async (req, res) => {
//   try {
//     const [courses] = await db.query("SELECT * FROM courses ORDER BY course_order");

//     res.json({
//       success: true,
//       data: courses
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const learningModel = require("../models/learningModel");


// GET COURSES
exports.getCourses = async (req, res) => {
  try {

    const courses = await learningModel.getCourses();

    res.json({
      success: true,
      data: courses
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET MODULES BY COURSE
exports.getModulesByCourse = async (req, res) => {
  try {

    const { slug } = req.params;

    const modules = await learningModel.getModulesByCourse(slug);

    res.json({
      success: true,
      data: modules
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getModuleContent = async (req, res) => {
  try {

    const { id } = req.params;

    const module = await learningModel.getModuleContent(id);

    res.json({
      success: true,
      data: module
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
};


// // GET MODULE CONTENT
// exports.getModuleContent = async (req, res) => {
//   try {

//     const moduleId = req.params.id;

//     const module = await learningModel.getModuleContent(moduleId);

//     res.json({
//       success: true,
//       data: module
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// GET QUIZ
exports.getQuiz = async (req, res) => {
  try {

    const moduleId = req.params.id;

    const quiz = await learningModel.getQuiz(moduleId);

    res.json({
      success: true,
      data: quiz
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// SUBMIT QUIZ
exports.submitQuiz = async (req, res) => {
  try {

    const quizId = req.params.id;
    const { userId, answers } = req.body;

    const result = await learningModel.submitQuiz(quizId, userId, answers);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// // COMPLETE MODULE
// exports.completeModule = async (req, res) => {
//   try {

//     const moduleId = req.params.id;
//     const { userId } = req.body;

//     await learningModel.completeModule(moduleId, userId);

//     res.json({
//       success: true,
//       message: "Module completed"
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.completeModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    // Check if module exists first
    const module = await learningModel.getModuleContent(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found"
      });
    }

    await learningModel.completeModule(user_id, id);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};