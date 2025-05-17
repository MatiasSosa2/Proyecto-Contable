import React, { useState } from 'react';
import { FaBoxOpen, FaShoppingCart, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './TransactionForm.css';

const TransactionForm = ({ products, onSubmit }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [feedback, setFeedback] = useState(null); // 'success' o 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !transactionType || !quantity || !unitPrice) {
      setFeedback('error');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }
    onSubmit({
      productId: selectedProduct,
      type: transactionType,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
    });
    setSelectedProduct('');
    setTransactionType('');
    setQuantity('');
    setUnitPrice('');
    setFeedback('success');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <section className="transaction-card">
      <h2 className="transaction-card-title">
        <FaBoxOpen style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Registrar Transacción
      </h2>
      <form onSubmit={handleSubmit} className="transaction-card-form" noValidate>
        <label htmlFor="product" className="sr-only">Producto</label>
        <select
          id="product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="transaction-card-select"
          required
        >
          <option value="" disabled>
            Selecciona un producto
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="transaction-type-toggle">
          <button
            type="button"
            className={transactionType === 'purchase' ? 'active purchase' : 'inactive'}
            onClick={() => setTransactionType('purchase')}
            aria-pressed={transactionType === 'purchase'}
          >
            <FaShoppingCart style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Compra
          </button>
          <button
            type="button"
            className={transactionType === 'sale' ? 'active sale' : 'inactive'}
            onClick={() => setTransactionType('sale')}
            aria-pressed={transactionType === 'sale'}
          >
            <FaDollarSign style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Venta
          </button>
        </div>

        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="transaction-card-input"
          required
        />

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Costo por unidad"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="transaction-card-input"
          required
        />

        <button type="submit" className="transaction-card-submit">
          Guardar transacción
        </button>

        {feedback === 'success' && (
          <div className="feedback-message success">
            <FaCheckCircle /> Transacción guardada correctamente.
          </div>
        )}
        {feedback === 'error' && (
          <div className="feedback-message error">
            <FaTimesCircle /> Por favor, completa todos los campos.
          </div>
        )}
      </form>
    </section>
  );
};

export default TransactionForm;
