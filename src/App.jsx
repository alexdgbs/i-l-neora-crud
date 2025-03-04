import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/items");

      const itemsData = Array.isArray(response.data) ? response.data : [];
      setItems(itemsData);

      const uniqueCategories = Array.from(
        new Set(itemsData.map((item) => item.category?.name).filter(Boolean))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error al obtener los items:", error);
      setError("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };
  const filteredItems = items
    .filter((item) => 
      selectedCategory ? item.category?.name === selectedCategory : true
    )
    .filter((item) => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-center text-red-500 font-medium">{error}</p>
          <button 
            onClick={fetchItems}
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-emerald-500 to-teal-500 text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">¡Bienvenido!</h1>
          <p className="mb-8 text-lg">Descubre nuestra selección de productos</p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-5 border-3 border-white rounded-full text-white focus:outline-none pl-12"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 px-4 sticky top-0 bg-white z-10 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory("")}
              className={`font-medium text-sm px-5 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === "" 
                  ? "bg-emerald-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-medium text-sm px-5 py-2 rounded-full transition-all duration-200 ${
                  selectedCategory === category 
                    ? "bg-emerald-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {String(category)}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold mb-6 text-gray-700">
            {selectedCategory ? `Productos - ${selectedCategory}` : "Todos los productos"}
            {searchTerm && ` - Resultados para "${searchTerm}"`}
          </h2> 
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id || `item-${Math.random()}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-md font-bold text-gray-700 line-clamp-1">
                        {String(item.name || "")}
                      </h3>
                      {item.category?.name && (
                        <span className="inline-block bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-medium">
                          {String(item.category.name)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {String(item.description || "")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-md font-bold text-emerald-600">
                        ${String(item.price || "0")}
                      </span>
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full h-9 w-9 flex items-center justify-center transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg text-gray-600">No hay productos disponibles para mostrar.</p>
              <p className="text-gray-500 mt-1">Intenta con otra categoría o búsqueda.</p>
              {(selectedCategory || searchTerm) && (
                <button 
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchTerm("");
                  }}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-full transition-colors duration-200"
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;