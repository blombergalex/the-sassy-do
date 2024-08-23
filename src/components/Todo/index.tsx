"use client";

import { useState, useEffect } from "react";
import "./todo.scss"

type Todo = {
  text: string;
  completed: boolean;
};

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos) as Todo[]);
    }
  }, []);

  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodos: Todo[] = [...todos, { text, completed: false }];
      setTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos));
      setNewTodoText("");
    }
  };

  const toggleCompletion = (index: number) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const startEditingTodo = (index: number) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const saveTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].text = editText;
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setEditIndex(null);
  };

  const deleteTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setEditIndex(null);
  };

  const filteredTodos = showCompleted
    ? todos.filter((todo) => todo.completed)
    : todos.filter((todo) => !todo.completed);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTodoText.trim() !== "") {
      addTodo(newTodoText);
    }
  };

  return (
    <div className="main">
      <div className="todo-input">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add todo"
        />
        <button className="main--add__btn" onClick={() => addTodo(newTodoText)}>
          Add
        </button>
      </div>

      <ul className="main">
        {filteredTodos.map((todo, index) => (
          <li className="todo-item" key={index}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveTodo(index);
                    }
                  }}
                />
                <button className="main--save__btn" onClick={() => saveTodo(index)}>
                  Save
                </button>
                <button
                  className="main--delete__btn"
                  onClick={() => deleteTodo(index)}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <span
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                >
                  {todo.text}
                </span>
                <button
                  className="todo-list--complete__btn"
                  onClick={() => toggleCompletion(index)}
                >
                  {todo.completed ? "Undo" : "Complete"}
                </button>
                <button
                  className="todo-list--edit__btn"
                  onClick={() => startEditingTodo(index)}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button
        className="show-completed__btn"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? "Show Active" : "Show Completed"}
      </button>
    </div>
  );
}

export default TodoList;
