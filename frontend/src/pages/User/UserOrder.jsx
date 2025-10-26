import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6 text-white">My Orders</h2>
            
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.error || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left text-white">IMAGE</th>
                                <th className="py-3 px-4 text-left text-white">ID</th>
                                <th className="py-3 px-4 text-left text-white">DATE</th>
                                <th className="py-3 px-4 text-left text-white">TOTAL</th>
                                <th className="py-3 px-4 text-left text-white">PAID</th>
                                <th className="py-3 px-4 text-left text-white">DELIVERED</th>
                                <th className="py-3 px-4 text-left text-white">ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b border-gray-700">
                                    <td className="py-3 px-4">
                                        <img 
                                            src={order.orderItems[0]?.image} 
                                            alt={order.user}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-white">
                                        {order._id.substring(0, 8)}...
                                    </td>
                                    <td className="py-3 px-4 text-white">
                                        {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-white font-semibold">
                                        $ {order.totalPrice}
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.isPaid ? (
                                            <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.isDelivered ? (
                                            <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link to={`/order/${order._id}`}>
                                            <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-200">
                                                View Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>   
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}; 

export default UserOrder;