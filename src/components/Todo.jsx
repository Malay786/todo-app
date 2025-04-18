import { useEffect, useRef, useState } from "react";

const Todo = () => {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]); //this will be the array of objects

  const isMounted = useRef(false);
  // load tasks from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      console.log("Fetched from localStorage: ", savedTasks);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        console.log("Loaded from localStorage: ", parsed);
        setTasks(parsed);
      }
    } catch (error) {
        console.log('Invalid data in localStorage: ', error);
        localStorage.removeItem('tasks');
    }
  }, []);

  // save tasks to localStorage on every change
  useEffect(() => {
    //dont store on initial render
    if(isMounted.current) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
      isMounted.current = true;
    }
    console.log("Saved to localStorage: ", tasks);
  }, [tasks]);


  const addTask = () => {
    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      complete: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">To-Do List</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter a new task"
            className="flex-grow px-4 py-2 border rounded-lg outline-none"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li className="flex justify-between items-center" key={task.id}>
              <span
                className={
                  task.complete ? "line-through text-gray-500" : "text-red-300"
                }
              >
                {task.text}
              </span>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 border rounded-md hover:bg-green-100 ${
                    task.complete ? "bg-green-200" : ""
                  }`}
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.complete ? "Done" : "Complete"}
                </button>
                <button
                  className="px-3 py-1 border rounded-md hover:bg-red-100"
                  onClick={() => deleteTask(task.id)}
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
};

export default Todo;
