import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const hasMounted = useRef(false); // for tracking first render

  // Load todos from localStorage on first mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        if (Array.isArray(parsed)) {
          setList(parsed);
        }
      } catch (e) {
        console.error('Error parsing saved todos:', e);
      }
    }
  }, []);

  // Save todos to localStorage only after initial mount
  useEffect(() => {
    if (hasMounted.current) {
      localStorage.setItem('todos', JSON.stringify(list));
    } else {
      hasMounted.current = true;
    }
  }, [list]);

  const handleOnChange = (e) => {
    setInput(e.target.value);
  };

  const addTask = () => {
    if (input.trim() !== '') {
      setList([...list, { text: input, done: false }]);
      setInput('');
    }
  };

  const deleteTask = (indexToDelete) => {
    const newList = list.filter((_, index) => index !== indexToDelete);
    setList(newList);
  };

  const resetTask = () => {
    setList([]);
  };

  const toggleDone = (index) => {
    const updatedList = list.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item
    );
    setList(updatedList);
  };

  const editTask = (index) => {
    setInput(list[index].text);
    deleteTask(index);
  };

  return (
    <div>
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl mb-5">iTask - Your Todo Manager</h1>

        <div className="addTodo flex gap-2 items-center mb-4">
          <input
            type="text"
            value={input}
            onChange={handleOnChange}
            className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none"
            placeholder="Enter your task"
          />
          <button
            onClick={addTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={resetTask}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        <ul>
          {list.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center my-2 bg-white p-2 rounded shadow"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleDone(index)}
                />
                <span className={todo.done ? 'line-through text-gray-500' : ''}>
                  {todo.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editTask(index)}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="bg-red-600 text-white px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;