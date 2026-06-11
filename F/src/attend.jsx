import { useEffect, useState } from "react";
import "./styles/table.css";
import AddAttend from "./Modals/AddAttend"; // Ensure the path is correct

const Attend = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedSession, setSelectedSession] = useState();
  const [attend, setAttend] = useState([]);
  const [filledSession, setFilledSession] = useState([]);
  const [time, setTime] = useState("");
  const [serverError, setServerError] = useState(false);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Saturday",
  ];
  const morningModules = [
    { label: "Module 1" },
    { label: "Module 2" },
    { label: "Module 3" },
  ];
  const eveningModules = [{ label: "Module 4" }, { label: "Module 5" }];
  const fetchClassroomsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/admin/get-classrooms"
      );
  
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
  
      const data = await response.json();
  
      setClassrooms(data?.result || []);
    } catch (error) {
      console.error(error);
      setServerError(true);
      setAttend([]);
      setFilledSession([]);
    }
  };
  useEffect(() => {
    fetchClassroomsData();
  }, []);
  useEffect(() => {
    if (isAddModalOpen && selectedClassroom === "") {
      alert("Please select a classroom first!");
    }
  }, [isAddModalOpen, selectedClassroom]);

  const fetchAttendData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/admin/get-attend"
      );
  
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
  
      const data = await response.json();
  
      const attends = data?.attends || [];
  
      setAttend(attends);
  
      const fs = attends.map((attend) => ({
        classroom: attend?.[1] ?? "",
        day: attend?.[5] ?? "",
        sessionKey: attend?.[8] ?? "No Session Key",
      }));
  
      setFilledSession(fs);
    }catch (error) {
      console.error(error);
      setServerError(true);
      setAttend([]);
      setFilledSession([]);
    }
  };
  useEffect(() => {
    fetchAttendData();
  }, []);

  return (
    
    <div className="table-container">
      {serverError && (
  <div
    style={{
      padding: "10px",
      marginBottom: "20px",
      background: "#ffdddd",
      color: "red",
      border: "1px solid red",
    }}
  >
    Cannot connect to the server. Please try again later. Maybe the server is down or there is a network issue.
  </div>
)}
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "100px",
        }}
      >
        <div>
          <label
            style={{ height: "100%", marginRight: "15px", fontSize: "24px" }}
          >
            Select Classroom :
            <select
              style={{ width: "200px", marginLeft: "15px" }}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="">Choose a classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom[0]} value={classroom[0]}>
                  {classroom[0]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3>
              Week <span>1</span> of month <span>March</span>
            </h3>
            <button style={{ height: "32px", width: "48px" }}>&gt;</button>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "orange",
              }}
            ></div>
            Means Empty
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{ width: "24px", height: "24px", backgroundColor: "grey" }}
            ></div>
            Means Occupied
          </div>
        </div>
      </div>
      <div className="selection-container">
        <div className="calendar-container">
          <div className="calendar-grid">
            {weekdays.map((day) => (
              <div key={day} className="calendar-day">
                <h2 className="day-title">{day}</h2>

                <div className="session-container">
                  <h3 className="session-title" style={{ textAlign: "center" }}>
                    Morning:
                  </h3>
                  {morningModules.map((module, index) => {
                    const sessionKey = index + 1;
                    const isDisabled = filledSession.some(
                      (s) =>
                        s.classroom === selectedClassroom &&
                        s.day === day &&
                        s.sessionKey === sessionKey
                    );

                    return (
                      <button
                        key={`${day}-A-${sessionKey}`}
                        className="module-item"
                        style={{
                          backgroundColor: isDisabled ? "grey" : "orange",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (!isDisabled) {
                            setIsAddModalOpen(true);
                            setSelectedSession(sessionKey);
                            setTime(`${day}-A-${sessionKey}`);
                          }
                        }}
                        disabled={isDisabled}
                      >
                        <span className="module-label">{module.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="session-container">
                  <h3 className="session-title" style={{ textAlign: "center" }}>
                    Evening:
                  </h3>
                  {eveningModules.map((module, index) => {
                    const sessionKey = index + 4; // Generate session key
                    const isDisabled = filledSession.some(
                      (s) =>
                        s.classroom === selectedClassroom &&
                        s.day === day &&
                        s.sessionKey === sessionKey
                    );

                    return (
                      <button
                        key={`${day}-P-${sessionKey}`}
                        className="module-item"
                        style={{
                          backgroundColor: isDisabled ? "grey" : "orange",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (!isDisabled) {
                            setIsAddModalOpen(true);
                            setSelectedSession(sessionKey);
                            setTime(`${day}-P-${sessionKey}`);
                          }
                        }}
                        disabled={isDisabled}
                      >
                        <span className="module-label">{module.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && selectedClassroom !== "" && (
        <AddAttend
          setIsModalOpen={setIsAddModalOpen}
          fetchAttendData={fetchAttendData}
          time={time}
          classroom={selectedClassroom}
          session_num={selectedSession}
        />
      )}
    </div>
  );
};

export default Attend;
