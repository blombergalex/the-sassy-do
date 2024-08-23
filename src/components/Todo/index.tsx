"use client";

import { useState, useEffect } from "react";
import "./todo.scss";

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
      <div className="new-item">
        <input
          className="input-field"
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add todo"
        />
        <button
          className="main__btn __add"
          onClick={() => addTodo(newTodoText)}
        >
          Add
        </button>
      </div>

      <ul className="list">
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
                <div className="btn-group">
                  <button
                    className="list__btn list__save"
                    onClick={() => saveTodo(index)}
                  >
                    Save
                  </button>
                  <button
                    className="list__btn list__delete"
                    onClick={() => deleteTodo(index)}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <span
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                >
                  {todo.text}
                </span>
                <div className="btn-group">
                  <button
                    className="list__btn list__toggle"
                    onClick={() => toggleCompletion(index)}
                  >
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="list__btn list__edit"
                    onClick={() => startEditingTodo(index)}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button
        className="list__btn list__show-completed"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? "Show Active" : "Show Completed"}
      </button>
    </div>
  );
}

export default TodoList;