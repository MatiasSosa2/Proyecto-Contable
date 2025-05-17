import { useState } from 'react';
import './ProductForm.css';  // Aquí tu CSS personalizado

const ProductForm = ({ onSubmit }) => {
  const [productName, setProductName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim()) return;
    onSubmit({ name: productName.trim() });
    setProductName('');
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Nombre del Producto</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ej. Zapatillas deportivas"
          required
        />
        <button type="submit">Registrar Producto</button>
      </form>
    </div>
  );
};

export default ProductForm;

