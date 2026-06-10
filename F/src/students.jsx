import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/table.css";
import "./styles/smodal.css";
import AddStudent from "./Modals/AddStudent";
import EditStudent from "./Modals/EditStudent";
import StudentAbsences from "./Modals/StudentAbsences";

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAbsModalOpen, setIsAbsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [levele, setLevel] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [id,setId]=useState(null)
  const [name,setName] =useState('')
  const navigate = useNavigate();



  // Function to fetch student data
  const fetchStudentData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-students");
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/admin/delete-student/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Student deleted successfully");
        fetchStudentData(); // Refresh student list after deleting
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };






  return (
    <div className="table-container">
      <div className="button-container">
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          Add Student
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Code Student</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Speciality</th>
            <th>Level</th>
            <th>Group</th>
            <th style={{ width: "200px" }}>Options</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student[0]}>
              <td>{student[0]}</td>
              <td>{student[1]}</td>
              <td>{student[2]}</td>
              <td>{student[4]}</td>
              <td>{student[3]}</td>
              <td>{student[5]}</td>
              <td>
                <div className="buttons-container">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingStudent(student);
                      setFirstName(student[1] || "");
                      setLastName(student[2] || "");
                      setLevel(student[3] || "");
                      setSpeciality(student[4] || "");
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteStudent(student[0])}
                  >
                    Delete
                  </button>
                  <button
                    className="navigate-btn"
                    onClick={() => {
                      setIsAbsModalOpen(true)
                      setId(student[0])
                      setName(`${student[1]} ${student[2]}`)

                    }}
                  >
                    See Absences
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <AddStudent 
        setIsModalOpen={setIsModalOpen} 
        fetchStudentData={fetchStudentData} 
        />)}


      {isEditModalOpen && (
        <EditStudent
          setIseModalOpen={setIsEditModalOpen}
          editingStudent={editingStudent}
          handleEditStudentSuccess={fetchStudentData}
        />
      )}

{isAbsModalOpen && (
        <StudentAbsences 
        id = {id}
        name= {name}
        setIsAbsModalOpen={setIsAbsModalOpen} 
        fetchStudentData={fetchStudentData} 
        />)}

    </div>
  );
};

export default Students;
