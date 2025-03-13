import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from './views/shared/Authentication/Authentication'
import ProtectedRoute from './views/shared/ProtectedRoute'
import Dashboard from './views/shared/Dashboard/Dashboard';
import Landing from "./views/shared/Landing/Landing";
import './App.css'
import Appointment from "./views/doctor/Appointment/Appointment";
import MainLayout from "./views/shared/MainLayout/MainLayout";
import { ThemeProvider } from "./context/ThemeContext";

function App() {

  // Idk somehow we have to determine if its a blind user or a regualr user.
  
  /**
   * 
   * 1. Patient
   * 2. Doctors
   * 3. Pharmacy
   */
  const userType = "doctor"

  return (    
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout userType={userType}></MainLayout>}> {/** Add a protection middleware wrapper here **/}
          <Route path="/dashboard" element={<Dashboard userType={userType}></Dashboard>}></Route>
          <Route path="/appointments" element={<Appointment> </Appointment>}></Route>
        </Route>
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/auth" element={<ProtectedRoute children={<Authentication userType={userType}/>}></ProtectedRoute>}>
        
        </Route>

      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
