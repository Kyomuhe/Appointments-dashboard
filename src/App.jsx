import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Doctors from './components/Doctors';
import Appointment from './components/Appointments';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />

        <Route path ="/layout" element ={
          <ProtectedRoute>
            <Layout/>
          </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path = 'doctors' element ={<Doctors/>} />
            <Route path = 'appointments' element ={<Appointment/>}/>



        </Route>
      </Routes>
    </Router>
  );
}

export default App;
