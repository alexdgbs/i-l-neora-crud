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

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category?.name === selectedCategory)
    : items;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-emerald-500 text-white py-16 px-4">
        <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">¡Bienvenido!</h1>
        <p className="mb-8 text-lg">Turing - IA</p>

        </div>
      </section>
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setSelectedCategory("")}
              className={`bg-gray-600 text-white px-6 py-2 rounded-3xl hover:bg-gray-700 ${
                selectedCategory === "" && "bg-gray-700 ring-2 ring-white"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-semibold bg-emerald-500 text-white px-6 py-2 rounded-3xl hover:bg-emerald-600 ${
                  selectedCategory === category && "bg-emerald-600 ring-2 ring-white"
                }`}
              >
                {String(category)}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5 px-4">
        <div className="container mx-auto">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id || `item-${Math.random()}`}
                  className="bg-white p-6 rounded-2xl shadow-md"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {String(item.name || "")}
                  </h3>
                  <p className="text-sm text-gray-400 font-semibold" >
                    {String(item.description || "")}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-block bg-emerald-100 text-emerald-500 px-2 py-1 rounded-md text-sm font-semibold">
                      Precio: ${String(item.price || "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No hay ítems para la categoría seleccionada.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
