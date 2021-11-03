import React, { useState } from "react";
import Parse from "parse/dist/parse.min.js";
import "./App.css";
import { Button, Input, List } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";

const PARSE_APPLICATIION_ID = "QNRm8MgB7Qi1DjAD0Rw6qtjXLnTZ1fa7JGWBknS8";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
const PARSE_JAVASCRIPT_KEY = "U8VhPQ0CNgBF16PmcvNvjZFJv33mXw7gjJfvHQJm";

Parse.initialize(PARSE_APPLICATIION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

export const StudentData = () => {
  const [readResults, setReadResults] = useState([]);
  const [newStudentTitle, setNewStudentTitle] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentAge, setNewStudentAge] = useState("");

  const createStudent = async function () {
    const newStudentTitleValue = newStudentTitle;
    const newStudentEmailVaule = newStudentEmail;
    const newStudentAgeValue = Number(newStudentAge);

    let Student = new Parse.Object("Student");
    Student.set("title", newStudentTitleValue);
    Student.set("Email", newStudentEmailVaule);
    Student.set("Age", newStudentAgeValue);
    Student.set("done", false);

    try {
      await Student.save();

      alert("Success! Student Data created!");

      readStudents();
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  const readStudents = async function () {
    const parseQuery = new Parse.Query("Student");
    try {
      let students = await parseQuery.find();

      setReadResults(students);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  const updateStudent = async function (studentId, done) {
    let Student = new Parse.Object("Student");
    Student.set("objectId", studentId);
    

    Student.set("done", done);
    try {
      await Student.save();

      alert("Success! Student updated!");

      readStudents();
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  const deleteStudent = async function (studentId) {
    let Student = new Parse.Object("Student");
    Student.set("objectId", studentId);

    try {
      await Student.destroy();
      alert("Success! Student Data deleted!");

      readStudents();
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  return (
    <div>
      <div className="container">
        <h2 className="list_heading">Student Data</h2>
        {/* student read (refresh) button */}
        <Button onClick={readStudents} icon={<RedoOutlined />}></Button>

        {/* Student create text input */}
        <Input
          value={newStudentTitle}
          onChange={(event) => setNewStudentTitle(event.target.value)}
          placeholder="Student Name"
          size="large"
        />
        <Input
          value={newStudentEmail}
          onChange={(event) => setNewStudentEmail(event.target.value)}
          placeholder="Student Email"
          size="large"
        />
        <Input
          value={newStudentAge}
          onChange={(event) => setNewStudentAge(event.target.value)}
          placeholder="Student Age"
          size="large"
        />
        {/* Student create button */}
        <Button onClick={createStudent} icon={<PlusOutlined />}>
          Add
        </Button>

        <div>
          {/* Student read results list */}
          {readResults !== null &&
            readResults !== undefined &&
            readResults.length > 0 && (
              <List
                dataSource={readResults}
                renderItem={(item) => (
                  <List.Item className="student_List">
                    <p
                      className={
                        item.get("done") === true
                          ? "student_text_done"
                          : "student_text"
                      }
                    >
                      {item.get("title")} <br/>
                      {item.get('Email')} <br/>
                      {item.get('Age')} 
                    </p>

                    {/* Student update button */}
                    {item.get("done") !== true && (
                      <Button
                        onClick={() => updateStudent(item.id, true)}
                        icon={
                          <CheckOutlined className="student_button_icon_done" />
                        }
                      ></Button> 
                    )}
                    {/* student delete button */}
                    <Button
                      onClick={() => deleteStudent(item.id)}
                      icon={
                        <CloseOutlined className="student_button_icon_remove" />
                      }
                    ></Button>
                    <hr/>
                  </List.Item>
                )}
              />
            )}
        </div>
      </div>
    </div>
  );
};
