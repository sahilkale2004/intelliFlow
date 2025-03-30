const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// API to fetch upcoming events
app.get('/upcoming-events', async (req, res) => {
  try {
    const upcomingEvents = await Event.find()
      .sort({ date: 1 })
      .limit(3);

    res.json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

  // Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  attendees: Number,
  status: String,
  image: String,
  duration: Number
});

const Event = mongoose.model('Event_details', eventSchema);

// Create Event
app.post('/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ error: 'Error creating event', details: error });
  }
});

// Get All Events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events', details: error });
  }
});

// Update Event
app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Event
app.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userName: String,
  email: String,
  dueDate: String,
  status: String,
});

const Task = mongoose.model("Task_details", TaskSchema);

// Create Task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();

    // Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newTask.email,
      subject: `New Task Assigned: ${newTask.title}`,
      text: `Hello ${newTask.userName},\n\nYou have been assigned a new task.\n\nTitle: ${newTask.title}\nDescription: ${newTask.description}\nDue Date: ${newTask.dueDate}\n\nPlease check your dashboard for details.\n\nBest Regards,\nEvent Management Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Emit Task to WebSocket Clients
    io.emit("new_task", newTask);

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Error creating task", details: err });
  }
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks', details: error });
  }
});

const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
// Update Task & Send Email Notification
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    io.emit("taskUpdated", updatedTask);

    const emailMessage = `
      <h3>Task Updated</h3>
      <p><strong>Task Title:</strong> ${updatedTask.title}</p>
      <p><strong>Description:</strong> ${updatedTask.description}</p>
      <p><strong>Due Date:</strong> ${updatedTask.dueDate}</p>
      <p>The task assigned to you has been updated.</p>
    `;

    sendEmail(updatedTask.email, "Task Updated Notification", emailMessage);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
