import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./styles/table.css";
import "./styles/admin.css";

import Teachers from "./teachers";
import Students from "./Students";
import Modules from "./modules";
import Attend from "./attend";
import Groups from "./groups";
import Classrooms from "./classrooms";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Attend");
  const renderContent = () => {
    switch (activeTab) {
      case "Attend":return <Attend/>;
      case "teachers":return <Teachers/>;
      case "students":return <Students/>;
      case "groups":return <Groups/>;
      case "modules":return <Modules/>;
      case "classrooms":return <Classrooms/>;

      default:return null;
    }
  };
  return (
    <div>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>
      <div className="tabs">
      <button
          onClick={() => setActiveTab("Attend")}
          className={activeTab === "Attend" ? "active" : ""}
        >
          Attend
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={activeTab === "teachers" ? "active" : ""}
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={activeTab === "students" ? "active" : ""}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={activeTab === "groups" ? "active" : ""}
        >
          Groups
        </button>
        <button
          onClick={() => setActiveTab("modules")}
          className={activeTab === "modules" ? "active" : ""}
        >
          Modules
        </button>
        <button
          onClick={() => setActiveTab("classrooms")}
          className={activeTab === "classrooms" ? "active" : ""}
        >
          Classrooms
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Admin;
