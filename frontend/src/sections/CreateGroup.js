import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateGroupPage = () => {
  const [newGroup, setNewGroup] = useState({
    name: '',
    maxPax: 10,
    location: '',
    date: new Date(),
    startTime: new Date(new Date().setHours(12, 0, 0, 0)), // Default to 12:00 PM
    endTime: new Date(new Date().setHours(13, 0, 0, 0)),   // Default to 1:00 PM
    description: '',
    module: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    maxPax: false,
    location: false,
    date: false,
    startTime: false,
    endTime: false,
    description: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleDateChange = (date) => {
    // Update both date and times to maintain the same date
    const updatedDate = new Date(date);
    const updatedStartTime = new Date(newGroup.startTime);
    updatedStartTime.setFullYear(updatedDate.getFullYear());
    updatedStartTime.setMonth(updatedDate.getMonth());
    updatedStartTime.setDate(updatedDate.getDate());
    
    const updatedEndTime = new Date(newGroup.endTime);
    updatedEndTime.setFullYear(updatedDate.getFullYear());
    updatedEndTime.setMonth(updatedDate.getMonth());
    updatedEndTime.setDate(updatedDate.getDate());
    
    setNewGroup(prev => ({ 
      ...prev, 
      date: updatedDate,
      startTime: updatedStartTime,
      endTime: updatedEndTime
    }));
    
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: false }));
    }
  };

  const handleStartTimeChange = (time) => {
    const newStartTime = new Date(time);
    setNewGroup(prev => ({ 
      ...prev, 
      startTime: newStartTime 
    }));
    
    // Validate if end time is after start time
    if (newStartTime >= newGroup.endTime) {
      const newEndTime = new Date(newStartTime);
      newEndTime.setHours(newStartTime.getHours() + 1);
      setNewGroup(prev => ({ ...prev, endTime: newEndTime }));
    }
    
    if (errors.startTime) {
      setErrors(prev => ({ ...prev, startTime: false }));
    }
  };

  const handleEndTimeChange = (time) => {
    const newEndTime = new Date(time);
    setNewGroup(prev => ({ 
      ...prev, 
      endTime: newEndTime 
    }));
    
    if (errors.endTime) {
      setErrors(prev => ({ ...prev, endTime: false }));
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
      description: !newGroup.description.trim()
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Combine date and times for the final datetime object
      const eventData = {
        ...newGroup,
        datetime: {
          date: newGroup.date,
          startTime: newGroup.startTime,
          endTime: newGroup.endTime
        }
      };
      
      // Here you would typically send the data to your backend
      console.log('Group created:', eventData);
      alert('Group created successfully!');
      
      // Reset form after submission
      setNewGroup({
        name: '',
        maxPax: 10,
        location: '',
        date: new Date(),
        startTime: new Date(new Date().setHours(12, 0, 0, 0)),
        endTime: new Date(new Date().setHours(13, 0, 0, 0)),
        description: '',
        module: ''
      });
    } else {
      alert('Please fill in all required fields correctly');
    }
  };

  return (
    <div className="create-group-page">
      <h1>Create New Group</h1>
      
      <form onSubmit={handleSubmit} className="group-form" noValidate>
        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label>Group Name: *</label>
          <input
            type="text"
            name="name"
            value={newGroup.name}
            onChange={handleInputChange}
            required
          />
          {errors.name && <span className="error-message">Group name is required</span>}
        </div>

        <div className={`form-group ${errors.maxPax ? 'error' : ''}`}>
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
          {errors.maxPax && <span className="error-message">Minimum 2 participants required</span>}
        </div>

        <div className={`form-group ${errors.location ? 'error' : ''}`}>
          <label>Location: *</label>
          <input
            type="text"
            name="location"
            value={newGroup.location}
            onChange={handleInputChange}
            required
          />
          {errors.location && <span className="error-message">Location is required</span>}
        </div>

        <div className="datetime-fields">
          <div className={`form-group ${errors.date ? 'error' : ''}`}>
            <label>Date: *</label>
            <DatePicker
              selected={newGroup.date}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              required
            />
            {errors.date && <span className="error-message">Please select a date</span>}
          </div>

          <div className={`form-group ${errors.startTime ? 'error' : ''}`}>
            <label>Start Time: *</label>
            <DatePicker
              selected={newGroup.startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              required
            />
            {errors.startTime && <span className="error-message">Please select a start time</span>}
          </div>

          <div className={`form-group ${errors.endTime ? 'error' : ''}`}>
            <label>End Time: *</label>
            <DatePicker
              selected={newGroup.endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              minTime={newGroup.startTime}
              maxTime={new Date(newGroup.startTime.getTime() + 12 * 60 * 60 * 1000)} // Max 12 hours after start
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
        </div>

        <div className={`form-group ${errors.description ? 'error' : ''}`}>
          <label>Description: *</label>
          <textarea
            name="description"
            value={newGroup.description}
            onChange={handleInputChange}
            required
          />
          {errors.description && <span className="error-message">Description is required</span>}
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

        <button type="submit" className="submit-btn">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroupPage;