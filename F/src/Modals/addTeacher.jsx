import "../styles/table.css";
import "../styles/smodal.css";
import { useState } from "react";

const AddTeachers = ({ setIsModalOpen, fetchTeacherData }) => {
  const [teacherName, setTeacherName] = useState("");
  const [teacherGrade, setTeacherGrade] = useState("");
  const [teacherModule, setTeacherModule] = useState("");
  const [teacherTmodule, setTeacherTmodule] = useState([]);

  const handleAddTeacher = async () => {
    const newTeacher = { 
      name: teacherName, 
      grade: teacherGrade, 
      module: teacherModule, 
      typemodule: teacherTmodule 
    };

    try {
      const response = await fetch("http://localhost:8081/admin/add-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      });

      if (response.ok) {
        console.log("Teacher added successfully");
        const addedTeacher = await response.json();
        fetchTeacherData(addedTeacher); // Notify the parent component
      } else {
        console.error("Failed to add teacher:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }

    clearForm();
    setIsModalOpen(false);
  };

  const clearForm = () => {
    setTeacherName("");
    setTeacherGrade("");
    setTeacherModule("");
    setTeacherTmodule([]); // Clear the typemodule array
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTeacherTmodule((prev) => [...prev, value]);
    } else {
      setTeacherTmodule((prev) => prev.filter((type) => type !== value));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Teacher</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTeacher();
          }}
        >
          <label>
            Name:
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              required
            />
          </label>
          <label>
            Grade:
            <input
              type="text"
              value={teacherGrade}
              onChange={(e) => setTeacherGrade(e.target.value)}
              required
            />
          </label>
          <label>
            Module:
            <input
              type="text"
              value={teacherModule}
              onChange={(e) => setTeacherModule(e.target.value)}
              required
            />
          </label>
          <label>
            Type of Module:
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
                  checked={teacherTmodule.includes("Cours")}
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
                  checked={teacherTmodule.includes("TD")}
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
                  checked={teacherTmodule.includes("TP")}
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

export default AddTeachers;
