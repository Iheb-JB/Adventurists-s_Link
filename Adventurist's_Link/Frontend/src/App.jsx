import { BrowserRouter , Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import Header from './Components/Header'
import About from './Pages/About'


export default function App() {
  return (   
    
    <BrowserRouter >
      <Header />
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/signin' element={<SignIn />}/>
          <Route path='/about' element={<About />}/>
      </Routes>
    </BrowserRouter>
    
  )
}
