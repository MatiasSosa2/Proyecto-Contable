import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const auth = getAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('Hubo un error al iniciar sesión con Google');
    }
  };

  return (
    <div className="login-page">
      <div className="login-info">
        <h1 className="app-name">StockFlow</h1>
        <p className="tagline">Gestión inteligente de productos y operaciones</p>
        <ul className="features">
          <li>📦 Registro y control de stock en tiempo real</li>
          <li>🧾 Historial detallado de operaciones</li>
          <li>📊 Reportes de ventas y compras</li>
          <li>🔐 Seguridad y acceso personalizado</li>
        </ul>
        <p className="footer-note">Accedé para comenzar a gestionar con precisión.</p>
      </div>

      <div className="login-form-container">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="email-login-btn">
            Iniciar sesión
          </button>
        </form>
        <div className="divider">o</div>
        <button onClick={handleGoogleLogin} className="google-login-btn">
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
