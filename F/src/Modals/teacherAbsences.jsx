import "../styles/table.css";
import "../styles/smodal.css";
import { useEffect, useState } from "react";

const TeacherAbsences = ({ id, setIsAbsModalOpen }) => {
  const [teacherName, setTeacherName] = useState("");
  const [attendenceRate, setAttendenceRate] = useState("");
  const [teacherSessions, setTeacherSessions] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    console.log("Teacher Sessions:", teacherSessions, "Date:", date);
  }, [teacherSessions, date]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8081/admin/teacher/${id}`)
        .then((res) => res.json())
        .then((data) => setTeacherName(data.name))
        .catch((error) => console.error("Error fetching teacher name:", error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", id, date, teacherSessions);

    try {
      const response = await fetch("http://localhost:8081/admin/teacher-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: id,
          startDate: date,
          weeklySessions: Number(teacherSessions), // Ensure it's a number
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAttendenceRate(data.attendanceRate); // Expecting backend to return { attendanceRate: number }
      } else {
        console.error("Error fetching attendance rate:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ height: "500px" }}>
        <h1>Teacher {teacherName} Absences</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter the first day of the week:
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label>
            Enter teacher weekly sessions:
            <input
              type="number"
              value={teacherSessions}
              onChange={(e) => setTeacherSessions(Number(e.target.value))} // Convert to number
              required
            />
          </label>
          <button type="submit">See Teacher Absence</button>
        </form>
        {attendenceRate && <p>Attendance Rate = {attendenceRate} %</p>}
        <button type="button" onClick={() => setIsAbsModalOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TeacherAbsences;
