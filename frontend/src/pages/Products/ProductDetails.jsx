import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {FaStar, FaClock, FaBox, FaShoppingCart, FaStore} from "react-icons/fa";
import moment from "moment";
import HeartIcons from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";


const ProductDetails = () => {

    const {id: productId} = useParams();
    const navigate = useNavigate();

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
    }

    return (
        <>
            <div>
                <Link to="/" className="text-white font-semibold hover:underline ml-[10rem]">Go Back</Link>
            </div>

            {isLoading ? (<Loader/>) : error ? (<Message variant="danger">{error?.data?.message || error.message}</Message>) : (
                <>
                    {/* First Part - Product Image and Details */}
                    <div className="container mx-auto px-4 mt-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column - Product Image */}
                            <div className="lg:w-2/5">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-auto max-w-md mx-auto object-contain rounded-lg"
                                    />
                                    <HeartIcons product={product}/>
                                </div>
                            </div>

                            {/* Right Column - Product Details */}
                            <div className="lg:w-3/5">
                                <div className="flex flex-col space-y-6">
                                    <h2 className="text-3xl font-bold text-white">{product.name}</h2>
                                    
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {product.description}
                                    </p>
                                    
                                    <p className="text-4xl font-extrabold text-pink-600">$ {product.price}</p>

                                    {/* Product Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <FaStore className="mr-3 text-white text-lg" />
                                                <span className="text-white">Brand: {product.brand}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaClock className="mr-3 text-white text-lg" />
                                                <span className="text-white">Added: {moment(product.createdAt).fromNow()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaStar className="mr-3 text-white text-lg" />
                                                <span className="text-white">Reviews: {product.numReviews}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <FaStar className="mr-3 text-white text-lg" />
                                                <span className="text-white">Ratings: {product.rating}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaShoppingCart className="mr-3 text-white text-lg" />
                                                <span className="text-white">Quantity: {product.quantity}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaBox className="mr-3 text-white text-lg" />
                                                <span className="text-white">In Stock: {product.countInStock}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ratings and Quantity Selector */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <Ratings value={product.rating} text={`${product.numReviews} reviews`}/>
                                        
                                        {product.countInStock > 0 && (
                                            <div className="flex items-center gap-4">
                                                <span className="text-white">Quantity:</span>
                                                <select 
                                                    value={qty} 
                                                    onChange={e => setQty(Number(e.target.value))} 
                                                    className="p-2 w-20 rounded-lg text-black"
                                                >
                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="btn-container">
                                        <button 
                                            // onClick={addToCartHandler} 
                                            disabled={product.countInStock === 0} 
                                            className="bg-pink-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Part - Product Tabs (Unchanged) */}
                    <div className="container mx-auto px-4 mt-12">
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