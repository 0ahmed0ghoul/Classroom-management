import { useState } from "react";
import "./styles/table.css";
import AddAttend from "./Modals/addAttend"; // Ensure the path is correct

const AttendModal = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Student code</th>
            <th>Classroom code</th>
            <th>Teacher ID</th>
            <th>Module ID</th>
            <th>Type Module ID</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th style={{ width: "200px" }}>Options</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
};

export default AttendModal;
