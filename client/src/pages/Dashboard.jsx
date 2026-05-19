import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

import {
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  AlertTriangle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const tasksRes = await API.get(
        "/tasks",
        config
      );

      const projectsRes = await API.get(
        "/projects",
        config
      );

      setTasks(tasksRes.data);

      setProjects(projectsRes.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  // LOADING UI
  if (loading) {

    return (
      <MainLayout>

        <div className="flex justify-center items-center h-[70vh]">

          <div className="text-3xl font-bold animate-pulse">
            Loading Dashboard...
          </div>

        </div>

      </MainLayout>
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  );

  const overdueTasks = tasks.filter((task) => {

    if (!task.dueDate) return false;

    return (
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed"
    );
  });

  const chartData = [
    {
      name: "Completed",
      value: completedTasks.length,
    },
    {
      name: "Pending",
      value: pendingTasks.length,
    },
  ];

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold mb-8">
        Dashboard Overview
      </h1>

      {/* DASHBOARD CARDS */}

      {/* DASHBOARD CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL TASKS */}

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm uppercase tracking-wide text-blue-100">
                Total Tasks
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {tasks.length}
              </h2>

            </div>

            <div className="bg-white/20 p-4 rounded-2xl">

              <ClipboardList size={32} />

            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm uppercase tracking-wide text-green-100">
                Completed
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {completedTasks.length}
              </h2>

            </div>

            <div className="bg-white/20 p-4 rounded-2xl">

              <CheckCircle2 size={32} />

            </div>

          </div>

        </div>

        {/* PROJECTS */}

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm uppercase tracking-wide text-violet-100">
                Projects
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {projects.length}
              </h2>

            </div>

            <div className="bg-white/20 p-4 rounded-2xl">

              <FolderKanban size={32} />

            </div>

          </div>

        </div>

        {/* OVERDUE */}

        <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm uppercase tracking-wide text-red-100">
                Overdue
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {overdueTasks.length}
              </h2>

            </div>

            <div className="bg-white/20 p-4 rounded-2xl">

              <AlertTriangle size={32} />

            </div>

          </div>

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="mt-10 bg-slate-800 p-6 rounded-2xl">

        <h2 className="text-2xl font-bold mb-6">
          Tasks Analytics
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={120}
                label
              >

                <Cell fill="#22c55e" />

                <Cell fill="#eab308" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT TASKS */}

      <div className="mt-10 bg-slate-800 p-6 rounded-2xl">

        <h2 className="text-2xl font-bold mb-6">
          Recent Tasks
        </h2>

        {
          tasks.length === 0 ? (

            <div className="text-center text-slate-400 py-10">
              No tasks found
            </div>

          ) : (

            <div className="space-y-4">

              {tasks.map((task) => (

                <div
                  key={task._id}
                  className="bg-slate-700 p-4 rounded-xl flex justify-between items-center"
                >

                  <div>

                    <h3 className="font-semibold text-lg">
                      {task.title}
                    </h3>

                    <p className="text-slate-300 text-sm">
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

                  </div>

                  <div>

                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm capitalize">
                      {task.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )
        }

      </div>

    </MainLayout>
  );
}

export default Dashboard;