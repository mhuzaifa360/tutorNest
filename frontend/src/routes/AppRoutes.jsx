import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
// IMPORT ALL PAGES
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StudentDashboard from '../pages/Dashboard/StudentDashboard'
import TutorDashboard from '../pages/Dashboard/TutorDashboard'
import Teachers from '../pages/Teachers'


function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
      {/* NAVBAR */}
      <div className=''>
        <Navbar />
      </div>
      {/* CREATE ROUTES FOR ALL PAGES */}
        <Routes>
            <Route path='' element={<Home />}/>
            <Route path='' element={<Login />}/>
            <Route path='' element={<Signup />}/>
            <Route path='' element={<About />}/>
            <Route path='' element={<Contact />}/>
            <Route path='' element={<Teachers />}/>
            <Route path='' element={<StudentDashboard />}/>
            <Route path='' element={<TutorDashboard />}/>
        </Routes>
        {/* FOOTER */}
          <Footer />
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
