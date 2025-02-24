import "../styles/table.css";
import "../styles/smodal.css";
import { useEffect, useState } from "react";

const EditClassrooms = ({ setIseModalOpen, editingClassrooms, handleEditClassroomSuccess,id }) => {
  const [csName, setCsName] = useState("");

  useEffect(() => {

    if (editingClassrooms) {
      setCsName(editingClassrooms.name);
    }
  }, [editingClassrooms]);

  const handleEditModule = async (e) => {

    const updatedClassroom = {
      name: csName,
    };
    try {
      const response = await fetch(`http://localhost:8081/admin/edit-classroom/${editingClassrooms.id}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClassroom),
      });
      if (response.ok) {
        console.log("Module updated successfully");
        handleEditClassroomSuccess(); // Refresh the module list in the parent component
      } else {
        console.error("Failed to update module:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIseModalOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Classroom</h2>
        <form
          onSubmit={(e) => {
            handleEditModule();
            e.preventDefault();

          }}
        >
          <label>
            Name:
            <input
              type="text"
              value={csName}
              onChange={(e) => setCsName(e.target.value)}
              required
            />
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

export default EditClassrooms;
