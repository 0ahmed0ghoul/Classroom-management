import "../styles/table.css";
import "../styles/smodal.css";
import { useEffect, useState } from "react";

const EditTeachers = ({ setIseModalOpen, editingTeacher,handleEditTeacherSuccess }) => {
  const [teacherName, setTeacherName] = useState("");
  const [teacherGrade, setTeacherGrade] = useState("");
  const [teacherModule, setTeacherModule] = useState("");
  const [teacherTmodule, setTeacherTmodule] = useState([]);  // Ensure it starts as an array

  useEffect(() => {
    if (editingTeacher) {
      setTeacherName(editingTeacher.name || "");
      setTeacherGrade(editingTeacher.grade || "");
      setTeacherModule(editingTeacher.module || "");
      setTeacherTmodule(Array.isArray(editingTeacher.typemodule) ? editingTeacher.typemodule : []);  // Ensure it’s an array
    }
  }, [editingTeacher]);

  const handleEditTeacher = async () => {
    const updatedTeacher = {
      ...editingTeacher,
      name: teacherName,
      grade: teacherGrade,
      module: teacherModule,
      typemodule: teacherTmodule,
    };

    try {
      const response = await fetch(
        `http://localhost:8081/admin/edit-teacher/${editingTeacher.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTeacher),
        }
      );

      if (response.ok) {
        console.log("Teacher updated successfully");
        if (handleEditTeacherSuccess) handleEditTeacherSuccess(); // Trigger list refresh
      } else {
        console.error("Failed to update teacher:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }

    clearForm();
    setIseModalOpen(false);
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
  
    setTeacherTmodule((prev) => {
      // If checked, add the value to the array
      if (checked) {
        return [...prev, value];
      } else {
        // If unchecked, remove the value from the array
        return prev.filter((type) => type !== value);
      }
    });
  };

  const clearForm = () => {
    setTeacherName("");
    setTeacherGrade("");
    setTeacherModule("");
    setTeacherTmodule([]); // Reset to an empty array
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Teacher</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditTeacher();
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
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIseModalOpen(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTeachers;
