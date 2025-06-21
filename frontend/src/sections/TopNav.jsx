import { useNavigate } from 'react-router-dom';
import httpClient from "../httpClient";

function TopNav() {
  const navigate = useNavigate();
  const handlelogout = async () => {
    try {
        const resp = await httpClient.post("/api/logout");
        navigate("/");
    } catch (error) {
        if (error.response?.status === 401) {
        alert("Invalid credentials");
        }else{
        alert(error.message);
        }
    }
  }
  return (
    <nav className="top-nav">
      <button onClick={() => navigate('/home')}>Home</button>
      <button onClick={() => navigate('/create-group')}>Create Group</button>
      <button onClick={() => navigate('/profile')}>Profile</button>
      <button onClick={() => navigate('/notification')}>Notification</button>
      <button onClick={() => navigate('/my-groups')}>My Groups</button>
      <button onClick={() => handlelogout()}>Log Out</button>
    </nav>
  );
}

export default TopNav;