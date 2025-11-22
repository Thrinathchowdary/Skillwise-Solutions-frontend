// React imports
import React, { useState, useEffect } from "react";

// External library imports
import axios from "axios";

// Local component imports
import ProductTable from "./components/ProductTable";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import AddProductModal from "./components/AddProductModal";
import HistorySidebar from "./components/HistorySidebar";

// Style imports
import "./styles/tailwind.css";

const API_BASE_URL = "https://skillwise-solutions-backend.onrender.com/api";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const fileInputRef = React.useRef(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products when search query or category changes
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, newProduct);
      setProducts([...products, response.data]);
      setShowAddModal(false);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/products/${id}`, updatedData);
      fetchProducts();
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/import-export/import`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(
        `Import completed! Added: ${response.data.added}, Skipped: ${response.data.skipped}`
      );
      fetchProducts();
    } catch (error) {
      console.error("Error importing products:", error);
      alert("Failed to import products");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/import-export/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      console.error("Error exporting products:", error);
      alert("Failed to export products");
    }
  };

  return (
    <div className="min-h-screen font-aptos bg-gradient-to-br from-gray-900 via-deep-blue to-deep-teal">
      <header className="bg-gradient-to-r from-deep-blue to-deep-purple text-white py-3 px-4 shadow-2xl">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="material-icons-outlined align-middle mr-2">
            inventory_2
          </span>
          Inventory Manager
        </h1>
      </header>

      <div className="bg-gray-800 bg-opacity-50 backdrop-blur border-b border-gray-700 py-3 px-4 shadow-lg">
        <div className="flex flex-col gap-3 max-w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-1 whitespace-nowrap"
              onClick={() => setShowAddModal(true)}
            >
              <span className="material-icons-outlined text-sm">
                add_circle
              </span>
              Add
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-1 whitespace-nowrap"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="material-icons-outlined text-sm">upload</span>
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              style={{ display: "none" }}
            />
            <button
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-1 whitespace-nowrap"
              onClick={handleExport}
            >
              <span className="material-icons-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex gap-4">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 py-12">
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined animate-spin text-xl">
                hourglass_empty
              </span>
              <span>Loading products...</span>
            </div>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            onSelectProduct={setSelectedProduct}
          />
        )}
        {selectedProduct && (
          <HistorySidebar
            productId={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          categories={categories}
          onAdd={handleAddProduct}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default App;
