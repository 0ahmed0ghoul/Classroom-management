import "../styles/table.css";
import "../styles/smodal.css";
import { useState } from "react";

const AddClassrooms = ({ setIsModalOpen ,fetchClassroomsData }) => {
  const [csName, setCsName] = useState("");

  const handleAddClassroom = async () => {
    const newModule = { name: csName};
    try {
      const response = await fetch("http://localhost:8081/admin/add-classroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModule),
      });

      if (response.ok) {
        console.log("Module added successfully")
        fetchClassroomsData()
        setIsModalOpen(false);
      } else {
        alert("That classroom is inserted");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    clearForm();
  };

  const clearForm = () => {
    setCsName("");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Classroom</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddClassroom(); }}>
          <label>Name: <input type="text" value={csName} onChange={(e) => setCsName(e.target.value)} required /></label>
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddClassrooms;
