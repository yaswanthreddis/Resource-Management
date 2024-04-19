
import { Routes , Route } from 'react-router-dom'
import HOD from './HOD.jsx'
import Login from './Login.jsx'
import Faculty from './Faculty.jsx'
import Admin from './Admin.jsx'


function App() {
  

  return (
    <>
      
      
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/hod/*' element={<HOD />} />
          <Route path='/faculty/*' element={<Faculty />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes> 
      
    </>
  )
}

export default App
