import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
   return (
      <Router>
         <Routes>
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<ProtectedRoute>
              <UserManagement /></ProtectedRoute>} />
         </Routes>
      </Router>
   );
}

export default App;
