import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {FaStar, FaClock, FaBox, FaShoppingCart, FaStore} from "react-icons/fa";
import moment from "moment";
import HeartIcons from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart  } from "../../redux/features/cart/cartSlice";
import CompareButton from "../../components/CompareButton";

const ProductDetails = () => {
    const {id: productId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    
    const {data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);
    const {userInfo} = useSelector(state => state.auth);
    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
                productId, rating, comment
            }).unwrap();
            refetch();
            toast.success("Reviews created successfully!");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}));
        navigate("/cart");
    }

    return (
        <>
            {/* Go Back Link - Fixed responsive margin */}
            <div className="container mx-auto px-4 mt-4">
                <Link 
                    to="/" 
                    className="inline-block text-white font-semibold hover:underline mb-4 sm:mb-6"
                >
                    ← Go Back
                </Link>
            </div>

            {isLoading ? (<Loader/>) : error ? (<Message variant="danger">{error?.data?.message || error.message}</Message>) : (
                <>
                    {/* First Part - Product Image and Details */}
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                            {/* Left Column - Product Image */}
                            <div className="lg:w-2/5 xl:w-2/5">
                                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6">
                                    <div className="relative">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-auto max-w-full mx-auto object-contain rounded-lg"
                                        />
                                        <HeartIcons product={product}/>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Details */}
                            <div className="lg:w-3/5 xl:w-3/5">
                                <div className="flex flex-col space-y-4 sm:space-y-6">
                                    {/* Product Name */}
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                                        {product.name}
                                    </h2>
                                    
                                    {/* Product Description */}
                                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                                        {product.description}
                                    </p>
                                    
                                    {/* Product Price */}
                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-pink-600">
                                        $ {product.price}
                                    </p>

                                    {/* Product Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-center">
                                                <FaStore className="mr-2 sm:mr-3 text-white text-base sm:text-lg flex-shrink-0" />
                                                <span className="text-white text-sm sm:text-base">Brand: {product.brand}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaClock className="mr-2 sm:mr-3 text-white text-base sm:text-lg flex-shrink-0" />
                                                <span className="text-white text-sm sm:text-base">Added: {moment(product.createdAt).fromNow()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaStar className="mr-2 sm:mr-3 text-white text-base sm:text-lg flex-shrink-0" />
                                                <span className="text-white text-sm sm:text-base">Reviews: {product.numReviews}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-center">
                                                <FaStar className="mr-2 sm:mr-3 text-white text-base sm:text-lg flex-shrink-0" />
                                                <span className="text-white text-sm sm:text-base">Ratings: {Math.round(product.rating * 10) / 10}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaBox className="mr-2 sm:mr-3 text-white text-base sm:text-lg flex-shrink-0" />
                                                <span className="text-white text-sm sm:text-base">In Stock: {product.countInStock}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ratings and Quantity Selector */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                                        <div className="flex-1">
                                            <Ratings 
                                                value={product.rating} 
                                                text={`${product.numReviews} reviews`}
                                            />
                                        </div>
                                        
                                        {product.countInStock > 0 && (
                                            <div className="flex items-center gap-3 sm:gap-4 bg-gray-700 px-3 sm:px-4 py-2 rounded-lg">
                                                <span className="text-white text-sm sm:text-base whitespace-nowrap">Quantity:</span>
                                                <select 
                                                    value={qty} 
                                                    onChange={e => setQty(Number(e.target.value))} 
                                                    className="p-2 w-16 sm:w-20 rounded-lg text-black text-sm sm:text-base"
                                                >
                                                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                                        {/* Add to Cart Button */}
                                        <button 
                                            onClick={addToCartHandler} 
                                            disabled={product.countInStock === 0} 
                                            className="flex-1 bg-pink-600 text-white py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg font-semibold hover:bg-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                        
                                        {/* Compare Button */}
                                        <div className="xs:flex-shrink-0">
                                            <CompareButton product={product} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Part - Product Tabs */}
                    <div className="container mx-auto px-4 mt-8 sm:mt-12">
                        <ProductTabs 
                            loadingProductReview={loadingProductReview} 
                            userInfo={userInfo}
                            submitHandler={submitHandler}
                            rating={rating}
                            setRating={setRating}
                            comment={comment}
                            setComment={setComment}
                            product={product}
                        />
                    </div>
                </>
            )}
        </>
    )
};

export default ProductDetails;