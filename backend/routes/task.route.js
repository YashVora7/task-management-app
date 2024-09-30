const { Router } = require("express");
const {
  createTask,
  deleteTask,
  adminGetAllTasks,
  getTask,
  updateTask,
  addComment,
  exportTasksToCSV,
  importTasksFromCSV,
} = require("../controllers/task.controller");
const { auth, admin } = require("../middleware/user.middleware");
const upload = require("../middleware/upload.middleware");

const taskRouter = (io) => {
  const router = Router();

  router.get("/", auth, getTask);
  router.post("/create", auth, (req, res) => createTask(req, res, io));
  router.patch("/update/:id", auth, (req, res) => updateTask(req, res, io));
  router.delete("/delete/:id", auth, (req, res) => deleteTask(req, res, io));
  router.get("/admin", auth, admin, adminGetAllTasks);
  router.post("/:taskId/comment", auth, (req, res) => addComment(req, res, io));
  router.post("/import", auth, upload.single("csvFile"), importTasksFromCSV);
  router.get("/export", auth, exportTasksToCSV);

  return router;
};

module.exports = taskRouter;
