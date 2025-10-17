import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress, savePaymentMethod } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder");
    };

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress]);

    return (
        <div className="container mx-auto px-4 sm:px-6 mt-6 sm:mt-10">
            <ProgressSteps step1 step2 />
            
            <div className="mt-8 sm:mt-16 lg:mt-20 flex justify-center">
                <form onSubmit={submitHandler} className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">Shipping Information</h1>
                    
                    <div className="mb-4">
                        <label className="block text-white mb-2 text-sm sm:text-base">Address</label>
                        <input 
                            type="text" 
                            className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" 
                            placeholder="Enter address" 
                            value={address} 
                            required 
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2 text-sm sm:text-base">City</label>
                        <input 
                            type="text" 
                            className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Enter city"
                            value={city} 
                            required 
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2 text-sm sm:text-base">Postal Code</label>
                        <input 
                            type="text" 
                            className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Enter postal code"
                            value={postalCode} 
                            required 
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2 text-sm sm:text-base">Country</label>
                        <input 
                            type="text" 
                            className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Enter country"
                            value={country} 
                            required 
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white mb-3 text-sm sm:text-base">Select Payment Method</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio text-pink-500"
                                    name="paymentMethod" 
                                    value="PayPal"
                                    checked={paymentMethod === "PayPal"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-3 text-white text-sm sm:text-base">PayPal or Credit Card</span>
                            </label>
                        </div>
                    </div>
                    
                    <button
                        className="bg-pink-600 text-white py-3 px-6 rounded-lg text-base sm:text-lg font-semibold hover:bg-pink-700 transition duration-200 w-full"
                        type="submit"
                    >
                        Continue to Place Order
                    </button>
                </form>  
            </div>
        </div>
    );
};

export default Shipping;