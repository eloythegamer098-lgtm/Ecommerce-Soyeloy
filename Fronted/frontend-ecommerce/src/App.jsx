import { useState, useEffect } from 'react'
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
import { ForgotPassword } from './pages/ForgotPassword.jsx'
import { ResetPassword } from './pages/ResetPassword.jsx'
import { Categorias } from './pages/Categorias.jsx'
import { Carrito } from './pages/Carrito.jsx'
import {CartProvider} from './services/ContextCart.jsx'
import { AdminProductos } from './pages/AdminProductos.jsx'
import { AdminDashboard } from './pages/AdminDashboard.jsx'
import { AdminUsuarios } from './pages/AdminUsuarios.jsx'
import { AdminPedidos } from './pages/AdminPedidos.jsx'
import { AdminCupones } from './pages/AdminCupones.jsx'
import { AdminAuditoria } from './pages/AdminAuditoria.jsx'
import { AdminCategorias } from './pages/AdminCategorias.jsx'
import { AdminInventario } from './pages/AdminInventario.jsx'
import { AdminConfiguracion } from './pages/AdminConfiguracion.jsx'
import { Maintenance } from './pages/Maintenance.jsx'
import { MisPedidos } from './pages/MisPedidos.jsx'
import { Favoritos } from './pages/Favoritos.jsx'
import { AuthProvider, useAuth } from './services/AuthContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import api from './services/api'

import { AdminLayout } from './layouts/AdminLayout.jsx'

function AppContent() {
  const { user, token } = useAuth();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const data = await api.get('/configuracion/publico/modo_mantenimiento');
        if (data.valor === '1' && user?.rol !== 'admin') {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        console.error("Error al verificar mantenimiento:", error);
      } finally {
        setCheckingMaintenance(false);
      }
    };

    checkMaintenance();
  }, [user]);

  if (checkingMaintenance) return <div className="cyber-spinner-container"><div className="cyber-spinner"></div></div>;
  if (isMaintenance) return <Maintenance />;

  return (
    <Routes>
      <Route path='/' element={<Navigate to="/Login" replace />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      
      {/* Rutas de Usuario Normal */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/contacto' element={<Contact />} />
          <Route path='/productos' element={<Productos />} />
          <Route path='/productos/:id' element={<DetalleProducto />} />
          <Route path='/categorias' element={<Categorias />}/>
          <Route path='/mispedidos' element={<MisPedidos />}/>
          <Route path='/favoritos' element={<Favoritos />}/>
          <Route path='/carrito' element={<Carrito />}/>
        </Route>
      </Route>

      {/* Rutas de Administrador */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path='/admin' element={<AdminDashboard />}/>
          <Route path='/adminProductos' element={<AdminProductos />}/>
          <Route path='/admin/categorias' element={<AdminCategorias />}/>
          <Route path='/admin/pedidos' element={<AdminPedidos />}/>
          <Route path='/admin/cupones' element={<AdminCupones />}/>
          <Route path='/admin/usuarios' element={<AdminUsuarios />}/>
          <Route path='/admin/auditoria' element={<AdminAuditoria />}/>
          <Route path='/admin/inventario' element={<AdminInventario />}/>
          <Route path='/admin/configuracion' element={<AdminConfiguracion />}/>
        </Route>
      </Route>

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
    <CartProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  )
}

export default App

