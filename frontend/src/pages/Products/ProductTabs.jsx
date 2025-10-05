import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import moment from "moment";

const ProductTabs = ({
    loadingProductReview, 
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product
}) => {
    const { data, isLoading } = useGetTopProductsQuery();

    const [activeTab, setActiveTab] = useState(1);

    if (isLoading) {
        return <Loader />;
    }

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <section className="mr-[5rem]">
                <div className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 1 ? "font-bold" : " "}`} 
                onClick={() => handleTabClick(1)}>Write your reviews</div>

                <div className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 2 ? "font-bold" : " "}`} 
                onClick={() => handleTabClick(2)}>All reviews</div>

                <div className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 3 ? "font-bold" : " "}`} 
                onClick={() => handleTabClick(3)}>Related products</div>
            </section>

            {/* Second Part */}
            <section>
                {activeTab === 1 && (
                    <div className="mt-4">
                        {userInfo ? (
                            <form onSubmit={submitHandler}>
                                <div className="my-2">
                                    <label htmlFor="rating" className="block text-xl mb-2">Rating</label>

                                    <select id="rating" required value={rating} onChange={(e) => setRating(e.target.value)} 
                                    className="p-2 border rounded-lg xl:w-[40rem] text-black"
                                    >
                                        <option value="1">Inferior</option>
                                        <option value="2">Decent</option>
                                        <option value="3">Great</option>
                                        <option value="4">Excellent</option>
                                        <option value="5">Exceptional</option>
                                    </select>
                                </div>

                                <div className="my-2">
                                    <label htmlFor="comment" className="block text-xl mb-2">Comment</label>

                                    <textarea id="comment" rows="3" required value={comment} onChange={e => setComment(e.target.value)} 
                                    className="p-2 border rounded-lg xl:w-[40rem] text-black"></textarea>
                                </div>

                                <button className="bg-pink-600 text-white py-2 px-4 rounded-lg" type="submit" disabled={loadingProductReview}>Submit</button>
                            </form>
                        ) : (
                            <p>Please <Link to="/login">sign in</Link> to write a review</p>
                        )}
                    </div>
                )}
            </section>

            {activeTab === 2 && (
                <section>
                    <div>
                        {product.reviews.length === 0 ? (
                            <Message>No Reviews</Message>
                        ) : (
                            <div>
                                {product.reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-[#151515] p-4 rounded-lg mb-5 xl:w-[40rem]"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-semibold">{review.name}</p>
                                            <p className="text-gray-400 text-sm">
                                                {moment(review.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                                            </p>
                                        </div>
                                        <Ratings value={review.rating} />
                                        <p className="mt-2">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {activeTab === 3 && (
                <section className="xl:ml-[4rem] mt-5">
                    <h1 className="text-2xl font-bold mb-6">Related Products</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data?.map((product) => (
                            <div key={product._id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition duration-200">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-contain rounded mb-4"
                                    />
                                    <h3 className="text-white font-semibold text-center mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-pink-600 font-bold text-lg">$ {product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductTabs;