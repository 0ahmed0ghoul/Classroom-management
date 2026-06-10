import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./AdminPage";
import StudentAbs from "./absences/StudentAbs";
import AllStudents from "./Modals/Allstudents";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />} />
      <Route path="/attend/allstudents" element={<AllStudents />} />
      <Route path="/admin/student/:id/absences" element={<StudentAbs />} />
      <Route path="/admin/module/:id/types" element={<StudentAbs />} />
      <Route path="/admin/teacher/:id/absences" element={<StudentAbs />} />

       
    </Routes>
  );
}
export default App;
