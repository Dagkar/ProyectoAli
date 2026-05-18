import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ShopContext = React.createContext();

const typePriceMap = {
  Boost: 1050,
  Fuzz: 1300,
  Overdrive: 1550,
  Distortion: 1650,
  Tremolo: 1900,
  Chorus: 2700,
  Delay: 2900,
  Reverb: 3500,
  'Pedal experimental / noise': 3000,
  'No estoy seguro, quiero asesoría': 0
};

const complexityPriceMap = {
  simple: 0,
  intermedio: 500,
  completo: 1200,
  asesoria: 0
};

const usePriceMap = {
  'Para tocar en casa': 0,
  'Para grabación en estudio': 120,
  'Para tocar en vivo': 180,
  'Para pedalboard principal': 150,
  'Para bajo': 150,
  'Para guitarra': 0,
  'Para sonidos experimentales': 250,
  Otro: 120
};

const controlPriceMap = {
  Bass: 175,
  Treble: 175,
  Bias: 225,
  Blend: 350,
  Mix: 350,
  Feedback: 400,
  Depth: 250,
  Rate: 250,
  Shape: 275,
  'Pre-delay': 500,
  'Tap tempo': 850,
  'Clean Blend': 350,
  Gate: 175,
  Modulation: 175,
  Time: 0,
  Volume: 0,
  Gain: 0,
  Tone: 0,
  Fuzz: 0,
  Level: 0
};

const calculatePersonalizationPrice = (data = {}) => {
  const tipoPedal = data.tipoPedal || '';
  const estiloSonido = Array.isArray(data.estiloSonido) ? data.estiloSonido : [];
  const controles = Array.isArray(data.controles) ? data.controles : [];
  const usoPrincipal = Array.isArray(data.usoPrincipalSeleccion) && data.usoPrincipalSeleccion.length > 0
    ? data.usoPrincipalSeleccion
    : Array.isArray(data.usoPrincipal)
      ? data.usoPrincipal
      : [];

  const enclosureColor = data.enclosureColorSeleccion || data.enclosureColor || '';
  const knobColor = data.knobColorSeleccion || data.knobColor || '';
  const ledColor = data.ledColorSeleccion || data.ledColor || '';

  const tipoExtra = typePriceMap[tipoPedal] || 0;
  const sonidoExtra = estiloSonido.reduce((sum, option) => {
    if (option === 'Psicodélico') return sum + 300;
    if (option === 'Transparente') return sum + 200;
    if (option === 'Experimental') return sum + 600;
    if (option === 'Inspirado en un artista') return sum + 550;
    return sum;
  }, 0);
  const complejidadExtra = complexityPriceMap[data.complejidad] || 0;
  const controlesExtra = controles.reduce((sum, control) => sum + (controlPriceMap[control] || 125), 0);
  const enclosureExtra = enclosureColor && ['Negro', 'Blanco', 'Plateado', 'Sin pintar / aluminio'].includes(enclosureColor) ? 0 : (enclosureColor ? 250 : 0);
  const knobExtra = knobColor && ['Negro', 'Blanco', 'Crema'].includes(knobColor) ? 0 : (knobColor ? 120 : 0);
  const ledExtra = ledColor && ['Rojo', 'Azul', 'Verde', 'Blanco', 'Amarillo'].includes(ledColor) ? 0 : (ledColor ? 75 : 0);
  const usoExtra = usoPrincipal.reduce((sum, option) => sum + (usePriceMap[option] ?? 120), 0);

  return tipoExtra + sonidoExtra + complejidadExtra + controlesExtra + enclosureExtra + knobExtra + ledExtra + usoExtra;
};

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
  const [customItems, setCustomItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customCartItems') || '{}');
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

  useEffect(() => {
    localStorage.setItem('customCartItems', JSON.stringify(customItems));
  }, [customItems]);

  // Añadir al carrito
  const addToCart = async (itemId, quantity = 1) => {
    try {
      // Check stock from loaded products
      const product = products.find(p => p._id === itemId || p.id === itemId)
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

  const addCustomItem = (customData, quantity = 1) => {
    const customId = customData.id || `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    const referenceImage = customData.imagen || customData.personalizacion?.referenciaArchivo || '/img/Logo.png';
    const personalizacion = customData.personalizacion || customData;
    const computedPrice = calculatePersonalizationPrice(personalizacion);

    setCustomItems(prev => ({
      ...prev,
      [customId]: {
        id: customId,
        quantity: safeQuantity,
        nombre: customData.nombre || 'Pedido personalizado',
        imagen: referenceImage,
        precio: computedPrice,
        esPersonalizado: true,
        personalizacion: {
          ...personalizacion,
          referenciaArchivo: personalizacion.referenciaArchivo || customData.imagen || ''
        }
      }
    }));

    toast.success('Personalización agregada al carrito');
    return customId;
  };

  // Eliminar del carrito
  const removeFromCart = async (itemId) => {
    try {
      if (customItems[itemId]) {
        const updatedCustomItems = { ...customItems };
        delete updatedCustomItems[itemId];
        setCustomItems(updatedCustomItems);
        return;
      }

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
      if (customItems[itemId]) {
        if (quantity <= 0) {
          removeFromCart(itemId);
        } else {
          setCustomItems(prev => ({
            ...prev,
            [itemId]: {
              ...prev[itemId],
              quantity
            }
          }));
        }
        return;
      }

      const product = products.find(p => p._id === itemId || p.id === itemId);
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
    for (const itemId in customItems) {
      totalCount += customItems[itemId]?.quantity || 0;
    }
    return totalCount;
  };

  // Obtener total del carrito
  const getCartTotal = () => {
    let totalPrice = 0;
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId || p.id === itemId);
      if (product) {
        totalPrice += product.precio * cartItems[itemId];
      }
    }
    for (const itemId in customItems) {
      const customItem = customItems[itemId];
      totalPrice += (Number(customItem?.precio) || 0) * (customItem?.quantity || 0);
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
    setCustomItems({});
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('customCartItems');
    toast.success('Sesi?n cerrada');
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems({});
    setCustomItems({});
    localStorage.removeItem('cartItems');
    localStorage.removeItem('customCartItems');
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
      } else {
        // Token inválido en backend: limpiar sesión local
        logout();
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
    customItems,
    token,
    user,
    loading,
    currency,
    delivery_fee,
    backendUrl,
    addToCart,
    addCustomItem,
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
