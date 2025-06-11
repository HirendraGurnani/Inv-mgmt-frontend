import React, { useState, useEffect, useContext, useCallback } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  const fetchProductsData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://inventory-1tt5.onrender.com/api/product/get/${authContext.user}`
      );
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [authContext.user]);

  const fetchSalesData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://inventory-1tt5.onrender.com/api/store/get/${authContext.user}`
      );
      const data = await response.json();
      setAllStores(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  }, [authContext.user]);
  useEffect(() => {
    if (!authContext.user) return;
    fetchProductsData();
    fetchSalesData();
  }, [authContext.user, updatePage, fetchProductsData, fetchSalesData]);

  // Fetching Search Results
  const fetchSearchData = async (query) => {
    try {
      const response = await fetch(
        `https://inventory-1tt5.onrender.com/api/product/search?searchTerm=${query}`
      );
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Delete Item
  // Delete Item
  const deleteItem = async (id) => {
    try {
      await fetch(
        `https://inventory-1tt5.onrender.com/api/product/delete/${id}`
      );
      setUpdatePage((prev) => !prev);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔧 Fix: Add this function
  const handlePageUpdate = () => {
    setUpdatePage((prev) => !prev);
  };

  // Input Change Handler (with live search)
  const handleSearchTerm = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim() === "") {
      fetchProductsData();
    } else {
      fetchSearchData(query);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {/* Summary Section */}
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className="flex flex-col md:flex-row justify-center items-center">
            {/* Total Products */}
            <div className="flex flex-col p-10 w-full md:w-3/12">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {products.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span>
            </div>
            {/* Stores */}
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">
                Stores
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {stores.length}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Last 7 days
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    $2000
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Revenue
                  </span>
                </div>
              </div>
            </div>
            {/* Top Selling */}
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">
                Top Selling
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    5
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Last 7 days
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    $1500
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Cost</span>
                </div>
              </div>
            </div>
            {/* Low Stock */}
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">
                Low Stocks
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    12
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Ordered
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    2
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Not in Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProductModal && (
          <AddProduct
            addProductModalSetting={setShowProductModal}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={setShowUpdateModal}
          />
        )}

        {/* Product Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 items-center">
              <span className="font-bold">Products</span>
              <div className="flex items-center px-2 border-2 rounded-md">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={() => setShowProductModal(true)}
            >
              Add Product
            </button>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                {[
                  "Products",
                  "Manufacturer",
                  "Stock",
                  "Description",
                  "Availibility",
                  "More",
                ].map((head) => (
                  <th
                    key={head}
                    className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((element) => (
                <tr key={element._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {element.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.manufacturer}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.stock}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.description}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.stock > 0 ? "In Stock" : "Not in Stock"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <span
                      className="text-green-700 cursor-pointer"
                      onClick={() => {
                        setUpdateProduct(element);
                        setShowUpdateModal(true);
                      }}
                    >
                      Edit
                    </span>
                    <span
                      className="text-red-600 px-2 cursor-pointer"
                      onClick={() => deleteItem(element._id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
