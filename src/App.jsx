import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter } from 'react-router-dom'
import RenderRoutes from './routes/RenderRoutes'
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <RenderRoutes />
      </BrowserRouter>   
    </>
  )
}

export default App
