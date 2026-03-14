// // backend/data/courses.js

// // =========================
// // COURSES
// // =========================
// const courses = [
//   {
//     id: "workplace-harassment",
//     title: "Understanding Workplace Harassment",
//     description:
//       "Learn what constitutes workplace harassment, recognize behaviors, understand your rights under Nigerian law, and know the impact of harassment.",
//     icon: "shield",
//     color: "#DC2626",
//     order: 1,
//   },
//   {
//     id: "discrimination-laws",
//     title: "Discrimination Laws and Protected Classes",
//     description:
//       "Understand workplace discrimination, protected classes under Nigerian law, key federal and state laws, and resources for reporting discrimination.",
//     icon: "balance",
//     color: "#7C3AED",
//     order: 2,
//   },
//   {
//     id: "complaint-procedures",
//     title: "Proper Complaint Filing Procedures",
//     description:
//       "Learn how to prepare a clear and strong complaint, gather important information, and follow safe steps to report workplace issues.",
//     icon: "document",
//     color: "#0F766E",
//     order: 3,
//   },
//   {
//     id: "wage-hour",
//     title: "Wage & Hour Rights",
//     description:
//       "Learn about Nigeria's minimum wage, salary payment rights, working hours, overtime, and unlawful deductions.",
//     icon: "dollar",
//     color: "#1E3A8A",
//     order: 4,
//   },
//   {
//     id: "retaliation-protection",
//     title: "Retaliation Protection",
//     description:
//       "Understand workplace retaliation and legal protections available to workers.",
//     icon: "heart",
//     color: "#059669",
//     order: 5,
//   },
// ];

// // =========================
// // WORKPLACE HARASSMENT
// // =========================
// const workplaceHarassmentLessons = [
//   {
//     id: 1,
//     title: "Introduction to Workplace Harassment",
//     duration: "4 min",
//     heading: "Understanding Workplace Harassment",
//     body: "Understanding workplace harassment helps you know unacceptable workplace behavior.",
//     learnItems: [
//       "Define workplace harassment",
//       "Recognize harassment behaviors",
//       "Understand your rights",
//       "Know the impact of harassment",
//     ],
//     callout: {
//       type: "info",
//       text: "Workplace harassment is often underreported globally.",
//     },
//     sections: [],
//   },
// ];

// const workplaceHarassmentQuiz = [
//   {
//     id: 1,
//     question: "Workplace harassment must always involve physical contact.",
//     options: ["True", "False"],
//     correctIndex: 1,
//   },
// ];

// // =========================
// // DISCRIMINATION LAWS
// // =========================
// const discriminationLawsLessons = [
//   {
//     id: 1,
//     title: "Introduction to Workplace Discrimination",
//     duration: "4 min",
//     heading: "Understanding Workplace Discrimination",
//     body: "Discrimination happens when employees are treated unfairly because of personal characteristics.",
//     learnItems: [
//       "Define workplace discrimination",
//       "Understand protected classes",
//       "Know your rights",
//     ],
//     callout: null,
//     sections: [],
//   },
// ];

// const discriminationLawsQuiz = [
//   {
//     id: 1,
//     question: "Discrimination can occur because of gender or religion.",
//     options: ["True", "False"],
//     correctIndex: 0,
//   },
// ];

// // =========================
// // COMPLAINT PROCEDURES
// // =========================
// const complaintProceduresLessons = [
//   {
//     id: 1,
//     title: "How to File a Complaint",
//     duration: "3 min",
//     heading: "Steps to File a Complaint",
//     body: "Knowing how to file a complaint properly helps ensure your report is taken seriously.",
//     learnItems: [
//       "Prepare your complaint",
//       "Gather evidence",
//       "Submit through official channels",
//     ],
//     callout: null,
//     sections: [],
//   },
// ];

// const complaintProceduresQuiz = [
//   {
//     id: 1,
//     question: "You should include evidence when filing a complaint.",
//     options: ["True", "False"],
//     correctIndex: 0,
//   },
// ];

// // =========================
// // WAGE & HOUR
// // =========================
// const wageHourLessons = [
//   {
//     id: 1,
//     title: "Understanding Wage Rights",
//     duration: "4 min",
//     heading: "Wage and Salary Rights",
//     body: "Workers have legal rights related to salary payment and working hours.",
//     learnItems: [
//       "Know minimum wage laws",
//       "Understand overtime",
//       "Recognize unlawful deductions",
//     ],
//     callout: null,
//     sections: [],
//   },
// ];

// const wageHourQuiz = [
//   {
//     id: 1,
//     question: "Employers can delay salaries indefinitely.",
//     options: ["True", "False"],
//     correctIndex: 1,
//   },
// ];

// // =========================
// // RETALIATION PROTECTION
// // =========================
// const retaliationProtectionLessons = [
//   {
//     id: 1,
//     title: "Understanding Retaliation",
//     duration: "3 min",
//     heading: "Workplace Retaliation",
//     body: "Retaliation happens when an employer punishes a worker for reporting wrongdoing.",
//     learnItems: [
//       "Recognize retaliation",
//       "Understand your legal protection",
//       "Know when to report",
//     ],
//     callout: null,
//     sections: [],
//   },
// ];

// const retaliationProtectionQuiz = [
//   {
//     id: 1,
//     question: "Employers can punish workers for reporting harassment.",
//     options: ["True", "False"],
//     correctIndex: 1,
//   },
// ];

// // =========================
// // EXPORTS
// // =========================
// module.exports = {
//   courses,

//   workplaceHarassmentLessons,
//   workplaceHarassmentQuiz,

//   discriminationLawsLessons,
//   discriminationLawsQuiz,

//   complaintProceduresLessons,
//   complaintProceduresQuiz,

//   wageHourLessons,
//   wageHourQuiz,

//   retaliationProtectionLessons,
//   retaliationProtectionQuiz,
// };