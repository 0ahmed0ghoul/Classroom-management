import "../styles/table.css";
import "../styles/smodal.css";
import { useState, useEffect } from "react";

const EditStudent = ({ setIseModalOpen, editingStudent, handleEditStudentSuccess }) => {
  const [firstName, setFirstName] = useState(editingStudent ? editingStudent[1] : "");
  const [lastName, setLastName] = useState(editingStudent ? editingStudent[2] : "");
  const [levele, setLevel] = useState(editingStudent ? editingStudent[3] : "");
  const [speciality, setSpeciality] = useState(editingStudent ? editingStudent[4] : "");
  const [groupe, setGroup] = useState(editingStudent ? editingStudent[5] : "");

  useEffect(() => {
    if (editingStudent) {
      setFirstName(editingStudent[1]);
      setLastName(editingStudent[2]);
      setLevel(editingStudent[3]);
      setSpeciality(editingStudent[4]);
      setGroup(editingStudent[5]);
    }
  }, [editingStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedStudent = {
      ...editingStudent,
      firstName,
      lastName,
      levele,
      speciality,
      groupe: Number(groupe),
    };

    try {
      const response = await fetch(
        `http://localhost:8081/admin/edit-student/${editingStudent[0]}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedStudent),
        }
      );

      if (response.ok) {
        console.log("Student updated successfully");
        if (handleEditStudentSuccess) handleEditStudentSuccess(); // Trigger list refresh
      } else {
        const errorText = await response.text();
        console.error("Failed to update student:", errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIseModalOpen(false); // Close the modal after submitting
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Student</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Speciality:
            <input
              type="text"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
            />
          </label>
          <label>
            Level:
            <input
              type="text"
              value={levele}
              onChange={(e) => setLevel(e.target.value)}
              required
            />
          </label>
          <label>
            Group:
            <input
              type="number"
              min={1}
              value={groupe}
              onChange={(e) => setGroup(e.target.value)}
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

export default EditStudent;
