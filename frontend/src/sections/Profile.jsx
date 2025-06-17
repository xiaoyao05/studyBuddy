import React, { useState } from 'react';

const StudentProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    course: '',
    year: '',
    gender: '',
    teleHandle: ''
  });

  const courseOptions = [
    'Accountancy',
    'Accountancy (Sustainability Management and Analytics)',
    'Aerospace Engineering',
    'Applied Computing in Finance',
    'Art, Design and Media',
    'Artificial Intelligence and Society',
    'Bioengineering',
    'Biological Sciences',
    'Business',
    'Chemical and Biomolecular Engineering',
    'Chemistry and Biological Chemistry',
    'Chinese',
    'Chinese Medicine',
    'Civil Engineering',
    'Communication Studies',
    'Computer Engineering',
    'Computer Science', 
    'Computing',
    '​Data Science and Artificial  Intelligence',
    'Economics',
    'Economics and Data Science',
    'Electrical and Electronic Engineering',
    'English',
    'Environmental Earth Systems Science',
    'Environmental Engineering',
    'History',
    'Information Engineering and Media',
    'Linguistics and Multilingual Studies',
    'Maritime Studies',
    'Materials Engineering',
    'Mathematical Sciences',
    'Mechanical Engineering',
    'Medicine',
    'Physics and Applied Physics',
    '​Philosophy',
    'Philosophy, Politics, and Economics',
    'Psychology',
    'Public Policy and Global  Affairs',
    'Robotics',
    'Sociology',
    'Biological Sciences and Psychology',
    'Biomedical Sciences and BioBusiness',
    'Chinese and English',
    'Chinese and Linguistics and Multilingual Studies',
    'Economics and Media Analytics',
    '​Economics and Psychology',
    '​Economics and Public Policy and Global Affairs',
    'English and History',
    'English and Philosophy',
    '​English Literature and Art History',
    'Environmental Earth Systems  Science and Public Policy and Global Affairs',
    'History and Chinese',
    'History and Linguistics and Multilingual Studies',
    'Linguistics and Multilingual Studies and English',
    'Linguistics and Multilingual Studies and Philosophy',
    '​Mathematical and Computer Sciences',
    'Mathematical Sciences and Economics',
    'Philosophy and Chinese',
    'Philosophy and History',
    '​Physics and Mathematical Sciences',
    'Process Engineering and Synthetic Chemistry',
    'Psychology and Media Analytics',
    'Psychology and Linguistics and Multilingual Studies',
    'Accountancy and Business',
    'Accountancy and Data Science and Artificial Intelligence',
    'Business and Computing',
    'Business and Computer Engineering',
    'Computer Science and Economics',
    'Engineering+ and Economics'
  ];

  const yearOptions = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5+'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile submitted:', profile);
    setEditMode(false);
    alert('Profile saved successfully!');
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="profile-container">
      <h1>Student Profile</h1>

      {!editMode ? (
        <div className="profile-view">
          <div className="profile-details">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Course:</strong> {profile.course || 'Not selected'}</p>
            <p><strong>Year:</strong> {profile.year || 'Not selected'}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Telegram Handle:</strong> {profile.teleHandle ? `@${profile.teleHandle}` : 'Not provided'}</p>
          </div>
          <button onClick={handleEdit} className="edit-btn">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Read-Only Name */}
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              readOnly
            />
          </div>

          {/* Read-Only Email */}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
            />
          </div>

          {/* Editable Course */}
          <div className="form-group">
            <label>Course:</label>
            <select
              name="course"
              value={profile.course}
              onChange={handleChange}
              required
            >
              <option value="">Select your course</option>
              {courseOptions.map((course, index) => (
                <option key={`course-${index}`} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {/* Editable Year */}
          <div className="form-group">
            <label>Year:</label>
            <select
              name="year"
              value={profile.year}
              onChange={handleChange}
              required
            >
              <option value="">Select your year</option>
              {yearOptions.map((year, index) => (
                <option key={`year-${index}`} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Read-Only Gender */}
          <div className="form-group">
            <label>Gender:</label>
            <input
              type="text"
              name="gender"
              value={profile.gender}
              readOnly
            />
          </div>

          {/* Editable Telegram Handle */}
          <div className="form-group">
            <label>Telegram Handle:</label>
            <div className="tele-input">
              <span className="handle-prefix">@</span>
              <input
                type="text"
                name="teleHandle"
                value={profile.teleHandle}
                onChange={handleChange}
                placeholder="username"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentProfile;
