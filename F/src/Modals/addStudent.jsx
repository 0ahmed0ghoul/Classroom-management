import "../styles/table.css";
import "../styles/smodal.css";
import { useState } from "react";

const AddStudent = ({ setIsModalOpen, fetchStudentData }) => { // Make sure fetchStudentData is received here
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [levele, setLevel] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [groupe, setGroup] = useState("");

  const handleAddStudentRequest = async () => {
    const newStudent = { firstName, lastName, levele, speciality, groupe: Number(groupe) };

    try {
      const response = await fetch("http://localhost:8081/admin/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        console.log("Student added successfully");
        fetchStudentData(); // Refresh student list after adding
      } else {
        const errorData = await response.json();
        console.error("Failed to add student:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    clearForm();
    setIsModalOpen(false);
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setLevel("");
    setSpeciality("");
    setGroup("");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Student</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStudentRequest();
          }}
        >
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
              min={1}
              max={20}
              type="number"
              value={groupe}
              onChange={(e) => setGroup(e.target.value)}
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
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
