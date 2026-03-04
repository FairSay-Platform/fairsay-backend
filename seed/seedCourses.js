const db = require("../config/db");

const courseStructure = {
  title: "Fairsay Ethical Communication Training",
  description: "Master respectful and responsible communication.",
  modules: [
    {
      title: "Introduction to Ethical Communication",
      content: "This module introduces ethical speech principles...",
      order: 1,
      is_coming_soon: false,
      quiz: {
        pass_mark: 70,
        questions: [
          {
            question: "What is ethical communication?",
            options: [
              { text: "Speaking without thinking", correct: false },
              { text: "Responsible and respectful communication", correct: true },
              { text: "Manipulating others", correct: false },
              { text: "Ignoring consequences", correct: false }
            ]
          },
          {
            question: "Why is respectful speech important?",
            options: [
              { text: "It builds trust", correct: true },
              { text: "It causes division", correct: false },
              { text: "It spreads misinformation", correct: false },
              { text: "It harms relationships", correct: false }
            ]
          }
        ]
      }
    },
    {
      title: "Advanced Communication Techniques",
      content: "Deep dive into responsible expression strategies...",
      order: 2,
      is_coming_soon: true,
      quiz: null
    }
  ]
};

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // 1️⃣ Insert Course
    const [courseResult] = await db.execute(
      "INSERT INTO courses (title, description) VALUES (?, ?)",
      [courseStructure.title, courseStructure.description]
    );
    const courseId = courseResult.insertId;

    for (const module of courseStructure.modules) {
      // 2️⃣ Insert Module
      const [moduleResult] = await db.execute(
        "INSERT INTO modules (course_id, title, content, module_order, is_coming_soon) VALUES (?, ?, ?, ?, ?)",
        [
          courseId,
          module.title,
          module.content,
          module.order,
          module.is_coming_soon
        ]
      );

      const moduleId = moduleResult.insertId;

      if (module.quiz) {
        // 3️⃣ Insert Quiz
        const [quizResult] = await db.execute(
          "INSERT INTO quizzes (module_id, pass_mark) VALUES (?, ?)",
          [moduleId, module.quiz.pass_mark]
        );

        const quizId = quizResult.insertId;

        for (const q of module.quiz.questions) {
          // 4️⃣ Insert Question
          const [questionResult] = await db.execute(
            "INSERT INTO quiz_questions (quiz_id, question) VALUES (?, ?)",
            [quizId, q.question]
          );

          const questionId = questionResult.insertId;

          // 5️⃣ Insert Options
          for (const option of q.options) {
            await db.execute(
              "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
              [questionId, option.text, option.correct]
            );
          }
        }
      }
    }

    console.log("✅ Seeding completed successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();