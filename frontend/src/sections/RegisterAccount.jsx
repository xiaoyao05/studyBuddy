import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from "../httpClient";
import "./RegisterAccount.css";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    year: '',
    gender: '',
    telegramHandle: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const courseInputRef = useRef(null);
  const courseDropdownRef = useRef(null);

  // Available options
  const courses = [
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

  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5+'];
  const genders = ['Male', 'Female'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (courseInputRef.current && !courseInputRef.current.contains(event.target) &&
          courseDropdownRef.current && !courseDropdownRef.current.contains(event.target)) {
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@(e\.)?ntu\.edu\.sg$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    const telegramRegex = /^[a-zA-Z0-9_]{5,}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with letters and numbers';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.telegramHandle) {
    newErrors.telegramHandle = 'Telegram handle is required';
  } else if (!telegramRegex.test(formData.telegramHandle)) {
    newErrors.telegramHandle = 'Please enter a valid Telegram handle';
  }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(errors);
    if (validateForm()) {
      console.log('Profile data:', formData);
      // post reqeust to create new student
      try {
        const resp = await httpClient.post("/api/register", {
          ...formData
        });
        navigate('/home');
        alert('Profile setup completed successfully!');
      } catch (error) {
        console.log("wrong");
        if (error.response?.status === 401) {
          alert("Invalid credentials");
        } else {
          alert(error.response?.data?.error);
        }
      }     
    }
  };

  return (
    <div className="profile-setup-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        
        {/* Name Field */}
        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className={`form-group ${errors.email ? 'error' : ''}`}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className={`form-group ${errors.password ? 'error' : ''}`}>
          <label>Password *</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <small className="hint">Minimum 8 characters with letters and numbers</small>
          <br/>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className={`form-group ${errors.password ? 'error' : ''}`}>
          <label>Confirm Password *</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Create a password"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <small className="hint">Minimum 8 characters with letters and numbers</small>
          <br/>
          {errors.confirmPassword && <span className="error-message">{errors.password}</span>}
        </div>

        {/* Combined Course Field */}
        <div className={`form-group ${errors.course ? 'error' : ''}`}>
          <label>Course *</label>
          <div className="searchable-dropdown" ref={courseInputRef}>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => {
                setFormData({...formData, course: e.target.value});
                setShowCourseDropdown(true);
              }}
              onFocus={() => setShowCourseDropdown(true)}
              placeholder="Type or select your course"
            />
            <button 
              type="button" 
              className="dropdown-toggle"
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
              aria-label="Toggle course dropdown"
            >
              ▼
            </button>
            
            {showCourseDropdown && (
              <div className="dropdown-options" ref={courseDropdownRef}>
                {courses
                  .filter(course => 
                    course.toLowerCase().includes(formData.course.toLowerCase())
                  )
                  .map(course => (
                    <div
                      key={course}
                      className="dropdown-option"
                      onClick={() => {
                        setFormData({...formData, course});
                        setShowCourseDropdown(false);
                        setErrors(prev => ({...prev, course: ''}));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setFormData({...formData, course});
                          setShowCourseDropdown(false);
                        }
                      }}
                      tabIndex={0}
                    >
                      {course}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          {errors.course && <span className="error-message">{errors.course}</span>}
        </div>

        {/* Year Field */}
        <div className={`form-group ${errors.year ? 'error' : ''}`}>
          <label>Year *</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
          >
            <option value="">Select your year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.year && <span className="error-message">{errors.year}</span>}
        </div>

        {/* Gender Field */}
        <div className={`form-group ${errors.gender ? 'error' : ''}`}>
          <label>Gender *</label>
          <div className="gender-options">
            {genders.map(gender => (
              <label key={gender} className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                />
                {gender}
              </label>
            ))}
          </div>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>

        {/* Telegram Handle Field */}
        <div className={`form-group ${errors.telegramHandle ? 'error' : ''}`}>
          <label>Telegram Handle *</label>
          <div className="telegram-input">
            <span className="handle-prefix">@</span>
            <input
              type="text"
              name="telegramHandle"
              value={formData.telegramHandle}
              onChange={handleChange}
              placeholder="username"
            />
          </div>
          {errors.telegramHandle && <span className="error-message">{errors.telegramHandle}</span>}
        </div>

        <button type="submit" className="submit-btn">Complete Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;

