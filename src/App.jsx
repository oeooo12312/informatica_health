import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from './views/shared/Authentication/Authentication'
import ProtectedRoute from './views/shared/Layout'
import Dashboard from './views/shared/Dashboard/Dashboard';
import Landing from "./views/shared/Landing/Landing";
import './App.css'

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
    <BrowserRouter>
      <Routes>
        <Route> {/** Add a protection middleware wrapper here **/}
          <Route path="/dashboard" element={<Dashboard userType={userType}></Dashboard>}></Route>
        </Route>
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/auth" element={<ProtectedRoute children={<Authentication userType={userType}/>}></ProtectedRoute>}>
        
        </Route>

      </Routes>
    </BrowserRouter>
    
  
  )
}

export default App
