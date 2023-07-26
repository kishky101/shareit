import { Route, Routes, useNavigate } from "react-router-dom";


import Login from "./components/Login";
import Home from "./container/Home";
import { fetchUser } from "./utils/fetchUser";
import { useEffect } from "react";


function App() {
  const navigate = useNavigate();

  const userInfo = fetchUser();

 

  useEffect(() => {
    if(!userInfo?.sub) {
      return navigate('/login')
    }
  })

  return (
    <Routes>
      <Route path='login' element={<Login />}/>
      <Route path='/*' element={<Home />}/>
    </Routes>
  )
}

export default App
