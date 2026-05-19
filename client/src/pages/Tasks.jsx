import {
  useEffect,
  useState,
  useContext,
} from "react";

import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

import { AuthContext } from "../context/AuthContext";

import toast from "react-hot-toast";

function Tasks() {

  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    project: "",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const getConfig = () => {

    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const { data } = await API.get(
        "/tasks",
        getConfig()
      );

      setTasks(data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  const fetchProjects = async () => {

    try {

      const { data } = await API.get(
        "/projects",
        getConfig()
      );

      setProjects(data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {

    try {

      const { data } = await API.get(
        "/users",
        getConfig()
      );

      const membersOnly = data.filter(
        (u) => u.role === "member"
      );

      setUsers(membersOnly);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/tasks",
        formData,
        getConfig()
      );

      fetchTasks();

      toast.success("Task created successfully");

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        project: "",
        assignedTo: "",
        dueDate: "",
      });

    } catch (error) {

      console.log(error);

      toast.error("Task creation failed");
    }
  };

  const updateStatus = async (id, status) => {

    try {

      await API.put(
        `/tasks/${id}`,
        { status },
        getConfig()
      );

      fetchTasks();

      toast.success("Task deleted");

    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {

    try {

      await API.delete(
        `/tasks/${id}`,
        getConfig()
      );

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  // LOADING UI

  if (loading) {

    return (
      <MainLayout>

        <div className="flex justify-center items-center h-[70vh]">

          <div className="text-3xl font-bold animate-pulse">
            Loading Tasks...
          </div>

        </div>

      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold mb-8">
        Tasks Management
      </h1>

      {/* ADMIN ONLY CREATE TASK */}

      {user?.role === "admin" && (

        <div className="bg-slate-800 p-6 rounded-2xl mb-10">

          <h2 className="text-2xl font-bold mb-4">
            Create Task
          </h2>

          <form
            onSubmit={createTask}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
              required
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            >

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>

            </select>

            {/* PROJECT */}

            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            >

              <option value="">
                Select Project
              </option>

              {projects.map((project) => (

                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.title}
                </option>
              ))}

            </select>

            {/* ASSIGN MEMBER */}

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
              required
            >

              <option value="">
                Assign Member
              </option>

              {users.map((u) => (

                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.name}
                </option>
              ))}

            </select>

            {/* DUE DATE */}

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="p-3 rounded-lg bg-slate-700 outline-none"
            />

            <button
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold md:col-span-2 transition"
            >
              Create Task
            </button>

          </form>

        </div>
      )}

      {/* TASK TABLE */}

      <div className="bg-slate-800 rounded-2xl overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-700">

            <tr>

              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Assigned
              </th>

              <th className="p-4 text-left">
                Project
              </th>

              <th className="p-4 text-left">
                Due Date
              </th>

              <th className="p-4 text-left">
                Priority
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-10 text-slate-400"
                >
                  No tasks found
                </td>

              </tr>

            ) : (

              tasks.map((task) => (

                <tr
                  key={task._id}
                  className="border-b border-slate-700"
                >

                  <td className="p-4">

                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {task.description}
                    </p>

                    {
                      task.dueDate &&
                      new Date(task.dueDate) < new Date() &&
                      task.status !== "completed" && (

                        <span className="inline-block mt-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                          Overdue
                        </span>
                      )
                    }

                  </td>

                  <td className="p-4">
                    {task.assignedTo?.name}
                  </td>

                  <td className="p-4">
                    {task.project?.title || "N/A"}
                  </td>

                  <td className="p-4">

                    {task.dueDate
                      ? new Date(task.dueDate)
                        .toLocaleDateString()
                      : "N/A"}

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
    ${task.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : task.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                    >

                      {task.priority}

                    </span>

                  </td>

                  <td className="p-4">

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(
                          task._id,
                          e.target.value
                        )
                      }
                      className={`px-3 py-2 rounded-xl font-semibold outline-none border-none
  ${task.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : task.status === "in-progress"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                    >

                      <option value="todo">
                        Todo
                      </option>

                      <option value="in-progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                    </select>

                  </td>

                  <td className="p-4">

                    {user?.role === "admin" && (

                      <button
                        onClick={() =>
                          deleteTask(task._id)
                        }
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    )}

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
}

export default Tasks;