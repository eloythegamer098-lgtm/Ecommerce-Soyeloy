import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { CardProduct } from './components/CardProduct.jsx'
import './App.css'
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout.jsx'
import { Home } from './pages/Home.jsx'
import { Contact } from './pages/Contact.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { Productos } from './pages/Products.jsx'
import { DetalleProducto } from './pages/DetailtProduct.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
function App() {
  const productos = [
    {id: 1, name: 'Producto 1', price: 10.99, image: 'https://placehold.net/1.png' , onSale: true, outOfStock: false},
    {id: 2, name: 'Producto 2', price: 19.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: true},
    {id: 3, name: 'Producto 3', price: 5.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: false},
    {id: 4, name: 'Producto 4', price: 15.99, image: 'https://placehold.net/1.png', onSale: true, outOfStock: true},
    {id: 5, name: 'Producto 5', price: 8.99, image: 'https://placehold.net/1.png', onSale: false, outOfStock: false},
  ];

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate to="/Login" replace />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='/contacto' element={<Contact />} />
        <Route path='/productos' element={<Productos />} />
        <Route path='/productos/:id' element={<DetalleProducto />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
    </BrowserRouter>
   
  )
}

export default App
