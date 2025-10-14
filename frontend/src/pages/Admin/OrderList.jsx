import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { FaEye, FaBox, FaUser, FaCalendar, FaDollarSign, FaCheckCircle, FaClock } from "react-icons/fa";

const OrderList = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Admin Menu */}
                    <div className="lg:w-1/5">
                        <AdminMenu />
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-4/5">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FaBox className="text-pink-500 text-xl" />
                                            <div>
                                                <h2 className="text-xl font-semibold text-white">
                                                    Order Management
                                                </h2>
                                                <p className="text-gray-400 text-sm">
                                                    {orders?.length || 0} orders found
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-700/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Payment
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {orders?.map((order, index) => (
                                                <tr 
                                                    key={order._id} 
                                                    className={`hover:bg-gray-700/30 transition-colors duration-200 ${
                                                        index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'
                                                    }`}
                                                >
                                                    {/* Product Image */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                                                                <img 
                                                                    src={order.orderItems[0]?.image} 
                                                                    alt={order._id}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {order.orderItems.length} item(s)
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Order ID */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-mono text-gray-300">
                                                            {order._id.substring(0, 8)}...
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {order.orderItems[0]?.name?.substring(0, 20)}...
                                                        </div>
                                                    </td>

                                                    {/* Customer */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <FaUser className="text-gray-400 text-sm" />
                                                            <span className="text-sm text-gray-300">
                                                                {order.user ? order.user.username : "N/A"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <FaCalendar className="text-gray-400 text-sm" />
                                                            <span className="text-sm text-gray-300">
                                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Total */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <FaDollarSign className="text-green-400 text-sm" />
                                                            <span className="text-sm font-semibold text-white">
                                                                {order.totalPrice.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Payment Status */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {order.isPaid ? (
                                                            <div className="flex items-center space-x-2">
                                                                <FaCheckCircle className="text-green-500" />
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                                                                    Paid
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center space-x-2">
                                                                <FaClock className="text-yellow-500" />
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                                                                    Pending
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Delivery Status */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {order.isDelivered ? (
                                                            <div className="flex items-center space-x-2">
                                                                <FaCheckCircle className="text-green-500" />
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                                                                    Delivered
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center space-x-2">
                                                                <FaClock className="text-red-500" />
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                                                                    Pending
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link to={`/order/${order._id}`}>
                                                            <button className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
                                                                <FaEye className="mr-2" />
                                                                View
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Empty State */}
                                {(!orders || orders.length === 0) && (
                                    <div className="text-center py-12">
                                        <FaBox className="mx-auto text-4xl text-gray-500 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-400 mb-2">No orders found</h3>
                                        <p className="text-gray-500">There are no orders in the system yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;