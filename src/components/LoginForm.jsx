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
        //Decodifica el token para obtener el rol
        const decodedToken = jwtDecode(response.data.token);
        const userRole = decodedToken.role;
        
        console.log('Token decodificado:', decodedToken);
        console.log('Rol del usuario:', userRole);

        //Token y rol en localStorage
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              className="block text-gray-700 font-bold mb-2" 
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ingresar usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label 
              className="block text-gray-700 font-bold mb-2" 
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`
                w-full
                bg-emerald-500 
                text-white 
                px-4 
                py-2 
                rounded-3xl 
                hover:bg-emerald-600 
                focus:outline-none 
                focus:ring-2 
                focus:ring-emerald-500 
                transition-colors
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
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