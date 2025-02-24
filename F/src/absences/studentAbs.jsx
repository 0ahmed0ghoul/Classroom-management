import React, { useEffect, useState } from "react";
import "../styles/table.css";
import "../styles/smodal.css";
import { useParams } from "react-router-dom";

const StudentAbs = () => {
  const {id} = useParams()



  return (
    <div className="table-container">
      <h1>Student number {id} Absences</h1>
    </div>
  );
};

export default StudentAbs;
