import React, { useEffect, useState } from "react";
import "./styles/table.css";
import "./styles/smodal.css";
import EditModules from "./Modals/EditModule";
import AddModules from "./Modals/AddModule";
import { useNavigate } from "react-router-dom";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleName, setModuleName] = useState("");
  const [moduleLevel, setModuleLevel] = useState("");
  const [moduleSemester, setModuleSemester] = useState("");
  const [activeTab, setActiveTab] = useState("Cour"); // Default tab
  const [error, setError] = useState(""); // To store any error message
  const navigate = useNavigate();

  // Fetch modules from the backend
  const fetchModuleData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-modules");
      const data = await response.json();
      setModules(data.result || []);
    } catch (error) {
      setError("Error fetching modules data. Please try again.");
      console.error("Error fetching modules data:", error);
    }
  };

  useEffect(() => {
    fetchModuleData();
  }, []);

  // Navigate to module types
  const navigateToTypes = (id) => {
    navigate(`/admin/module/${id}/types`);
  };

  // Handle module deletion
  const handleDeleteModule = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8081/admin/delete-module/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchModuleData(); // Reload modules after deletion
      } else {
        alert("You can't delete that module, it's connected to another table");
      }
    } catch (error) {
      alert("You can't delete that module, it's connected to another table");
      console.error("Error:", error);
    }
  };

  const idModelMap = {
    Cour: "Cours",
    TD: "TD",
    TP: "TP",
  };
  
  // Fix filtering to check NAMET instead of module[4]
  const filteredModules = modules.filter(
    (module) => module.NAMET === idModelMap[activeTab]
  );
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTeacherTmodule((prev) => [...prev, value]);
    } else {
      setTeacherTmodule((prev) => prev.filter((type) => type !== value));
    }
  };
  return (
    <div className="tables">
      <div className="table-container">
        <div className="button-container">
          <div className="tabs edited">
            {Object.keys(idModelMap).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Add Module Button */}
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            Add Module
          </button>
        </div>
  
        {/* Table Content */}
        <table className="styled-table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Semester</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.length === 0 ? (
              <tr>
                <td colSpan="4">No modules found for the selected type.</td>
              </tr>
            ) : (
              filteredModules.map((module) => (
                <tr key={module.IDM}>
                  <td>{module.NAME}</td>
                  <td>{module.LEVELE}</td>
                  <td>{module.SEMESTER}</td>
                  <td>
                    <div className="buttons-container" style={{ width: "fit-content" }}>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteModule(module.IDM)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
      {/* Modals */}
      {isModalOpen && (
        <AddModules
          setIsModalOpen={setIsModalOpen}
          fetchModuleData={fetchModuleData}
        />
      )}
      {isEditModalOpen && (
        <EditModules
          setIsModalOpen={setIsEditModalOpen}
          editingModule={editingModule}
          handleEditModuleSuccess={fetchModuleData}
        />
      )}
    </div>
  );
};

export default Modules;
