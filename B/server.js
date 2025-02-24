import oracledb from "oracledb";
import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
// Initialize Oracle client with the path to the Instant Client
oracledb.initOracleClient({ libDir: "C:\\instantclient_23_6" });

let connection;

const initializeDbConnection = async() => {
    try {
        connection = await oracledb.getConnection({
            user: "GA", // Oracle username
            password: "1234", // Oracle password
            connectString: "192.168.43.202:1521/XE",
        });
        console.log("Successfully connected to Oracle Database");
    } catch (err) {
        // Log any errors if connection fails
        console.error("Error connecting to Oracle Database: ", err);
    }
};
initializeDbConnection();

const query = async(sql, params = [], options = {}) => {
    if (!connection) {
        console.error("No database connection available.");
        throw new Error("Database connection is not initialized.");
    }
    try {
        // Ensure outFormat and other options are passed in correctly
        const queryOptions = {
            autoCommit: options.autoCommit || false, // Default to false unless explicitly set
            outFormat: options.outFormat || oracledb.ARRAY, // Default to ARRAY if no outFormat is set
            ...options, // Merge other provided options
        };

        // Execute the query with proper options
        const result = await connection.execute(sql, params, queryOptions);
        console.log("result ", result);
        // Return rows from the query result
        return result.rows;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};
//Attend
app.get("/admin/get-attend", async(req, res) => {
    try {
        const attends = await query("SELECT * FROM attend");
        res.json({ attends: attends });
    } catch (error) {
        console.error("Error getting attends:", error);
        res.status(500).json({ message: "Error getting attends" });
    }
});
app.post("/admin/add-attend", async(req, res) => {
    const {
        code_s,
        code_c,
        idt,
        idm,
        idtm, // This will be passed as a string, and we're going to retrieve it from the database
        day,
        time_start,
        time_end,
        session_num,
        group_num,
    } = req.body;

    console.log("Received Data: ", req.body);
    console.log("Formatted Time Start:", time_start);
    console.log("Formatted Time End:", time_end);

    try {
        // Correct query to get the idtm from the database
        const [idResult] = await query(
            "SELECT id FROM typemodule WHERE namet = :idtm and idmodel = :idm", {
                idtm,
                idm,
            }
        );

        // Check if module type was found
        if (!idResult || !idResult[0]) {
            return res.status(404).json({ message: "Module type not found" });
        }

        // Get idtm value from the result
        console.log(idResult);
        const idtmValue = idResult[0];

        // SQL query to insert data
        const sql = `
            INSERT INTO attend 
            (code_s, code_c, idt, idm, idtm, day, time_start, time_end, session_num, group_num) 
            VALUES 
            (:code_s, :code_c, :idt, :idm, :idtm, :day, 
            TO_TIMESTAMP(:time_start, 'YYYY-MM-DD HH24:MI:SS'),
            TO_TIMESTAMP(:time_end, 'YYYY-MM-DD HH24:MI:SS'),
            :session_num, :group_num)
        `;

        // Parameters to insert into the database
        const params = {
            code_s: JSON.stringify(code_s), // Ensure code_s is sent as a JSON string
            code_c,
            idt,
            idm,
            idtm: idtmValue, // Use the retrieved idtm value here
            day,
            time_start,
            time_end,
            session_num,
            group_num,
        };

        console.log("Inserting with params:", params);

        // Execute the query
        await query(sql, params);
        await query("COMMIT");

        res.status(201).json({
            message: "Attend added successfully",
        });
    } catch (error) {
        console.error("Error adding attend:", error.message);
        res.status(500).json({ message: "Error adding attend" });
    }
});

//Student
app.get("/admin/get-students", async(req, res) => {
    try {
        const students = await query("SELECT * FROM student");
        res.json({ students: students });
    } catch (error) {
        console.error("Error getting students:", error);
        res.status(500).json({ message: "Error getting students" });
    }
});
app.post("/admin/add-student", async(req, res) => {
    const { firstName, lastName, levele, speciality, groupe } = req.body;
    const sql = `
                INSERT INTO student(code_s, fname, lname, levele, speciality, groupe) VALUES(student_seq.NEXTVAL,: firstName,: lastName,: levele,: speciality,: groupe)
                `;
    const params = { firstName, lastName, levele, speciality, groupe };
    try {
        await query(sql, params);
        await query("COMMIT");

        res.status(201).json({
            message: "Student added successfully",
        });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Error adding student" });
    }
});
app.get("/admin/student/:id/attendance", async(req, res) => {
    const { id } = req.params;
    const studentId = Number(id);

    if (isNaN(studentId)) {
        return res.status(400).json({ message: "Invalid student ID" });
    }

    try {
        const groups = await query(`
                SELECT A.code_s, A.GROUP_NUM
                FROM attend A
                JOIN student S ON S.GROUPE = A.GROUP_NUM `);

        // Debugging the entire groups response
        console.log("Groups:", groups);

        let totalSessions = 0;
        let attendedSessions = 0;

        // Iterate through each group to calculate attendance
        groups.forEach((record) => {
            // Debugging each record in the groups array
            console.log("Record:", record);

            if (typeof record[0] !== "string" || record[0].length < 2) {
                console.log("Skipping invalid code_s:", record[0]);
                return; // Skip invalid records
            }

            // Parse the code_s string to an array of student IDs
            const studentIds = JSON.parse(record[0]);

            // Debugging the parsed student IDs
            console.log("Parsed Student IDs:", studentIds);

            // Check if the current studentId is in the parsed list
            if (studentIds.includes(studentId)) {
                attendedSessions++;
                console.log("Attended sessions:", attendedSessions);
            }

            totalSessions++;
            console.log("Total sessions:", totalSessions);
        });

        const attendanceRate =
            totalSessions > 0 ?
            ((attendedSessions / totalSessions) * 100).toFixed(2) :
            0;

        // Debugging the final attendance rate
        console.log("Attendance Rate:", attendanceRate);

        res.json({ attendanceRate: attendanceRate });
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        res.status(500).json({ message: "Error getting attendance data" });
    }
});
app.put("/admin/edit-student/:id", async(req, res) => {
    const { firstName, lastName, levele, speciality, groupe } = req.body;
    const { id } = req.params;
    const sql = `
                UPDATE student
                SET fname =: firstName,
                    lname =: lastName,
                    levele =: levele,
                    speciality =: speciality,
                    groupe =: groupe
                WHERE code_s =: id `;

    try {
        await query(sql, [firstName, lastName, levele, speciality, groupe, id]);
        await query("COMMIT");
        res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating student" });
    }
});
app.delete("/admin/delete-student/:id", async(req, res) => {
    const { id } = req.params;

    const sql = `
                DELETE FROM student WHERE code_s =: id `;
    const params = { id };

    try {
        await query(sql, params);
        await query("COMMIT");
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
});
//Teacher
app.get("/admin/get-teachers", async(req, res) => {
    try {
        const teachers = await query("SELECT * FROM teacher");
        res.json({ teachers: teachers });
    } catch (error) {
        console.error("Error getting teachers:", error);
        res.status(500).json({ message: "Error getting teachers" });
    }
});
app.post("/admin/add-teacher", async(req, res) => {
    const { name, grade, module, typemodule } = req.body;

    // Convert the array to a comma-separated string
    const typeModuleString = typemodule.join(",");

    // Correctly use the same name in SQL and the parameter object
    const sql = `
                INSERT INTO teacher(IDT, NAME, TEACHER_G, TMODULE, TTYPEMODULE)
                VALUES(teacher_seq.NEXTVAL,: name,: grade,: module,: typemodule)
                `;

    try {
        // Use consistent naming here
        await query(sql, { name, grade, module, typemodule: typeModuleString });
        await query("COMMIT");
        res.status(201).json({ message: "Teacher added successfully" });
    } catch (error) {
        console.error("Error adding teacher:", error);
        res.status(500).json({ message: "Error adding teacher" });
    }
});
app.put("/admin/edit-teacher/:id", async(req, res) => {
    const { name, grade, module, typemodule } = req.body;
    const { id } = req.params;
    const typeModuleString = typemodule.join(",");

    const sql =
        "UPDATE teacher SET name = :name, teacher_g = :grade , Tmodule = :module ,TTYPEMODULE=:typemodule     WHERE idt = :id";

    try {
        await query(sql, { name, grade, id, module, typemodule: typeModuleString });
        await query("COMMIT");

        res.status(200).json({ message: "Teacher updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating teacher" });
    }
});
app.delete("/admin/delete-teacher/:id", async(req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM teacher WHERE idt = :id";
    const params = [id];

    try {
        await query(sql, params);
        await query("COMMIT");
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting teacher" });
    }
});

app.post("/admin/teacher-attendance", async(req, res) => {
    try {
        const { teacherId, startDate, weeklySessions } = req.body;

        if (!teacherId || !startDate || !weeklySessions) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        console.log("teacherId:", teacherId);
        console.log("startDate:", startDate);
        console.log("weeklySessions:", weeklySessions);

        // Query to count sessions within the given week
        const result = await query(
            `
            SELECT COUNT(*) AS session_count
            FROM attend
            WHERE IDT = :1
            AND TIME_START BETWEEN TO_DATE(:2, 'YYYY-MM-DD') 
            AND TO_DATE(:2, 'YYYY-MM-DD') + INTERVAL '7' DAY
            `, [teacherId, startDate]
        );


        // Extract result correctly
        const attendedSessions =
            result.length > 0 && result[0].length > 0 ? result[0][0] : 0;
        const attendanceRate = ((attendedSessions / weeklySessions) * 100).toFixed(
            2
        );

        console.log("Query result:", result);
        console.log("Sessions counted:", attendedSessions);
        console.log("Weekly sessions:", weeklySessions);

        res.json({ attendanceRate });
    } catch (error) {
        console.error("Error fetching attendance rate:", error);
        res.status(500).json({ message: "Server error" });
    }
});
//Modules
app.get("/admin/get-modules", async(req, res) => {
    try {
        // Call the query function with outFormat specified in the options
        const modules = await query(
            `
                        SELECT IDM,
                        NAME,
                        LEVELE,
                        SEMESTER,
                        NAMET FROM module JOIN typemodule ON IDM = IDMODEL `, [], { outFormat: oracledb.OBJECT }
        ); // Correctly pass outFormat in options

        // Now modules is an array of objects, so you can send it directly in the response
        res.json({ result: modules });
    } catch (error) {
        console.error("Error getting modules:", error);
        res.status(500).json({ message: "Error getting modules" }); // Return a 500 status code on error
    }
});
app.post("/admin/add-module", async(req, res) => {
    const { name, levele, semester, types } = req.body;

    const sql = `
                        INSERT INTO module(idm, name, levele, semester) VALUES(module_seq.NEXTVAL,: name,: levele,: semester)
                        `;

    let MID;

    try {
        await query(sql, [name, levele, semester]);
        const selectIdSql = `
                        SELECT module_seq.CURRVAL AS idm FROM dual `;
        const result = await query(selectIdSql);
        MID = result[0][0];
        if (!MID) {
            throw new Error("Failed to retrieve module ID.");
        }
        if (types && types.length > 0) {
            for (let element of types) {
                const sql2 = `
                        INSERT INTO typemodule(id, idmodel, namet) VALUES(typemodule_seq.NEXTVAL,: idmodel,: namet)
                        `;
                await query(sql2, { idmodel: MID, namet: element });
                await query("COMMIT");
            }
        }
        res.status(201).json({ message: "Module and types added successfully" });
    } catch (error) {
        console.error("Error adding module or types:", error);
        res.status(500).json({ message: "Error adding module or types" });
    }
});
app.delete("/admin/delete-module/:id", async(req, res) => {
    const { id } = req.params;
    const deleteTypemoduleSQL = "DELETE FROM typemodule WHERE idmodel = :id";
    const deleteModuleSQL = "DELETE FROM module WHERE idm = :id";

    try {
        // Execute queries separately
        await query(deleteTypemoduleSQL, { id }, { autoCommit: false });
        await query(deleteModuleSQL, { id }, { autoCommit: false });

        // Commit the transaction
        await connection.commit();

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        // Rollback if any error occurs
        await connection.rollback();
        console.error("Error executing delete operation:", error);
        res.status(500).json({ message: "Error deleting module" });
    }
});

//Classrooms
app.get("/admin/get-classrooms", async(req, res) => {
    try {
        const classrooms = await query("SELECT * FROM classroom"); // Use await for the query
        res.json({ result: classrooms }); // Send the result in response
    } catch (error) {
        console.error("Error getting modules:", error);
        res.status(500).json({ message: "Error getting modules" }); // Return a 500 status code on error
    }
});
app.post("/admin/add-classroom", async(req, res) => {
    const { name } = req.body;
    const sql = `
                        INSERT INTO classroom(CODE_C, type, capacity) VALUES(: name,: type,: capacity)
                        `;
    try {
        await query(sql, { name, type: "Cours,TD,TP", capacity: 60 });
        await query("COMMIT");

        res.status(201).json({ message: "Module added successfully" });
    } catch (error) {
        console.error("Error adding module:", error);
        res.status(500).json({ message: "Error adding module" });
    }
});
app.delete("/admin/delete-classroom/:id", async(req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM classroom WHERE code_c = :id";
    const params = [id];

    try {
        await query(sql, params);
        await query("COMMIT");

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting module" });
    }
});
app.listen(8081, () =>
    console.log("Server running on : http://localhost:8081")
);