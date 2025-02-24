import "../styles/table.css";
import "../styles/smodal.css";
import React, { useEffect, useState } from "react";

const AllStudents = ({ group, setIsModalOpen ,setAttendentStudents  }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]); // To store selected students

  const fetchStudentData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-students");
      const data = await response.json();
  
      console.log(group); // Ensure 'group' is a number
      // Filter students by the given group number (index 5)
      const filteredStudents = data.students.filter(
        (student) => Number(student[5]) === Number(group) // Convert both to numbers for comparison
      );
  
      console.log(data.students);
      console.log(filteredStudents); // Ensure filteredStudents is not empty
      setStudents(filteredStudents);
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [group]); // Refetch if the group changes

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId); // Deselect if already selected
      } else {
        return [...prevSelected, studentId]; // Select student
      }
    });
  };

  const handleAddAttendance = () => {
    console.log("Selected Students for Attendance:", selectedStudents);
    setAttendentStudents(selectedStudents);
    setIsModalOpen(false); // Close the modal after adding attendance
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ height: "500px" }}>
        <h1>Select Attendant Students</h1>
        <hr />
            {students.map((student) => (
              <h3 key={student[0]}>{student[1]} {student[2]}
              <input
                type="checkbox"
                className="check"
                checked={selectedStudents.includes(Number(student[0]))}
                onChange={() => handleCheckboxChange(student[0])}
              /></h3>
                  
            ))}

        <div className="modal-actions">
          <button className="add-bt" onClick={handleAddAttendance}>
            Add
          </button>
          <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
