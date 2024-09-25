import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();

   const handleSubmit = (e) => {
      e.preventDefault();

      // Call the backend API to register a new user
      axios.post('http://localhost:3000/register', {
         name, email, password
      })
      .then((response) => {
         alert('Registration successful!');
         navigate('/login');
      })
      .catch((error) => {
         alert('Error registering user');
      });
   };

   return (
      <div className="container mt-5">
         <h2>Register</h2>
         <form onSubmit={handleSubmit}>
            <div className="mb-3">
               <label className="form-label">Name</label>
               <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
               <label className="form-label">Email</label>
               <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
               <label className="form-label">Password</label>
               <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
         </form>
      </div>
   );
};

export default Registration;
