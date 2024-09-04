import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminPannel from './components/AdminPannel/AdminPannel.jsx';
import MatchDetail from './components/MatchDetail/MatchDetail.jsx';
import UserPannel from './components/UserPannel/UserPannel.jsx';

createRoot(document.getElementById('root')).render(
    <Router>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/adminpannel' element={<AdminPannel/>} />
        <Route path='/userpannel' element={<UserPannel/>}/>
      </Routes>
    </Router>
)
