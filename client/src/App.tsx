import { useState, useEffect } from 'react';
import { ContractCall } from './utils/ContractCall';
import TodoList from "./contracts/ToDoList.json";

const contractABI = TodoList.abi;
const contractAddress = "";

function App() {
  const [contract, setContract] = useState<ContractCall | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize contract connection
  useEffect(() => {
    async function init() {
      try {
        const todoContract = new ContractCall(contractAddress, contractABI);
        await todoContract.requestAccountAccess();
        setContract(todoContract);
        await fetchTasks(todoContract);
      } catch (err) {
        setError("Failed to connect to MetaMask or contract");
        console.error(err);
      }
    }

    init();
  }, []);

  const fetchTasks = async (contractInstance: ContractCall) => {
    setLoading(true);
    try {
      const taskList = await contractInstance.getAllTasks();
      setTasks(taskList);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !contract) return;
    
    setLoading(true);
    try {
      await contract.createTask(newTask);
      setNewTask("");
      await fetchTasks(contract);
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">ToDo List (Blockchain)</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="flex-1 p-2 border rounded-l"
          disabled={loading}
        />
        <button
          onClick={handleAddTask}
          disabled={loading || !contract}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {loading && !tasks.length ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 border rounded flex justify-between items-center">
              <span className={task.completed ? "line-through" : ""}>
                {task.content}
              </span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="ml-2"
              />
            </li>
          ))}
        </ul>
      )}

      {!contract && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Connecting to MetaMask and contract...
        </div>
      )}
    </div>
  );
}

export default App;