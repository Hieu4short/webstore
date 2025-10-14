import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductsMutation,
        useUploadProductImageMutation,
 } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FaUpload, FaPlusCircle } from "react-icons/fa";

const ProductList = () => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductsMutation();
    const {data: categories} = useFetchCategoriesQuery();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = new FormData();
            productData.append("image", image);
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("category", category);
            productData.append("quantity", quantity);
            productData.append("brand", brand);
            productData.append("countInStock", stock);
            
            const {data} = await createProduct(productData);

            if (data.error) {
                toast.error("Product create failed, please try again!");
            } else {
                toast.success(`${data.name} is created`);
                navigate("/admin/allproductslist");
            }

        } catch (error) {
            console.error(error);
            toast.error("Product create failed, please try again!");
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            setImage(res.image);
            setImageUrl(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/5">
                        <AdminMenu /> 
                    </div>
                    
                    <div className="lg:w-4/5">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-6">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center space-x-3 mb-2">
                                    <FaPlusCircle className="text-pink-500 text-2xl" />
                                    <h1 className="text-2xl font-bold text-white">Create New Product</h1>
                                </div>
                                <p className="text-gray-400">Add a new product to your store inventory</p>
                            </div>

                            {/* Image Upload Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Product Image
                                </label>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Image Preview */}
                                    {imageUrl && (
                                        <div className="flex-shrink-0">
                                            <div className="bg-gray-700 rounded-lg p-2 border border-gray-600">
                                                <img 
                                                    src={imageUrl} 
                                                    alt="product" 
                                                    className="w-48 h-48 object-cover rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Upload Area */}
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-200">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                name="image" 
                                                accept="image/*" 
                                                onChange={uploadFileHandler} 
                                                className="hidden"
                                            />
                                        </label>
                                        {image && (
                                            <p className="mt-2 text-sm text-green-400 flex items-center">
                                                <FaUpload className="mr-2" />
                                                {image.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Product Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Price Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Product Name *
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            value={name} 
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Price ($) *
                                        </label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            value={price} 
                                            onChange={e => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Quantity and Brand Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Quantity *
                                        </label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            value={quantity} 
                                            onChange={e => setQuantity(e.target.value)}
                                            placeholder="Enter quantity"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Brand *
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            value={brand} 
                                            onChange={e => setBrand(e.target.value)}
                                            placeholder="Enter brand name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea 
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[120px]"
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Enter product description..."
                                        required
                                    />
                                </div>

                                {/* Stock and Category Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Count in Stock *
                                        </label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            value={stock} 
                                            onChange={e => setStock(e.target.value)}
                                            placeholder="Enter stock count"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Category *
                                        </label>
                                        <select 
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            onChange={e => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose a category</option>
                                            {categories?.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6 border-t border-gray-700">
                                    <button 
                                        type="submit"
                                        className="inline-flex items-center px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        <FaPlusCircle className="mr-2" />
                                        Create Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;