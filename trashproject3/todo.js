const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "todos.json");
const MAX_TASK_LENGTH = 255;

app.use(express.json({ limit: "1mb" }));
app.use(cors());

let todos = [];

function loadTodos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      todos = JSON.parse(data);
    } else {
      todos = [
        { id: 1, task: "copy", completed: false },
        { id: 2, task: "paste", completed: false },
        { id: 3, task: "run", completed: false },
      ];
      saveTodos();
    }
  } catch (err) {
    console.error("Error loading todos:", err);
    todos = [];
  }
}

function saveTodos() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error("Error saving todos:", err);
  }
}

loadTodos();

app.get("/api/todos", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(todos);
});

app.get("/api/todos/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { id } = req.params;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  const todo = todos.find((t) => t.id === parsedId);
  if (!todo) return res.status(404).json({ message: "todo not found" });
  res.json(todo);
});

app.post("/api/todos", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { task, completed } = req.body;

    if (typeof task !== "string" || task.trim() === "") {
      return res
        .status(400)
        .json({ error: "task is required and must be a string" });
    }

    if (task.trim().length > MAX_TASK_LENGTH) {
      return res
        .status(400)
        .json({ error: `task cannot exceed ${MAX_TASK_LENGTH} characters` });
    }

    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "completed is required and must be a boolean" });
    }

    const trimmedTask = task.trim();
    const isDuplicate = todos.some(
      (t) => t.task.toLowerCase() === trimmedTask.toLowerCase()
    );
    if (isDuplicate) {
      return res.status(409).json({ error: "task already exists" });
    }

    const newId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
    const newTodo = { id: newId, task: trimmedTask, completed: completed };
    todos.push(newTodo);
    saveTodos();

    res
      .status(201)
      .json({ message: "task added with success!", todo: newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/todos/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { id } = req.params;
    const { task, completed } = req.body;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "ID must be a valid number" });
    }

    const todo = todos.find((t) => t.id === parsedId);
    if (!todo) return res.status(404).json({ message: "todo not found" });

    if (task !== undefined) {
      if (typeof task !== "string" || task.trim() === "") {
        return res
          .status(400)
          .json({ error: "task must be a non-empty string" });
      }

      if (task.trim().length > MAX_TASK_LENGTH) {
        return res
          .status(400)
          .json({
            error: `task cannot exceed ${MAX_TASK_LENGTH} characters`,
          });
      }

      const trimmedTask = task.trim();
      const isDuplicate = todos.some(
        (t) =>
          t.id !== parsedId &&
          t.task.toLowerCase() === trimmedTask.toLowerCase()
      );
      if (isDuplicate) {
        return res.status(409).json({ error: "task already exists" });
      }

      todo.task = trimmedTask;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "completed must be a boolean" });
      }
      todo.completed = completed;
    }

    saveTodos();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/todos/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "ID must be a valid number" });
    }

    const index = todos.findIndex((t) => t.id === parsedId);
    if (index === -1)
      return res.status(404).json({ message: "todo not found" });
    const deleteTodo = todos.splice(index, 1);
    saveTodos();
    res.json(deleteTodo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/api/todos`);
});
