import "../styles/table.css";
import "../styles/smodal.css";
import { useState } from "react";

const AddModules = ({ setIsModalOpen, fetchModuleData }) => {
  const [moduleName, setModuleName] = useState("");
  const [moduleLevel, setModuleLevel] = useState("");
  const [moduleSemester, setModuleSemester] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleAddModule = async () => {
    const newModule = {
      name: moduleName,
      levele: moduleLevel,
      semester: moduleSemester,
      types: selectedTypes, // Include the selected types
    };
    console.log(newModule)
  
    try {
      const response = await fetch("http://localhost:8081/admin/add-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModule),
      });
  
      if (response.ok) {
        console.log("Module added successfully");
        fetchModuleData();
        setIsModalOpen(false);
      } else {
        alert("Failed to add module");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    clearForm();
  };
  
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTypes((prev) => [...prev, value]);
    } else {
      setSelectedTypes((prev) => prev.filter((type) => type !== value));
    }
  };
  
  const clearForm = () => {
    setModuleName("");
    setModuleLevel("");
    setModuleSemester("");
    setSelectedTypes([]); 
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Module</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddModule();
          }}
        >
          <label>
            Name:{" "}
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
            />
          </label>
          <label>
            Level:{" "}
            <input
              type="text"
              value={moduleLevel}
              onChange={(e) => setModuleLevel(e.target.value)}
              required
            />
          </label>
          <label>
            Semester:{" "}
            <input
              type="number"
              min={1}
              max={2}
              value={moduleSemester}
              onChange={(e) => setModuleSemester(e.target.value)}
              required
            />
          </label>
          <label>
            Types:
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  value="Cours"
                  onChange={(e) => handleTypeChange(e)}
                  checked={selectedTypes.includes("Cours")}
                  style={{ cursor: "pointer" }}
                />
                Cours
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  value="TD"
                  onChange={(e) => handleTypeChange(e)}
                  checked={selectedTypes.includes("TD")}
                  style={{ cursor: "pointer" }}
                />
                TD
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  value="TP"
                  onChange={(e) => handleTypeChange(e)}
                  checked={selectedTypes.includes("TP")}
                  style={{ cursor: "pointer" }}
                />
                TP
              </label>
            </div>
          </label>

          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddModules;
