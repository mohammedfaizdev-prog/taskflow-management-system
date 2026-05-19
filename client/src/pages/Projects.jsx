import {
  useEffect,
  useState,
  useContext,
} from "react";

import MainLayout from "../layouts/MainLayout";

import API from "../services/api";

import toast from "react-hot-toast";

import {
  FolderKanban,
  Users,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

function Projects() {

  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    members: [],
  });

  useEffect(() => {
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

  const fetchProjects = async () => {

    try {

      setLoading(true);

      const { data } = await API.get(
        "/projects",
        getConfig()
      );

      setProjects(data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
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

  const toggleMember = (memberId) => {

    const isSelected =
      formData.members.includes(memberId);

    if (isSelected) {

      setFormData({
        ...formData,
        members: formData.members.filter(
          (id) => id !== memberId
        ),
      });

    } else {

      setFormData({
        ...formData,
        members: [
          ...formData.members,
          memberId,
        ],
      });
    }
  };

  const createProject = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/projects",
        formData,
        getConfig()
      );

      fetchProjects();

      toast.success(
        "Project created successfully"
      );

      setFormData({
        title: "",
        description: "",
        members: [],
      });

    } catch (error) {

      console.log(error);

      toast.error(
        "Project creation failed"
      );
    }
  };

  // LOADING

  if (loading) {

    return (
      <MainLayout>

        <div className="flex justify-center items-center h-[70vh]">

          <div className="text-3xl font-bold animate-pulse">
            Loading Projects...
          </div>

        </div>

      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold mb-8">
        Projects Management
      </h1>

      {/* ADMIN CREATE FORM */}

      {user?.role === "admin" && (

        <div className="bg-slate-800 p-6 rounded-3xl mb-10 shadow-xl border border-slate-700">

          <h2 className="text-2xl font-bold mb-6">
            Create Project
          </h2>

          <form
            onSubmit={createProject}
            className="grid gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              className="p-4 rounded-xl bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="p-4 rounded-xl bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* MEMBER SELECTION */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Select Team Members
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {users.map((u) => {

                  const isSelected =
                    formData.members.includes(u._id);

                  return (

                    <div
                      key={u._id}
                      onClick={() =>
                        toggleMember(u._id)
                      }
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-400 shadow-lg scale-[1.02]"
                          : "bg-slate-700 border-slate-600 hover:border-blue-500 hover:bg-slate-600"
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        {/* AVATAR */}

                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                          ${
                            isSelected
                              ? "bg-white text-blue-600"
                              : "bg-slate-800 text-white"
                          }`}
                        >

                          {u.name.charAt(0).toUpperCase()}

                        </div>

                        {/* USER INFO */}

                        <div>

                          <h4 className="font-semibold">
                            {u.name}
                          </h4>

                          <p className="text-sm text-slate-300">
                            {u.email}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            <button
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Create Project
            </button>

          </form>

        </div>
      )}

      {/* EMPTY STATE */}

      {projects.length === 0 ? (

        <div className="bg-slate-800 rounded-3xl p-16 text-center text-slate-400 shadow-xl">

          No projects found

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {projects.map((project) => (

            <div
              key={project._id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all duration-300"
            >

              {/* TOP */}

              <div className="flex items-start justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold mb-2">
                    {project.title}
                  </h2>

                  <p className="text-slate-400 text-sm">
                    {project.description}
                  </p>

                </div>

                <div className="bg-blue-500/20 p-3 rounded-2xl">

                  <FolderKanban
                    className="text-blue-400"
                    size={26}
                  />

                </div>

              </div>

              {/* CREATOR */}

              <div className="mb-5">

                <p className="text-sm text-slate-500">
                  Created By
                </p>

                <p className="font-medium mt-1">
                  {project.createdBy?.name}
                </p>

              </div>

              {/* MEMBERS */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <Users
                    size={18}
                    className="text-cyan-400"
                  />

                  <h3 className="font-semibold">
                    Team Members
                  </h3>

                </div>

                <div className="flex flex-wrap gap-2">

                  {project.members?.length > 0 ? (

                    project.members.map((member) => (

                      <span
                        key={member._id}
                        className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm"
                      >
                        {member.name}
                      </span>
                    ))

                  ) : (

                    <span className="text-slate-500 text-sm">
                      No members assigned
                    </span>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </MainLayout>
  );
}

export default Projects;