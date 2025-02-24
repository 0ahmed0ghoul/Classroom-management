import "../styles/table.css";
import "../styles/smodal.css";
import { useEffect, useState } from "react";

const StudentAbsences = ({id,name, setIsAbsModalOpen }) => {
  const [attendanceRate, setAttendenceRate] = useState("");
  const fetchStudentData = async () => {
    try {
      const response = await fetch(`http://localhost:8081/admin/student/${id}/attendance`);
            if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setAttendenceRate(data.attendanceRate);
    } catch (error) {
      console.error("Error fetching students attendance data:", error);
    }
  };
  
  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content" style={{ height: "500px" }}>
        <h1>Student {name} Absences</h1>
        <p>Atendence Rate = {attendanceRate || 0} %</p>
        <button type="button" onClick={() => setIsAbsModalOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StudentAbsences;
