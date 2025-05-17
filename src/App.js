import { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
} from 'firebase/firestore';

import LoginForm from './components/Auth/LoginForm';
import ProductForm from './components/Product/ProductForm';
import TransactionForm from './components/Transaction/TransactionForm';

import './styles.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('registerProduct');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProducts([]);
      return;
    }
    const q = query(collection(db, 'products'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(loadedProducts);
    }, error => {
      console.error('❌ Error cargando productos:', error.message);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(loadedTransactions);
    }, error => {
      console.error('❌ Error cargando transacciones:', error.message);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddProduct = async (product) => {
    try {
      const productWithUser = { ...product, userId: user.uid };
      await addDoc(collection(db, 'products'), productWithUser);
    } catch (error) {
      console.error('❌ Error agregando producto:', error.message);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      // Validar y convertir los valores numéricos antes de guardar
      const quantity = Number(transaction.quantity);
      const unitPrice = Number(transaction.unitPrice);

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Cantidad inválida');
      }
      if (transaction.type === 'purchase' && (isNaN(unitPrice) || unitPrice <= 0)) {
        throw new Error('Precio unitario inválido para compra');
      }

      const transactionWithUser = { 
        ...transaction, 
        quantity, 
        unitPrice, 
        userId: user.uid 
      };
      await addDoc(collection(db, 'transactions'), transactionWithUser);
    } catch (error) {
      console.error('❌ Error agregando transacción:', error.message);
      alert(error.message);
    }
  };

  const calculateStock = (productId) => {
    let totalQuantity = 0;
    transactions.forEach(t => {
      if (t.productId === productId) {
        const quantity = Number(t.quantity);
        if (!isNaN(quantity)) {
          totalQuantity += t.type === 'purchase' ? quantity : -quantity;
        }
      }
    });
    return totalQuantity;
  };

  const calculateAverageCost = (productId) => {
    let totalQuantity = 0;
    let totalCost = 0;
    transactions.forEach(t => {
      if (t.productId === productId && t.type === 'purchase') {
        const quantity = Number(t.quantity);
        const unitPrice = Number(t.unitPrice);
        if (!isNaN(quantity) && !isNaN(unitPrice)) {
          totalQuantity += quantity;
          totalCost += quantity * unitPrice;
        }
      }
    });
    return totalQuantity > 0 ? totalCost / totalQuantity : 0;
  };

  if (!user) {
    return (
      <div className="container auth-container">
        <LoginForm />
        <p className="warning-text">Debes iniciar sesión para acceder a esta aplicación.</p>
      </div>
    );
  }

  return (
    <div className="container app-container">

      {/* Header corporativo */}
      <header className="header-corporate">
        <div className="brand-logo">
          <h1>Imported Trends</h1>
        </div>
        <div className="user-session">
          <span className="user-email-label">Usuario:</span>
          <span className="user-email">{user.email}</span>
          <button
            className="btn-logout"
            onClick={() => signOut(getAuth())}
            aria-label="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Navegación principal */}
      <nav className="main-nav">
        <button
          className={activeTab === 'registerProduct' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('registerProduct')}
        >
          Registrar Producto
        </button>
        <button
          className={activeTab === 'manageStock' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('manageStock')}
        >
          Gestionar Stock
        </button>
        <button
          className={activeTab === 'businessInfo' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('businessInfo')}
        >
          Información del Negocio
        </button>
      </nav>

      <main className="main-content">
        <h2 className="app-section-title">
          {activeTab === 'registerProduct' && 'Registrar Producto'}
          {activeTab === 'manageStock' && 'Gestionar Stock'}
          {activeTab === 'businessInfo' && 'Información del Negocio'}
        </h2>

        {activeTab === 'registerProduct' && (
          <ProductForm onSubmit={handleAddProduct} />
        )}

        {activeTab === 'manageStock' && (
          <TransactionForm products={products} onSubmit={handleAddTransaction} />
        )}

        {activeTab === 'businessInfo' && (
          <>
            {products.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <ul className="stock-list">
                {products
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(product => {
                    const stock = calculateStock(product.id);
                    const avgCost = calculateAverageCost(product.id);
                    const cost = stock * avgCost;
                    const displayCost = isNaN(cost) ? 0 : cost;
                    const stockClass = stock <= 0 ? 'stock-empty' : 'stock-positive';

                    return (
                      <li key={product.id} className="stock-item">
                        <span className="product-name">{product.name}</span>
                        <span className={`product-stock ${stockClass}`}>
                          {stock} unidades
                        </span>
                        <span className="product-cost">
                          Costo total: ${displayCost.toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
