const taskModel = require("../models/task.model");
const csvParser = require('csv-parser');
const { writeToPath } = require('fast-csv');
const fs = require('fs');
const path = require('path');

const importTasksFromCSV = async (req, res) => {
    try {
      const tasks = [];
      const filePath = path.join(__dirname, '..', 'uploads/', req.file.filename); 
  
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', async (row) => {
          const { description, category, completed } = row;
          const task = {
            user: req.user._id,
            description,
            category,
            completed: completed === 'true'
          };
          tasks.push(task);
        })
        .on('end', async () => {
          await taskModel.insertMany(tasks);
          res.status(201).json({ message: 'Tasks imported successfully', tasks });
        });
    } catch (error) {
      res.status(500).json({ message: 'Server error while importing tasks', error });
    }
  };

  const exportTasksToCSV = async (req, res) => {
    try {
      const tasks = await taskModel.find({ user: req.user._id }).lean();
      const filePath = path.join(__dirname, '..', 'exports', `tasks_${req.user._id}.csv`);
    //   console.log(filePath);
      
  
      const csvStream = writeToPath(filePath, tasks, { headers: true });
      
      csvStream
        .on('finish', () => {
          res.download(filePath, 'tasks.csv', (err) => {
            if (err) {
              res.status(500).json({ message: 'Error in downloading CSV', error: err });
            }
            fs.unlinkSync(filePath); 
          });
        })
        .on('error', (error) => {
          res.status(500).json({ message: 'Server error while exporting tasks', error });
        });
    } catch (error) {
      res.status(500).json({ message: 'Server error while exporting tasks', error });
    }
  };



const createTask = async (req, res, io) => {
    try {
        const { description, category, completed, comments, assignedTo, taskStatus, dueDate } = req.body;
        const task = await taskModel.create({ user: req.user._id, description, category, completed, comments, assignedTo, taskStatus, dueDate });
        
        io.emit('newTaskCreated', task);

        if (assignedTo) {
            io.to(assignedTo).emit('taskAssigned', task);
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error while creating task", error });
    }
};

const getTask = async (req, res) => {
    try {
        const { completed, category, sortBy, from, to, page = 1, limit = 10 } = req.query;

        let filter = { user: req.user._id }; 

        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }

        if (category) {
            filter.category = category;
        }

        if (from && to) {
            filter.createdAt = { 
                $gte: new Date(from), 
                $lte: new Date(to) 
            };
        }

        let sort = {};
        if (sortBy) {
            const parts = sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1; 
        } else {
            sort.createdAt = -1;
        }

        const skip = (page - 1) * limit;
        const totalTasks = await taskModel.countDocuments(filter);
        const tasks = await taskModel.find(filter).sort(sort).skip(skip).limit(Number(limit)); 

        res.status(200).json({
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: Number(page),
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching tasks", error });
    }
};

  

const updateTask = async (req, res, io) => {
    try {
        const { id } = req.params;
        const { description, completed, assignedTo } = req.body;

        let task = await taskModel.findById(id);
        if (!task || (task.user.toString() !== req.user._id.toString() && task.assignedTo?.toString() !== req.user._id.toString())) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        task.assignedTo = assignedTo || task.assignedTo;
        
        await task.save();

        if (assignedTo && assignedTo !== task.assignedTo.toString()) {
            io.to(assignedTo).emit('taskAssigned', task);
        }

        io.emit('taskUpdated', task);

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error while updating task", error });
    }
};

const deleteTask = async (req, res, io) => {
    try {
        const task = await taskModel.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        io.emit('taskDeleted', { id: req.params.id });

        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting task", error });
    }
};

const addComment = async (req, res, io) => {
    const { taskId } = req.params;
    const { text } = req.body;
  
    try {
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const comment = {
            text,
            user: req.user._id,
            date: new Date(),
        };

        task.comments.push(comment);

        await task.save();
        
        io.emit("commentAdded", comment); 
        
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: "Error adding comment", error });
    }
};

const adminGetAllTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find({});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching all tasks", error });
    }
};

module.exports = { createTask, getTask, updateTask, deleteTask, adminGetAllTasks, addComment, importTasksFromCSV, exportTasksToCSV };
