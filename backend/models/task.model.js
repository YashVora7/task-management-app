const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    date: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    description: { type: String, required: true },
    category: { type: String, required: true },
    completed: { type: Boolean, default: false },
    taskStatus: {type:String, enum:["pending","hold","completed"], default:"pending"},
    taskPriority :{type:String,enum:["high","medium","low"], default:"high"},
    dueDate: { type: Date },
    comments: [commentSchema]
},{timestamps : true});

const taskModel = mongoose.model('task', taskSchema);
module.exports = taskModel;
