const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let todos = [
  { id: 1, task: "copy", completed: false },
  { id: 2, task: "paste", completed: false },
  { id: 3, task: "run", completed: false },
];

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.get("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ message: "To-Do not found" });
  res.json(todo);
});

app.post("/api/todos", (req, res) => {
  try {
    const { task, completed } = req.body;
    
    if (typeof task !== "string" || task.trim() === "") {
      return res
        .status(400)
        .json({ error: "task is required and must be a string" });
    }

    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "completed is required and must be a boolean" });
    }

    const newId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
    const newTodo = { id: newId, task: task.trim(), completed: completed };
    todos.push(newTodo);

    res.status(201).json({ message: "task added with success!", todo: newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;

    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) return res.status(404).json({ message: "todo not found" });
    
    if (task !== undefined) {
      if (typeof task !== "string" || task.trim() === "") {
        return res.status(400).json({ error: "task must be a non-empty string" });
      }
      todo.task = task.trim();
    }
    
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "completed must be a boolean" });
      }
      todo.completed = completed;
    }
    
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = todos.findIndex((t) => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ message: "todo not found" });
    const deleteTodo = todos.splice(index, 1);
    res.json(deleteTodo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/api/todos`);
});
