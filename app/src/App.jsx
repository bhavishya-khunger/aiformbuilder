import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import AppLayout from './layout/AppLayout.jsx'
import Signup from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicFormView from './pages/PublicFormView.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout children={<Home />} />} />
      <Route path="/signup" element={<AppLayout children={<Signup />} />} />
      <Route path="/login" element={<AppLayout children={<Login />} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      <Route path="/form/:formId" element={<PublicFormView />} />
    </Routes>
  )
}

export default App
