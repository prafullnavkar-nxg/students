import React, { useState, useEffect } from "react";
import Parse from "parse";
import "./App.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useGeoLocation } from "./useGeoLocation";

const PARSE_APPLICATION_ID = "TIYO6wjIN55gA47WdBG7iSROns8jhe798Pad7EdF";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
const PARSE_JAVASCRIPT_KEY = "Si8mPs6maxQE3IDN8QHb6LRLF2mP1dJ7tj8vKa6A";

Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

export const StudentData = () => {
  const [readResults, setReadResults] = useState([]);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentAge, setNewStudentAge] = useState("");
  //for geopoint
  const Location = useGeoLocation();

  //Array of Object

  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
//
  const [newStudentAddress, setNewStudentAddress] = useState("");
  const [newStudentZipcode, setnewStudentZipcode] = useState("");
  const [newStudentCity, setnewStudentCity] = useState("");
  const [newStudentState, setnewStudentState] = useState("");
  const [newStudentDateofJoin, setNewStudentDateofJoin]= useState("")
 
  //For fetching data automatically on page load
  useEffect(() => {
    readStudents();
  }, []);

  // For creating new Entry
  const createStudent = async function () {
    const newStudentEmailVaule = newStudentEmail;
    const newStudentAgeValue = Number(newStudentAge);

    //Array of Object
    const newStudentFirsNameValue = newStudentFirstName;
    const newStudentLastNameValue = newStudentLastName;
//
    const newStudentAddressvalue = newStudentAddress;
    const newstudentZipcodeValue = Number(newStudentZipcode);
    const newStudentCityValue = newStudentCity;
    const newStudentStateValue = newStudentState;
    const newStudentDateofJoinValue = new Date(newStudentDateofJoin);
//current position
    const geopoint = new Parse.GeoPoint(Location.coordinates?.lat, Location.coordinates?.lng);



    let Student = new Parse.Object("Student");
    Student.set("Name", {
      First_Name: newStudentFirsNameValue,
      Last_name: newStudentLastNameValue,
    });

    Student.set("Email", newStudentEmailVaule);
    Student.set("Age", newStudentAgeValue);
    Student.set("DateofJoin", newStudentDateofJoinValue)
    Student.set("done", true);
    Student.set("arrayofobject", [
      {
        AddressLine: newStudentAddressvalue,
        zipcode: newstudentZipcodeValue,
        city: newStudentCityValue,
        state: newStudentStateValue,
      },
    ]);
    Student.set("location", geopoint)
 
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

  //for reading data from db
  const readStudents = async function () {
    const parseQuery = new Parse.Query("Student");
    try {
      let students = await parseQuery.find();
      const studentsJsonArr = students.map((item) => ({
        id: item.id,
        // title: item.get("title"),
        Name: item.get("Name"),

        Email: item.get("Email"),
        Age: item.get("Age"),
        arrayofobject: item.get("arrayofobject"),
        done: item.get("done"),
        DateofJoin: item.get("DateofJoin"),
        DateofEnd: item.get("DateofEnd"),
        geopoint: item.get("location")
      }));

      setReadResults(studentsJsonArr);
      // console.log(studentsJsonArr)
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  //For activate and deactivate Data
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

  //For delte Data from db
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

  //for making columns in bootstrap table with buttons
  const columns = [
    // {
    //   dataField: "id",
    //   text: "student id",
    // },
    {
      dataField: "Name",
      text: "Name",
      formatter: function (item) {
        if (item) {
          return (
            item.First_Name + " " + item.Last_name );}},
    },
    {
      dataField: "Email",
      text: "Email",
    },
    {
      dataField: "Age",
      text: "Age",
    },
    {
      dataField: "arrayofobject",
      text: "AddressLine",

      // for showing array of object on ui in row
      formatter: function (item) {
        if (item) {
          return (
            item[0].AddressLine +
            ", " +
            item[0].city +
            ", " +
            item[0].state +
            ", " +
            item[0].zipcode +
            "."
          );
        }
      },
    },
    {
      dataField: "DateofJoin",
      text: "Date of Join",
      // filter: dateFilter()
      formatter: function (item) {
        if (item) {
          return (
            item + " " );}}
    },
    {
      dataField: "geopoint",
      text: "geopoint",
      // filter: dateFilter()
      formatter: function (item) {
        if (item) {
          return (
            item.latitude && item.longitude ? item.latitude + ", " + item.longitude : " ");}}
    },
    
    {
      dataField: "df2",
      isDummyField: true,
      text: "Action",
      formatter: (_, row) => {
        if (row.done) {
          return (
            <>
              <button
                id="button"
                onClick={() => deleteStudent(row.id)}
                className="remove_btn"
              >
                Delete
              </button>
              <button
                id="button"
                onClick={() => updateStudent(row.id, false)}
                className="update_btn1"
              >
                Deactivate
              </button>
            </>
          );
        }
        return (
          <>
            <button
              id="button"
              onClick={() => deleteStudent(row.id)}
              className="remove_btn"
            >
              Delete
            </button>
            <button
              id="button"
              onClick={() => updateStudent(row.id, true)}
              className="update_btn2"
            >
              Activate
            </button>
          </>
        );
      },
    },
  ];

  // const submit = (event) => {
  //   event.preventDefault();
  // }
  return (
    <>
     {/* <div>
            {
              location.loaded ? JSON.stringify(location): "location data is not available"
            }
          </div> */}
      <div>
        <div className="container">
          <h2 className="list_heading">Student Data</h2>
          <div className="flex_between"></div>
          <div className="card">
            <div className="card-body no-padding height-9">

              {/* Inputs */}
              <form className="form-inline" >
                <input
                  value={newStudentFirstName}
                  onChange={(event) =>
                    setNewStudentFirstName(event.target.value)
                  }
                  placeholder="First Name"
                  size="large"
                  required 
                />
                <input
                  value={newStudentLastName}
                  onChange={(event) =>
                    setNewStudentLastName(event.target.value)
                  }
                  placeholder="Last Name"
                  size="large"
                  required
                />

                <input
                  value={newStudentEmail}
                  onChange={(event) => setNewStudentEmail(event.target.value)}
                  placeholder="Student Email"
                  size="large"
                  required
                />

                <input
                  value={newStudentAge}
                  onChange={(event) => setNewStudentAge(event.target.value)}
                  placeholder="Student Age"
                  size="large"
                  required
                />

                <input
                  value={newStudentAddress}
                  onChange={(event) => setNewStudentAddress(event.target.value)}
                  placeholder="Student Address"
                  size="large"
                  required
                />
                <input
                  value={newStudentZipcode}
                  onChange={(event) => setnewStudentZipcode(event.target.value)}
                  placeholder="Student Zipcode"
                  size="large"
                  required
                />
                <input
                  value={newStudentCity}
                  onChange={(event) => setnewStudentCity(event.target.value)}
                  placeholder="Student City"
                  size="large"
                  required
                />
                <input
                  value={newStudentState}
                  onChange={(event) => setnewStudentState(event.target.value)}
                  placeholder="Student State"
                  size="large"
                  required
                />
                 <input
                  value={newStudentDateofJoin}
                  onChange={(event) => setNewStudentDateofJoin(event.target.value)}
                  placeholder="Date of Join (mm/dd/yyyy)"
                  size="large"
                  required
                />
              </form>
              <button type="submit" onClick={createStudent} className="add_btn">
                Add
              </button>
            </div>
          </div>
          {/* Bootstrap table */}
          <div className="card">
            <BootstrapTable
              keyField="id"
              data={readResults}
              columns={columns}
              striped
              hover
              condensed
              pagination={paginationFactory()}
            />
          </div>
        </div>
      </div>
    </>
  );
};


