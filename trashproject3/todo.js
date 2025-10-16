const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
// INIT OUR APP (expressJS)
app.use(express.json());
app.use(cors());

let todos = [
  { id: 1, task: "copy", completed: false },
  { id: 2, task: "paste", completed: false },
  { id: 3, task: "run", completed: false },
];

app.get("/api/todos", (req, res) => {
  res.json(todos); // orginial version
});

app.get("/api/todos/:id", (req, res) => {
  const { id } = req.params; // const id = req.params.id ;
  const todo = todos.find((t) => t.id === parseInt(id)); // verify that id exist
  if (!todo) return res.status(404).json({ message: "To-Do not found" }); //  if it doesnt : server will return code : 404 (not found) with a message :
  res.json(todo);
});

// req => { header :  " " , body : " " }

app.post("/api/todos", (req, res) => {
  const { task, completed } = req.body;
  if (typeof task !== "string" && task === "") {
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
  const newTodo = { id: newId, task: task, completed: completed };
  todos.push(newTodo);

  res.status(201).json({ message: "task added with success!" });
  //res.status(201).json(newTodo);
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ message: "todo not found" });
  if (task) todo.task = task;
  if (completed) todo.completed = completed;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "todo not found" });
  const deleteTodo = todos.splice(index, 1);
  res.json(deleteTodo[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/api/todos`);
});
