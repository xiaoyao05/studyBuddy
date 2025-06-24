import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import httpClient from '../httpClient';
import TopNav from "./TopNav";
import "./CreateGroup.css";

const CreateGroupPage = () => {
  const [newGroup, setNewGroup] = useState({
    name: "",
    maxPax: 10,
    location: "",
    date: new Date(),
    startTime: new Date(new Date().setHours(12, 0, 0, 0)),
    endTime: new Date(new Date().setHours(13, 0, 0, 0)),
    description: "",
    module: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    maxPax: false,
    location: false,
    date: false,
    startTime: false,
    endTime: false,
    description: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpClient.get("/api/@me");
        console.log("check");
        console.log(resp.data);

      } catch (error) {
        alert("Not authenticated");
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleDateChange = (date) => {
    const updatedDate = new Date(date);

    const updatedStartTime = new Date(newGroup.startTime);
    updatedStartTime.setFullYear(updatedDate.getFullYear());
    updatedStartTime.setMonth(updatedDate.getMonth());
    updatedStartTime.setDate(updatedDate.getDate());

    const updatedEndTime = new Date(newGroup.endTime);
    updatedEndTime.setFullYear(updatedDate.getFullYear());
    updatedEndTime.setMonth(updatedDate.getMonth());
    updatedEndTime.setDate(updatedDate.getDate());

    setNewGroup((prev) => ({
      ...prev,
      date: updatedDate,
      startTime: updatedStartTime,
      endTime: updatedEndTime,
    }));

    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: false }));
    }
  };

  const handleStartTimeChange = (time) => {
    const newStartTime = new Date(time);
    newStartTime.setFullYear(newGroup.date.getFullYear());
    newStartTime.setMonth(newGroup.date.getMonth());
    newStartTime.setDate(newGroup.date.getDate());

    let adjustedEndTime = newGroup.endTime;
    if (!adjustedEndTime || adjustedEndTime <= newStartTime) {
      adjustedEndTime = new Date(newStartTime);
      adjustedEndTime.setHours(adjustedEndTime.getHours() + 1);
    } else {
      adjustedEndTime.setFullYear(newGroup.date.getFullYear());
      adjustedEndTime.setMonth(newGroup.date.getMonth());
      adjustedEndTime.setDate(newGroup.date.getDate());
    }

    setNewGroup((prev) => ({
      ...prev,
      startTime: newStartTime,
      endTime: adjustedEndTime,
    }));

    if (errors.startTime) {
      setErrors((prev) => ({ ...prev, startTime: false }));
    }
  };

  const handleEndTimeChange = (time) => {
    const newEndTime = new Date(time);
    newEndTime.setFullYear(newGroup.date.getFullYear());
    newEndTime.setMonth(newGroup.date.getMonth());
    newEndTime.setDate(newGroup.date.getDate());

    if (newEndTime <= newGroup.startTime) {
      const adjustedEndTime = new Date(newGroup.startTime);
      adjustedEndTime.setHours(adjustedEndTime.getHours() + 1);
      setNewGroup((prev) => ({ ...prev, endTime: adjustedEndTime }));
    } else {
      setNewGroup((prev) => ({ ...prev, endTime: newEndTime }));
    }

    if (errors.endTime) {
      setErrors((prev) => ({ ...prev, endTime: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !newGroup.name.trim(),
      maxPax: !newGroup.maxPax || newGroup.maxPax < 2,
      location: !newGroup.location.trim(),
      date: !newGroup.date,
      startTime: !newGroup.startTime,
      endTime: !newGroup.endTime || newGroup.endTime <= newGroup.startTime,
      description: !newGroup.description.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const eventData = {
        ...newGroup,
        startTime: newGroup.startTime.toISOString(),
        endTime: newGroup.endTime.toISOString(),
        date: newGroup.date.toISOString().split("T")[0],
      };

      console.log("Group created:", eventData);

      setNewGroup({
        name: "",
        maxPax: 10,
        location: "",
        date: new Date(),
        startTime: new Date(new Date().setHours(12, 0, 0, 0)),
        endTime: new Date(new Date().setHours(13, 0, 0, 0)),
        description: "",
        module: "",
      });

      try{
        const resp = await httpClient.post("/api/create-session", {
          ...eventData
        });
        navigate('/home');
        alert('Session created successfully!');
      } catch (error) {
        alert(error.response?.data?.error);
      }

    } else {
      alert("Please fill in all required fields correctly");
    }
  };

  const getMinTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getMaxTime = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  return (
    <div className="create-group-page">
      <TopNav />
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        ← Back
      </button>
      <h1>Create New Group</h1>
      <form onSubmit={handleSubmit} className="group-form" noValidate>
        <div className="form-grid">
          <div className={`form-group ${errors.name ? "error" : ""}`}>
            <label>Group Name: *</label>
            <input
              type="text"
              name="name"
              value={newGroup.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && (
              <span className="error-message">Group name is required</span>
            )}
          </div>

          <div className={`form-group ${errors.maxPax ? "error" : ""}`}>
            <label>Maximum Participants: *</label>
            <input
              type="number"
              name="maxPax"
              min="2"
              max="100"
              value={newGroup.maxPax}
              onChange={handleInputChange}
              required
            />
            {errors.maxPax && (
              <span className="error-message">
                Minimum 2 participants required
              </span>
            )}
          </div>

          <div className={`form-group ${errors.location ? "error" : ""}`}>
            <label>Location: *</label>
            <input
              type="text"
              name="location"
              value={newGroup.location}
              onChange={handleInputChange}
              required
            />
            {errors.location && (
              <span className="error-message">Location is required</span>
            )}
          </div>

          <div className={`form-group ${errors.date ? "error" : ""}`}>
            <label>Date: *</label>
            <DatePicker
              selected={newGroup.date}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              required
            />
            {errors.date && (
              <span className="error-message">Please select a date</span>
            )}
          </div>

          <div className={`form-group ${errors.startTime ? "error" : ""}`}>
            <label>Start Time: *</label>
            <DatePicker
              selected={newGroup.startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start"
              dateFormat="h:mm aa"
              minTime={getMinTime(newGroup.date)}
              maxTime={getMaxTime(newGroup.date)}
              required
            />
            {errors.startTime && (
              <span className="error-message">
                Please select a valid start time
              </span>
            )}
          </div>

          <div className={`form-group ${errors.endTime ? "error" : ""}`}>
            <label>End Time: *</label>
            <DatePicker
              selected={newGroup.endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End"
              dateFormat="h:mm aa"
              minTime={newGroup.startTime}
              maxTime={getMaxTime(newGroup.date)}
              required
            />
            {errors.endTime && (
              <span className="error-message">
                {newGroup.endTime <= newGroup.startTime
                  ? "End time must be after start time"
                  : "Please select an end time"}
              </span>
            )}
          </div>

          <div className={`form-group ${errors.description ? "error" : ""}`}>
            <label>Description: *</label>
            <textarea
              name="description"
              value={newGroup.description}
              onChange={handleInputChange}
              required
            />
            {errors.description && (
              <span className="error-message">Description is required</span>
            )}
          </div>

          <div className="form-group">
            <label>Module (optional):</label>
            <input
              type="text"
              name="module"
              value={newGroup.module}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroupPage;
