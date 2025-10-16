import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({...product, qty}));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    }

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    }

    // Calculate totals
    const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <div className="container mx-auto px-3 sm:px-4 mt-4 sm:mt-8">
            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
                        <p className="text-gray-300 mb-6">Start shopping to add items to your cart</p>
                        <Link 
                            to="/shop" 
                            className="inline-flex items-center bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition duration-200"
                        >
                            <FaArrowLeft className="mr-2" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:flex-1">
                        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-xl sm:text-2xl font-semibold text-white">Shopping Cart</h1>
                                <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
                                    {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                                </span>
                            </div>

                            {/* Cart Items List */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div 
                                        key={item._id} 
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600"
                                    >
                                        {/* Product Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link 
                                                to={`/product/${item._id}`} 
                                                className="text-pink-500 font-semibold hover:text-pink-400 text-base sm:text-lg line-clamp-2"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="text-gray-300 text-sm mt-1">{item.brand}</div>
                                            <div className="text-white font-bold text-lg mt-1">
                                                ${item.price}
                                            </div>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <select 
                                                className="p-2 border rounded text-black bg-white text-sm sm:text-base w-20 sm:w-24"
                                                value={item.qty} 
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </select>

                                            {/* Remove Button */}
                                            <button
                                                className="text-red-500 hover:text-red-400 p-2 transition-colors"
                                                onClick={() => removeFromCartHandler(item._id)}
                                                aria-label="Remove item"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:w-80 xl:w-96">
                        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Items ({itemsCount}):</span>
                                    <span className="text-white font-semibold">${totalPrice}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Shipping:</span>
                                    <span className="text-white font-semibold">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                                    <span className="text-white font-bold text-lg">Total:</span>
                                    <span className="text-pink-500 font-bold text-xl">${totalPrice}</span>
                                </div>
                            </div>

                            <button 
                                className="bg-pink-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-pink-700 transition duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={cartItems.length === 0} 
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </button>

                            <Link 
                                to="/shop" 
                                className="inline-flex items-center justify-center text-gray-300 hover:text-white mt-4 w-full text-center transition duration-200"
                            >
                                <FaArrowLeft className="mr-2" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;