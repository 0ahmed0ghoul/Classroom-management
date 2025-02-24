import { useState, useEffect } from "react";

const Groups = () => {
  const [students, setStudents] = useState([]);
  const [groupedStudents, setGroupedStudents] = useState({});

  const fetchStudentData = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/get-students");
      const data = await response.json();
      setStudents(data.students); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData(); // Fetch student data on component mount
  }, []);

  useEffect(() => {
    // Group students when the `students` state updates
    const grouped = students.reduce((groups, student) => {
      const groupNumber = student[5]; // Get the last number (group)
      if (!groups[groupNumber]) {
        groups[groupNumber] = []; // Initialize group if it doesn't exist
      }
      groups[groupNumber].push(student); // Add student to the group
      return groups;
    }, {});
    setGroupedStudents(grouped); // Update grouped students state
  }, [students]);

  // Get all group numbers
  const groupNumbers = Object.keys(groupedStudents).sort((a, b) => a - b);

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            {groupNumbers.map((group) => (
              <th key={group}>Group {group}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Find the max group size to create rows dynamically */}
          {Array.from(
            { length: Math.max(...Object.values(groupedStudents).map((g) => g.length)) || 0 },
            (_, rowIndex) => (
              <tr key={rowIndex}>
                {groupNumbers.map((group) => (
                  <td key={group}>
                    {groupedStudents[group][rowIndex]
                      ? `${groupedStudents[group][rowIndex][1]} ${groupedStudents[group][rowIndex][2]}`
                      : ""}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Groups;
