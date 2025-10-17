import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import moment from "moment";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
            components: "buttons,funding",
            "enable-funding": "paylater",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Order Items */}
        <div className="lg:flex-1">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Order Items</h2>
            
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
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
                      <div className="text-gray-300 text-sm mt-1">Quantity: {item.qty}</div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-white font-semibold">${item.price}</div>
                      <div className="text-gray-300 text-sm">Total: ${(item.qty * item.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 xl:w-96">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 sticky top-4">
            {/* Shipping Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-white">Shipping Information</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong className="text-pink-500">Order:</strong> {order._id}
                </p>
                <p>
                  <strong className="text-pink-500">Name:</strong> {order.user.username}
                </p>
                <p>
                  <strong className="text-pink-500">Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong className="text-pink-500">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                <p>
                  <strong className="text-pink-500">Method:</strong> {order.paymentMethod}
                </p>
              </div>
              
              {order.isPaid ? (
                <Message variant="success" className="mt-4">
                  Paid on {moment(order.paidAt).format('MMM Do YYYY, h:mm a')}
                </Message>
              ) : (
                <Message variant="danger" className="mt-4">Not paid yet</Message>
              )}
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Items</span>
                  <span className="text-white">$ {order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white">$ {order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span className="text-white">$ {order.taxPrice}</span>
                </div>
                <div className="flex justify-between border-t border-gray-600 pt-2">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-pink-500 font-bold">$ {order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {!order.isPaid && (
              <div className="mb-6">
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    <PayPalButtons 
                      createOrder={createOrder}
                      onApprove={onApprove} 
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Deliver Button */}
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div>
                <button 
                  type="button" 
                  className="bg-pink-600 text-white w-full py-3 rounded-lg hover:bg-pink-700 transition duration-200"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;