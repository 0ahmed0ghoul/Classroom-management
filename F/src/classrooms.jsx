import React, { useEffect, useState } from "react";
import "./styles/table.css";
import "./styles/smodal.css";

import { useNavigate } from "react-router-dom";
import EditClassrooms from "./Modals/editClassroom";
import AddClassrooms from "./Modals/addClassroom";

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClassrooms, setEditingClassrooms] = useState(null);
  const [csName, setCsName] = useState("");
  const [csType, setCsType] = useState("");
  const navigate = useNavigate();

  const fetchClassroomsData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-classrooms");
      const data = await response.json();
      setClassrooms(data.result);
    } catch (error) {
      console.error("Error fetching modules data:", error);
    }
  };

  useEffect(() => {
    fetchClassroomsData();
  }, []);

  const handleDeleteClassroom = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8081/admin/delete-classroom/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Module deleted successfully");
        fetchClassroomsData();
      } else {
        console.error("Failed to delete module");

      }
    } catch (error) {
      console.error("Error:", error);
      alert("You can't delete that module , its connected to other table")
    }
  };
  return (
    <div className="talbes">
      <div className="table-container">
        <div className="button-container">
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            Add Classroom
          </button>
        </div>

        <table className="styled-table" style={{"tableLayout":"fixed"}}>
          <thead>
            <tr>
              <th>Classroom name</th>
              <th>Type</th>
              <th>capacity</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom[0]}>
                <td>{classroom[0]}</td>
                <td>{classroom[1]}</td>
                <td>{classroom[2]}</td>
                <td>
                <div className="buttons-container" style={{"width":"fit-content"}}>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClassroom(classroom[0])}
                  >
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && <AddClassrooms setIsModalOpen={setIsModalOpen} fetchClassroomsData={fetchClassroomsData} />}
      </div>
    </div>
  );
};

export default Classrooms;
