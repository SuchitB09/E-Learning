import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Login from './Components/login';
import Register from './Components/register';
import Course from './Components/course';
import Courses from './Components/Courses';
import Profile from './Components/profile';
import Learnings from './Components/learnings';
import Home from './Components/Home';
import AddCourse from './Components/AddCourse';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Components/DashBoard/Dashboard';
import 'boxicons/css/boxicons.min.css';
import EditCourse from './Components/EditCourses';
import DUsers from './Components/DashBoard/DUsers';
import DCourses from './Components/DashBoard/DCourses';
import Assessment from './Components/Assessment';
import ErrorPage from './Components/ErrorPage';
import AddQuestions from './Components/AddQuestions';
import Performance from './Components/DashBoard/Performance';
import DTutors from './Components/DashBoard/DTutors';

import Forum from './Components/forum';
import AdminLogin from './Components/AdminLogin';
import AdminFeedback from "./Components/DashBoard/AdminFeedback";
import AdminDoubts from './Components/DashBoard/AdminDoubts';
import Certificate from './Components/certificate';
import EnrollUsers from './Components/DashBoard/EnrollUsers';
import FindInterest from './Components/FindInterest';
import AdminPayments from './Components/DashBoard/AdminPayments';

// Load Stripe
const stripePromise = loadStripe('pk_test_51RB7f12LxQ1Ebpbh2DwKmKUHOAFGSk6KmKKdHGsdGSfZyL68jrmRCQkTkiyme2WvvWDMgzgcrm27VWou8GQpRkbd00Kc08OhM5'); // Replace with your actual public key

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <Routes>
            {/* General Routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/' element={<Home />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/course/:id' element={<Course />} />
            <Route path='/discussion/:id' element={<Forum />} />
            <Route path='/certificate/:id' element={<Certificate />} />
            <Route path='/assessment/:id' element={<Assessment />} />
            <Route path='/addcourse' element={<AddCourse />} />
            <Route path='/editCourse/:id' element={<EditCourse />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/Learnings' element={<Learnings />} />

            {/* Dashboard Routes */}
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/Dcourses' element={<DCourses />} />
            <Route path='/Dusers' element={<DUsers />} />
            <Route path='/Dtutors' element={<DTutors />} />
            <Route path='/Performance' element={<Performance />} />

            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-feedback" element={<AdminFeedback courseId />} />
            <Route path="/admin-doubts" element={<AdminDoubts />} />

            {/* Other Routes */}
            <Route path='/addquestions/:id' element={<AddQuestions />} />
            <Route path="*" element={<ErrorPage />} />


              <Route path="/enroll-users" element={<EnrollUsers />} />


               <Route path="/find-interest" element={<FindInterest />} />


               <Route path="/admin-payments" element={<AdminPayments />} />


              

          </Routes>
        </BrowserRouter>
      </Elements>
      <ToastContainer />
    </div>
  );
}

export default App;
