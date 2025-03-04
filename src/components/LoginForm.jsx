import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      console.log('Respuesta del servidor:', response.data);

      if (response.data.token) {
        const decodedToken = jwtDecode(response.data.token);
        const userRole = decodedToken.role;
        
        console.log('Token decodificado:', decodedToken);
        console.log('Rol del usuario:', userRole);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", userRole);

        const savedToken = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");
        console.log('Token guardado:', savedToken);
        console.log('Rol guardado:', savedRole);

        if (userRole === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Error al iniciar sesión: Token no recibido.");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Por favor, verifica tus credenciales.'}`);
      } else if (error.request) {
        setError("Error de conexión. Por favor, intenta más tarde.");
      } else {
        setError("Error al procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-emerald-100">
        <div className="mb-8 text-center">
          <div className=" w-14 h-14  flex items-center justify-center mx-auto mb-2 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-emerald-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Bienvenido</h2>
          <p className="text-gray-500 mt-1 text-sm">Ingresa tus credenciales para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label 
                className="block text-gray-700 font-medium mb-2 text-sm" 
                htmlFor="username"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Ingresar usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 text-sm"
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-gray-700 font-medium mb-2 text-sm" 
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 text-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 flex items-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          <div>
            <button
              type="submit"
              className={`
                w-full
                bg-emerald-500 
                text-white 
                py-3 
                rounded-xl
                hover:bg-emerald-600 
                focus:outline-none 
                focus:ring-2 
                focus:ring-emerald-500 
                shadow-lg
                shadow-emerald-100
                font-medium
                transition-all
                text-sm
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Cargando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;