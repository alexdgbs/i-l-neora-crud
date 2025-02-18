import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "https://server-test-ybsn.onrender.com";


function Dashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items");
      //Nuevo dato: Si el API devuelve la categoría como objeto, la convertimos a string
      const itemsData = response.data.map(item => ({
        ...item,
        category:
          typeof item.category === "object" && item.category !== null
            ? item.category.name
            : item.category
      }));
      setItems(itemsData);
    } catch (error) {
      console.error("Error al obtener los items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/items", newItem);
    
      const newItemWithCategory = {
        ...response.data,
        category: newItem.category
      };
      setItems([...items, newItemWithCategory]);
      setNewItem({ name: "", description: "", price: "", category: "" });
    } catch (error) {
      console.error("Error al crear el item:", error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categories.some((category) => category.name === newCategory)) {
      try {
        const response = await axios.post("/api/categories", { name: newCategory });
        setCategories([...categories, response.data]);
        setNewCategory("");
      } catch (error) {
        console.error("Error al crear la categoría:", error);
      }
    }
  };

  const handleStartEditing = (item) => {
    setEditingItem(item);
  };

  const handleUpdateCategory = async (category) => {
    try {
      const oldName = category.oldName;
      const response = await axios.put(`/api/categories/${category._id}`, {
        name: category.name,
      });
      const updatedCategories = categories.map((c) =>
        c._id === category._id ? response.data : c
      );
      setCategories(updatedCategories);
      const updatedItems = items.map((item) => {
        if (item.category === oldName) {
          return { ...item, category: response.data.name };
        }
        return item;
      });
      setItems(updatedItems);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
    }
  };

  const handleUpdate = async (item) => {
    try {
      const updatedItem = {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
      };
      const response = await axios.put(`/api/items/${item._id}`, updatedItem);
      const updatedItemFromResponse = {
        ...response.data,
        category: item.category
      };
      setItems(items.map((i) => (i._id === item._id ? updatedItemFromResponse : i)));
      setEditingItem(null);
    } catch (error) {
      console.error("Error al actualizar el item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await axios.delete(`/api/categories/${category._id}`);
      setCategories(categories.filter((c) => c._id !== category._id));
      const updatedItems = items.map(item => {
        if (item.category === category.name) {
          return { ...item, category: null };
        }
        return item;
      });
      setItems(updatedItems);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const renderCategories = () => {
    return categories.map((category) => (
      <li
        key={category._id}
        className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
      >
        {editingCategory && editingCategory._id === category._id ? (
          <input
            type="text"
            value={editingCategory.name}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 mr-4"
          />
        ) : (
          <span className="text-gray-700 text-md font-medium">{category.name}</span>
        )}
        <div className="flex space-x-2">
          {editingCategory && editingCategory._id === category._id ? (
            <>
              <button
                onClick={() => handleUpdateCategory(editingCategory)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200 text-sm"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full transition-colors duration-200 text-sm"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditingCategory({ ...category, oldName: category.name })}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-200 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors duration-200 text-sm"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </li>
    ));
  };

  const renderCategoryOptions = () => {
    return categories.map((category) => (
      <option key={category._id} value={category.name}>
        {category.name}
      </option>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-emerald-500 mb-12">
          Dashboard
        </h2>

        <form
          onSubmit={handleCreateCategory}
          className="bg-white shadow-lg rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6">Crear nueva categoría</h3>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
          />
          <button
            type="submit"
            className="bg-emerald-500 text-white px-6 py-2 rounded-3xl hover:bg-emerald-600 transition-colors duration-200 text-md"
          >
            Crear categoría
          </button>
        </form>

        <h3 className="text-2xl font-bold mb-6">Categorías</h3>
        <ul className="space-y-4 mb-12">{renderCategories()}</ul>

      
        <form
          onSubmit={handleCreateItem}
          className="bg-white shadow-lg rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6">Crear nuevo item</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            required
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
          />
          <input
            type="number"
            placeholder="Precio"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: e.target.value })
            }
            required
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-md"
          />
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            required
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-md text-gray-600 font-semibold"
          >
            <option value="">Categorías</option>
            {renderCategoryOptions()}
          </select>
          <button
            type="submit"
            className="bg-emerald-500 text-white px-6 py-2 rounded-3xl hover:bg-emerald-600 transition-colors duration-200"
          >
            Crear
          </button>
        </form>

      
        <h3 className="text-2xl font-bold mb-6">Lista de items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {editingItem && editingItem._id === item._id ? (
                <>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <input
                    type="text"
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: e.target.value })
                    }
                    className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value })
                    }
                    className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="">Categorías</option>
                    {renderCategoryOptions()}
                  </select>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleUpdate(editingItem)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200 text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full transition-colors duration-200 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-xl font-bold text-gray-800">{item.name}</h4>
                  <p className="text-gray-600 mt-3">{item.description}</p>
                  <p className="text-gray-800 font-semibold mt-3">${item.price}</p>
                  <p className="text-gray-500 mt-2">
                    {item.category || "Categoría no disponible"}
                  </p>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => handleStartEditing(item)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-200 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors duration-200 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
