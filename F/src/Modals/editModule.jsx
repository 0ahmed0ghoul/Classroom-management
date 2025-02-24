import "../styles/table.css";
import "../styles/smodal.css";
import { useEffect, useState } from "react";

const EditModules = ({
  setIsModalOpen,
  editingModule,
  handleEditModuleSuccess,
}) => {
  const [moduleName, setModuleName] = useState("");
  const [moduleLevel, setModuleLevel] = useState("");
  const [moduleSemester, setModuleSemester] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]); // Ensure it's an empty array by default

  useEffect(() => {
    if (editingModule) {
      setModuleName(editingModule.name);
      setModuleLevel(editingModule.levele);
      setModuleSemester(editingModule.semester);
      setSelectedTypes(editingModule.selectedTypes || []); // Ensure selectedTypes is always an array
    }
  }, [editingModule]);

  const handleEditModule = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const updatedModule = {
      id: editingModule.id,
      name: moduleName,
      levele: moduleLevel,
      semester: moduleSemester,
      moduletypes: selectedTypes,
    };
        console.log(selectedTypes)
    try {
      const response = await fetch(
        `http://localhost:8081/admin/edit-module/${editingModule.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedModule),
        }
      );
      if (response.ok) {
        console.log("Module updated successfully");
        handleEditModuleSuccess(); // Refresh the module list in the parent component
      } else {
        console.error("Failed to update module:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsModalOpen(false);
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;

    setSelectedTypes((prev) => {
      // If checked, add the value to the array
      if (checked) {
        return [...prev, value];
      } else {
        // If unchecked, remove the value from the array
        return prev.filter((type) => type !== value);
      }
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Module</h2>
        <form onSubmit={handleEditModule}>
          <label>
            Name:
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
            />
          </label>
          <label>
            Level:
            <input
              type="text"
              value={moduleLevel}
              onChange={(e) => setModuleLevel(e.target.value)}
              required
            />
          </label>
          <label>
            Semester:
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
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Cours"
                  onChange={handleTypeChange}
                  checked={selectedTypes.includes("Cours")}
                />
                Cours
              </label>
              <label>
                <input
                  type="checkbox"
                  value="TD"
                  onChange={handleTypeChange}
                  checked={selectedTypes.includes("TD")}
                />
                TD
              </label>
              <label>
                <input
                  type="checkbox"
                  value="TP"
                  onChange={handleTypeChange}
                  checked={selectedTypes.includes("TP")}
                />
                TP
              </label>
            </div>
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModules;
