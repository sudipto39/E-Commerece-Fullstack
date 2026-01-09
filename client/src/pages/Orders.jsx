import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status = "") => {
    if (!status) return "Unknown";
    return status[0].toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <p className="text-gray-500 mb-4">
          You haven't placed any orders yet
        </p>
        <Link to="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order?._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order?._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order?.status
                  )}`}
                >
                  {getStatusLabel(order?.status)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 space-y-4">
              {Array.isArray(order?.items) &&
                order.items.map((item) => (
                  <div
                    key={`${item?.product?._id}-${item?.size}`}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={item?.product?.images?.[0] || "/placeholder.png"}
                      alt={item?.product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-medium">
                        {item?.product?.name || "Unnamed product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {item?.size ?? "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item?.quantity ?? 0}
                      </p>
                    </div>

                    <p className="font-medium">
                      $
                      {item?.price && item?.quantity
                        ? (item.price * item.quantity).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                ))}
            </div>

            {/* Summary */}
            <div className="p-6 border-t flex justify-between">
              <span>Total</span>
              <span>
                $
                {typeof order?.totalAmount === "number"
                  ? order.totalAmount.toFixed(2)
                  : "0.00"}
              </span>
            </div>

            {/* Address */}
            <div className="p-6 border-t text-sm text-gray-500">
              <p>{order?.shippingAddress?.street}</p>
              <p>
                {order?.shippingAddress?.city},{" "}
                {order?.shippingAddress?.state}{" "}
                {order?.shippingAddress?.zipCode}
              </p>
              <p>Phone: {order?.shippingAddress?.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
