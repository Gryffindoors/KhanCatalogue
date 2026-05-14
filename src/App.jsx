import { useState } from 'react'
import CataloguePage from './pages/CataloguePage'
import { Route, Routes } from 'react-router'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Navbar from './components/Navbar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CataloguePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>

    </>
  )
} 

export default App
