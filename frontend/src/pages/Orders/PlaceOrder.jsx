import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {cart.cartItems.length === 0 ? (
          <div className="text-center py-12">
            <Message>Your cart is empty</Message>
            <Link to="/shop" className="text-pink-500 hover:text-pink-400 mt-4 inline-block">
              Go back to shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Order Items */}
            <div className="lg:flex-1">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Order Items</h2>
                
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/product/${item.product}`} 
                          className="text-pink-500 font-semibold hover:text-pink-400 text-base sm:text-lg line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="text-gray-300 text-sm mt-1">Qty: {item.qty}</div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-white font-semibold text-lg">${item.price.toFixed(2)}</div>
                        <div className="text-gray-300 text-sm">Total: ${(item.qty * item.price).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 xl:w-96">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Items:</span>
                    <span className="text-white font-semibold">${cart.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping:</span>
                    <span className="text-white font-semibold">${cart.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax:</span>
                    <span className="text-white font-semibold">${cart.taxPrice}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-3">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-pink-500 font-bold text-xl">${cart.totalPrice}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Shipping</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                  </p>
                </div>

                {/* Payment Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Payment Method</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Method:</strong> {cart.paymentMethod}
                  </p>
                </div>

                {error && (
                  <div className="mb-4">
                    <Message variant="danger">{error.data.message}</Message>
                  </div>
                )}

                <button
                  type="button"
                  className="bg-pink-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-pink-700 transition duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cart.cartItems.length === 0} 
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>

                {isLoading && (
                  <div className="mt-4">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;