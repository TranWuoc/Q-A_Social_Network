import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient"; // Ensure the correct path
import "./User.css";
import Pagination from "./Pagination";
import "./Users.css";
import avaUser from "../../components/assets/icon-user.svg";
const Users = ({ searchTerm, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // State cho tổng số trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch users from the API
        const response = await axiosClient.get(`/users/getAll`, {
          params: { page, size },
        });
        const usersArray = Array.isArray(response.data.result.data)
          ? response.data.result.data
          : [];
        setTotalUsers(response.data.result.totalElements);
        setTotalPages(response.data.result.totalPages);

        setUsers(usersArray);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [page, size]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userElements = filteredUsers.map((data) => {
    const handleClick = () => {
      navigate(`/Users/${data.userId}`, { state: { user: data } });
    };

    return (
      <div key={data.userId} class="card-users" onClick={handleClick} >
      <div class="card-users-border-top">
      </div>
      <div class="img">
        <img src={avaUser} alt="avaUser" style={{margin: '5px'}} />
      </div>
      <span>{data.username.charAt(0).toUpperCase() + data.username.slice(1)}</span>
      <p class="job">{data.email}</p>
      
    </div>
    );
  });

  return (
    <div className="userList-container">
      <div className="user-grid">
        {userElements}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Users;
