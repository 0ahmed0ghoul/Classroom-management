import { useState, useEffect } from "react";
import AllStudents from "./Allstudents";
import { useNavigate } from "react-router-dom";

const AddAttend = ({ fetchAttendData,setIsModalOpen, time ,classroom,session_num}) => {
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleTypes, setModuleTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [groupedStudents, setGroupedStudents] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(""); 

  const [attendentStudents, setAttendentStudents] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedModule, setSelectedModule] = useState(""); 
  const [selectedModuleType, setSelectedModuleType] = useState(""); 

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
  const fetchModuleData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-modules");
      const data = await response.json();

      // Group modules by IDM and structure the details
      const groupedModules = data.result.reduce((acc, item) => {
        const { IDM, NAME, LEVELE, SEMESTER, NAMET } = item;

        if (!acc[IDM]) {
          acc[IDM] = {
            id: IDM,
            name: NAME,
            level: LEVELE,
            semester: SEMESTER,
            types: [], // Initialize empty array for types
          };
        }
        acc[IDM].types.push(NAMET);

        return acc;
      }, {});

      const moduleNames = Object.values(groupedModules);
      setModules(moduleNames);
    } catch (error) {
      console.error("Error fetching modules data:", error);
    }
  };
  const fetchStudentData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-students");
      const data = await response.json();
      if (data && data.students) {
        setStudents(data.students);
      } else {
        console.error("Invalid students data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };
  const fetchClassroomsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/admin/get-classrooms"
      );
      const data = await response.json();
      if (data && data.result) {
        setClassrooms(data.result);
      } else {
        console.error("Invalid classrooms data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching classrooms data:", error);
    }
  };
  useEffect(() => {
    fetchAttendData();fetchTeacherData();fetchStudentData();fetchClassroomsData();fetchModuleData();
  }, []);


  useEffect(() => {
    if (selectedModule) {const module = modules.find((mod) => mod.id === parseInt(selectedModule));setModuleTypes(module ? module.types : []);}
  }, [selectedModule, modules]);

  useEffect(() => {
    const grouped = students.reduce((groups, student) => {
      const groupNumber = student[5]; 
      if (!groups[groupNumber]) {groups[groupNumber] = []; }
      groups[groupNumber].push(student);
      return groups;
    }, {});
    setGroupedStudents(grouped); 
  }, [students]);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    console.log(event.target.value);
  };

  const groupNumbers = Object.keys(groupedStudents).sort((a, b) => a - b);

  const sessionTimes = {
    A: [
      { start: "08:00 AM", end: "09:30 AM" }, // Session 1
      { start: "09:30 AM", end: "11:00 AM" }, // Session 2
      { start: "11:00 AM", end: "12:30 PM" }, // Session 3
    ],
    P: [
      { start: "02:00 PM", end: "03:30 PM" }, // Session 1
      { start: "03:30 PM", end: "05:00 PM" }, // Session 2
    ],
  };
  
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  
  const getFormattedTimes = (day, sessionType, sessionNumber) => {
    const date = new Date();
    date.setDate(date.getDate() + ((dayMap[day] - date.getDay() + 7) % 7));
    
    const formattedDate = date.toLocaleDateString("en-GB").split("/").reverse().join("-");
    const session = sessionTimes[sessionType][sessionNumber - 1];
  
    return {
      timeStart: `${formattedDate} ${convertTo24HourFormat(session.start)}`,
      timeEnd: `${formattedDate} ${convertTo24HourFormat(session.end)}`,
    };
  };
  
  const convertTo24HourFormat = (time) => {
    let [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
    hours = period === "PM" && hours !== "12" ? +hours + 12 : period === "AM" && hours === "12" ? "00" : hours;
    return `${String(hours).padStart(2, "0")}:${minutes}:00`;
  };
  
  const handleAddAttend = async () => {
    if (![attendentStudents, classroom, selectedTeacher, selectedModule, selectedModuleType].every(Boolean)) {
      console.error("Please fill in all required fields!");
      return;
    }
  
    const [day, sessionType, sessionNumber] = time.split("-");
    const { timeStart, timeEnd } = getFormattedTimes(day, sessionType, +sessionNumber);
  
    const newAttend = {
      code_s: attendentStudents,
      code_c: classroom,
      idt: +selectedTeacher,
      idm: +selectedModule,
      idtm: selectedModuleType,
      day,
      time_start: timeStart,
      time_end: timeEnd,
      session_num: +sessionNumber,
      group_num: +selectedGroup,
    };
  
    console.log("New Attend Data:", newAttend);
  
    try {
      const response = await fetch("http://localhost:8081/admin/add-attend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAttend),
      });
  
      if (response.ok) {
        console.log("Attend added successfully");
        fetchAttendData();
      } else {
        console.error("Failed to add attend:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  
    clearForm();
    setIsModalOpen(false);
  };
  
  const clearForm = () => {
    setTeachers([]);
    setModules([]);
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Attendance</h2>
        <form onSubmit={(e) => {
            e.preventDefault();
            handleAddAttend();
          }}>
      <div className="form-group">
        <label>Select Teacher</label>
        <select
          onChange={(e) => setSelectedTeacher(e.target.value)}
          value={selectedTeacher || ""}
        >
          <option value="">Choose a teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {/* Module Selection */}
      <div className="form-group">
        <label>Select Module</label>
        <select
          onChange={(e) => setSelectedModule(e.target.value)}
          value={selectedModule || ""}
        >
          <option value="">Choose a module</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
      </div>

      {/* Module Type Selection */}
      <div className="form-group">
        <label>Select Type of Module</label>
        <select
          onChange={(e) => setSelectedModuleType(e.target.value)}
          value={selectedModuleType || ""}
        >
          <option value="">Choose a type</option>
          {moduleTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Group Selection */}
      <div className="form-group">
        <label>Select Group</label>
        <select onChange={handleGroupChange} value={selectedGroup || ""}>
          <option value="">Choose a group</option>
          {groupNumbers.map((group) => (
            <option key={group} value={group}>
              Group {group}
            </option>
          ))}
        </select>
      </div>

      {/* Attendant Students */}
      <div>
        {attendentStudents.length === 0 ? (
          selectedGroup === "" ? (
            <button type="button" className="add-btn" disabled>
              Select Attendant Students
            </button>
          ) : (
            <button
              type="button"
              className="add-btn"
              onClick={() => setIsAllModalOpen(true)}
            >
              Select Attendant Students
            </button>
          )
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>Attendant students: {attendentStudents.join(", ")}</p>
            <button
              style={{ width: "fit-content", padding: "0.5em 1em" }}
              onClick={() => setIsAllModalOpen(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div>
        <button type="submit" className="submit-btn">
          Add
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
      </div>

      {isAllModalOpen && (
        <AllStudents
          group={selectedGroup} // Pass selected group to AllStudents
          setIsModalOpen={setIsAllModalOpen}
          setAttendentStudents={setAttendentStudents}
        />
      )}
    </div>
  );
};

export default AddAttend;
