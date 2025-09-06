// import React, { useState, useEffect, useContext } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import { UserContext } from "../Context/UserContext";

// export default function ProgressTracking() {
//   const { user } = useContext(UserContext);

//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Simulate fetching progress (replace with DB/API later)
//   useEffect(() => {
//     if (!user) return;

//     setLoading(true);
//     setError("");

//     try {
//       // Dummy values for demo
//       const fetchedProgress = {
//         goals: { completed: 3, total: 5 },
//         streak: { days: 3 },
//         time: { hours: 12 },
//       };
//       setProgress(fetchedProgress);
//     } catch {
//       setError("Failed to load progress.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   const getPercent = (completed, total) =>
//     total > 0 ? Math.round((completed / total) * 100) : 0;

//   if (loading)
//     return( 
//     <div className="flex justify-center items-center mt-6">
//       <span
//         className="h-5 w-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mr-2"
//         aria-label="Loading progress"
//       ></span>
//       <p className="text-gray-500">Loading progress...</p>
//     </div>
//     );

//   if (error)
//     return <p className="text-center text-red-500 mt-6">{error}</p>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
//         📊 Learning Progress
//       </h2>

//       {/* Daily / Weekly Goals */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.2 }}
//         className="mb-6"
//       >
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Daily/Weekly Goals</span>
//           <span className="text-sm text-gray-500">
//             {progress.goals.completed}/{progress.goals.total} (
//             {getPercent(progress.goals.completed, progress.goals.total)}%)
//           </span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{
//               width: `${getPercent(progress.goals.completed, progress.goals.total)}%`,
//             }}
//             transition={{ duration: 1 }}
//             className="h-4 bg-gradient-to-r from-pink-400 to-pink-500"
//             role="progressbar"
//             aria-valuenow={getPercent(progress.goals.completed, progress.goals.total)}
//             aria-valuemin={0}
//            aria-valuemax={100}
//            aria-label="Daily and weekly goals progress"
//           />
//         </div>
//       </motion.div>

//       {/* Study Streak */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.4 }}
//         className="mb-6"
//       >
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Study Streak</span>
//           <span className="text-sm text-gray-500">
//             ✅ {progress.streak.days} days in a row
//           </span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{
//               width: `${Math.min(progress.streak.days * 20, 100)}%`,
//             }}
//             transition={{ duration: 1 }}
//             className="h-4 bg-gradient-to-r from-green-400 to-green-600"
//             role="progressbar"
//             aria-valuenow={Math.min(progress.streak.days * 20, 100)}
//              aria-valuemin={0}
//             aria-valuemax={100}
//             aria-label="Study streak progress"
//           />
//         </div>
//       </motion.div>

//       {/* Time Spent */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.6 }}
//       >
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Time Spent</span>
//           <span className="text-sm text-gray-500">⏳ {progress.time.hours} hrs</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{
//               width: `${Math.min((progress.time.hours / 20) * 100, 100)}%`,
//             }}
//             transition={{ duration: 1 }}
//             className="h-4 bg-gradient-to-r from-blue-400 to-blue-600"
//             role="progressbar"
//             aria-valuenow={Math.min((progress.time.hours / 20) * 100, 100)}
//             aria-valuemin={0}
//             aria-valuemax={100}
//             aria-label="Time spent learning progress"
//           />
//         </div>
//       </motion.div>

//       {/* Set Goal Button */}
//       <div className="text-center mt-8">
//         <button className="px-6 py-2 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-400">
//           🎯 Set My Goal
//         </button>
//         <p className="text-xs text-gray-500 mt-2">(coming soon...)</p>
//       </div>
//     </div>
//   );
// }
