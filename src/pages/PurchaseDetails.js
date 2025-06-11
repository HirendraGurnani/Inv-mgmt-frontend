import React, { useState, useEffect, useContext, useCallback } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";

function PurchaseDetails() {
const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const { user } = useContext(AuthContext);

  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage((prev) => !prev);
  };

  // Memoized fetch functions so useEffect doesn't complain
  const fetchPurchaseData = useCallback(async () => {
    try {
      const response = await fetch(`https://inventory-1tt5.onrender.com/api/purchase/get/${user}`);
      const data = await response.json();
      setAllPurchaseData(data);
    } catch (err) {
      console.error("Failed to fetch purchase data", err);
    }
  }, [user]);

  const fetchProductsData = useCallback(async () => {
    try {
      const response = await fetch(`https://inventory-1tt5.onrender.com/api/product/get/${user}`);
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, [user]);

  // Now it's safe to include them in dependency array
  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [fetchPurchaseData, fetchProductsData, updatePage]);


  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            handlePageUpdate={handlePageUpdate}
            authContext={{ user }}
          />
        )}

        {/* Purchase Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 items-center">
              <span className="font-bold">Purchase Details</span>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={addSaleModalSetting}
            >
              Add Purchase
            </button>
          </div>

          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Product Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Quantity Purchased</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Purchase Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Total Purchase Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchase.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 text-gray-900">{item.ProductID?.name}</td>
                  <td className="px-4 py-2 text-gray-700">{item.QuantityPurchased}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(item.PurchaseDate).toLocaleDateString() === new Date().toLocaleDateString()
                      ? "Today"
                      : new Date(item.PurchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">${item.TotalPurchaseAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
