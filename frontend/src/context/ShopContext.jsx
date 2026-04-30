import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ShopContext = React.createContext();

export const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const currency = 'MXN$';
  const delivery_fee = 50;

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems') || '{}');
    } catch {
      return {};
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Configurar axios con token
  const getAxiosConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Obtener productos del backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/productos`);
      if (response.data.success) {
        setProducts(response.data.productos);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Sincronizar carrito con localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Añadir al carrito
  const addToCart = async (itemId, quantity = 1) => {
    try {
      // Check stock from loaded products
      const product = products.find(p => p._id === itemId)
      const available = product ? product.stock || 0 : Infinity
      const current = cartItems[itemId] || 0
      const toAdd = Math.min(quantity, Math.max(0, available - current))
      if (toAdd <= 0) {
        toast.error('No hay suficiente stock')
        return
      }

      setCartItems(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + toAdd
      }));
      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito');
    }
  };

  // Eliminar del carrito
  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = { ...cartItems };
      delete updatedCart[itemId];
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al remover del carrito');
    }
  };

  // Actualizar cantidad en carrito
  const updateCartItemQty = async (itemId, quantity) => {
    try {
      const product = products.find(p => p._id === itemId);
      const maxStock = product ? (product.stock || 0) : Infinity;
      
      if (quantity <= 0) {
        removeFromCart(itemId);
      } else if (quantity > maxStock) {
        toast.error(`No hay suficiente stock. Disponible: ${maxStock}`);
      } else {
        setCartItems(prev => ({
          ...prev,
          [itemId]: quantity
        }));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error al actualizar cantidad');
    }
  };

  // Obtener cantidad total en carrito
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      totalCount += cartItems[itemId];
    }
    return totalCount;
  };

  // Obtener total del carrito
  const getCartTotal = () => {
    let totalPrice = 0;
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId);
      if (product) {
        totalPrice += product.precio * cartItems[itemId];
      }
    }
    return totalPrice;
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        toast.success('Login exitoso');
        return true;
      } else {
        toast.error(response.data.message || 'Error en el login');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.message || 'Error en el login');
      return false;
    }
  };

  // Registro
  const register = async (nombre, email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/registro`, {
        nombre,
        email,
        password
      });

      if (response.data.success) {
        toast.success('Registro exitoso. Por favor inicia sesión');
        return true;
      } else {
        toast.error(response.data.message || 'Error en el registro');
        return false;
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error(error.response?.data?.message || 'Error en el registro');
      return false;
    }
  };

  // Logout
  const logout = () => {
    setToken('');
    setUser(null);
    setCartItems({});
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    toast.success('Sesión cerrada');
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
  };

  // Obtener perfil
  const getProfile = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `${backendUrl}/api/auth/perfil`,
        getAxiosConfig()
      );

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // Verificar token al cargar
  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  const value = {
    products,
    cartItems,
    token,
    user,
    loading,
    currency,
    delivery_fee,
    backendUrl,
    addToCart,
    removeFromCart,
    updateCartItemQty,
    getCartCount,
    getCartTotal,
    login,
    register,
    logout,
    clearCart,
    getProfile,
    fetchProducts
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};
