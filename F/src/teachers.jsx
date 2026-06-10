import React, { useEffect, useState } from "react";
import "./styles/table.css";
import "./styles/tmodel.css";
import AddTeachers from "./Modals/AddTeacher";
import EditTeachers from "./Modals/EditTeacher";
import { useNavigate } from "react-router-dom";
import TeacherAbsences from "./Modals/TeacherAbsences";

const Teachers = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAbsModalOpen, setIsAbsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState(""); // Ensure this is set when opening the modal

  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const navigate = useNavigate();

  const fetchTeacherData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-teachers");
      const data = await response.json();
      const formattedData = data.teachers.map((teacherArray) => ({
        id: teacherArray[0],
        name: teacherArray[1],
        grade: teacherArray[2],
        module: teacherArray[3],
        typemodule: teacherArray[4],
      }));
      setTeachers(formattedData);
    } catch (error) {
      console.error("Error fetching teachers data:", error);
    }
  };
  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleAddTeacher = (newTeacher) => {
    setTeachers((prevTeachers) => [
      ...prevTeachers,
      {
        id: newTeacher.id,
        name: newTeacher.name,
        grade: newTeacher.grade,
        module: newTeacher.module,
        typemodule: newTeacher.typemodule,
      },
    ]);
  };

  const handleEditTeacher = (updatedTeacher) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      )
    );
  };

  const handleDeleteTeacher = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8081/admin/delete-teacher/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Teacher deleted successfully");
        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher.id !== id)
        );
      } else {
        console.error("Failed to delete teacher");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="table-container">
      <div className="button-container">
        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          Add Teacher
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Module</th>
            <th>Type of Module</th>
            <th style={{ width: "200px" }}>Options</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.grade}</td>
              <td>{teacher.module}</td>
              <td>{teacher.typemodule}</td>
              <td>
                <div className="buttons-container">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingTeacher(teacher);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="navigate-btn"
                    onClick={() => {
                      setTeacherId(teacher.id);
                      setIsAbsModalOpen(true);
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
      {isAddModalOpen && (
        <AddTeachers
          setIsModalOpen={setIsAddModalOpen}
          onAddTeacher={handleAddTeacher}
          fetchTeacherData={fetchTeacherData}
        />
      )}
      {isEditModalOpen && (
        <EditTeachers
          setIseModalOpen={setIsEditModalOpen}
          editingTeacher={editingTeacher}
          onEditTeacher={handleEditTeacher}
          handleEditTeacherSuccess={fetchTeacherData}
        />
      )}
      {isAbsModalOpen && (
        <TeacherAbsences
          id={teacherId}
          teacherName={
            teachers.find((teacher) => teacher.id === teacherId)?.name || ""
          }
          setIsAbsModalOpen={setIsAbsModalOpen}
          fetchTeacherData={fetchTeacherData}
        />
      )}
    </div>
  );
};

export default Teachers;
