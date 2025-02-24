import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./admin";
import StudentAbs from "./absences/studentAbs";
import AllStudents from "./Modals/AllStudents";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
      <Route path="/attend/allstudents" element={<AllStudents />} />
      <Route path="/admin/student/:id/absences" element={<StudentAbs />} />
      <Route path="/admin/module/:id/types" element={<StudentAbs />} />
      <Route path="/admin/teacher/:id/absences" element={<StudentAbs />} />

       
    </Routes>
  );
}
export default App;
