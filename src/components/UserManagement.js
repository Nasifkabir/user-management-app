
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
   const [users, setUsers] = useState([]);

   useEffect(() => {
      // Fetch users from the backend
      const token = localStorage.getItem('token');
      axios.get('http://localhost:3000/users', {
         headers: {
            Authorization: token
         }
      })
      .then((response) => {
         setUsers(response.data);
      })
      .catch((error) => {
         console.error('Error fetching users', error);
      });
   }, []);

   const blockUsers = (userIds) => {
      const token = localStorage.getItem('token');
      axios.patch('http://localhost:3000/users/block', { userIds }, {
         headers: {
            Authorization: token
         }
      })
      .then(() => {
         alert('Users blocked');
      })
      .catch((error) => {
         console.error('Error blocking users', error);
      });
   };

   const unblockUsers = (userIds) => {
      const token = localStorage.getItem('token');
      axios.patch('http://localhost:3000/users/unblock', { userIds }, {
         headers: {
            Authorization: token
         }
      })
      .then(() => {
         alert('Users unblocked');
      })
      .catch((error) => {
         console.error('Error unblocking users', error);
      });
   };

   const deleteUsers = (userIds) => {
      const token = localStorage.getItem('token');
      axios.delete('http://localhost:3000/users/delete', { data: { userIds } }, {
         headers: {
            Authorization: token
         }
      })
      .then(() => {
         alert('Users deleted');
      })
      .catch((error) => {
         console.error('Error deleting users', error);
      });
   };

   return (
      <div className="container mt-5">
         <h2>User Management</h2>
         <table className="table table-bordered">
            <thead>
               <tr>
                  <th><input type="checkbox" /></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Registration Time</th>
               </tr>
            </thead>
            <tbody>
               {users.map(user => (
                  <tr key={user.id}>
                     <td><input type="checkbox" /></td>
                     <td>{user.id}</td>
                     <td>{user.name}</td>
                     <td>{user.email}</td>
                     <td>{user.status}</td>
                     <td>{user.last_login}</td>
                     <td>{user.registration_time}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default UserManagement;
