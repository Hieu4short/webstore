import { useState } from 'react';
import { FaTimes, FaBalanceScale, FaChartBar } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addToComparison, removeFromComparison, clearComparison } from '../redux/features/comparison/comparisonSlice.js';
import { Link } from 'react-router-dom';

const ProductComparison = () => {

    const [isOpen, setIsOpen] = useState(false);
    const { comparisonItems } = useSelector(state => state.comparison);
    const dispatch = useDispatch();

    const maxCompareItems = 3;

    if (comparisonItems.length === 0) return null;

    return (
        <>
            {/* Comparison Button */}
            <button onClick={() => setIsOpen(true)} className="fixed bottom-24 right-6 w-14 h-14 
            bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center 
            justify-center transition-all duration-300 z-50 group">
                <FaBalanceScale className='text-xl'/>
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs 
                    rounded-full w-6 h-6 flex items-center justify-center">
                        {comparisonItems.length}
                    </span>
            </button>

            {/* Comparison Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl 
                    border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
                            <div className='flex items-center space-x-3'>
                                <FaChartBar className="text-white text-2xl" />
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Product Comparison</h2>
                                        <p className='text-blue-100 text-sm'>Compare {comparisonItems.length} product(s)</p>
                                    </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => dispatch(clearComparison())} 
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                                    Clear all
                                </button>
                                <button onClick={() => setIsOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colors text-xl">
                                        <FaTimes/>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[60vh]">
                            <table className="w-full">
                                <thead className="bg-gray-700/50 sticky top-0">
                                    <tr>
                                        <th className="x-6 py-4 text-left text-sm font-medium text-gray-300 min-w-[200px]">
                                            Product
                                        </th>
                                        {comparisonItems.map((product) => (
                                            <th key={product._id} className="px-6 py-4 text-center min-w-[250px] relative">
                                                <div className='flex flex-col items-center'>
                                                    <img src={product.image} alt={product.name} className='w-20 h-20 object-contain mb-2'/>
                                                    <h3 className='text-white font-semibold text-sm text-center'>{product.name}</h3>
                                                    <button onClick={() => dispatch(removeFromComparison(product._id))}
                                                        className='absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors'>
                                                            <FaTimes/>
                                                        </button>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-700'>
                                    {/* Price Row */}
                                    <tr className='hover:bg-gray-700/30'>
                                        <td className='px-6 py-4 text-sm font-medium text-gray-300'>
                                            Price
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className='px-6 py-4 text-center'>
                                                <span className='text-lg font-bold text-green-400'>$ {product.price}</span>
                                            </td>
                                        ))}
                                    </tr>

                                     {/* Brand Row */}
                                     <tr className="hover:bg-gray-700/30">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                            Brand
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className="px-6 py-4 text-center text-white">
                                                {product.brand}
                                            </td>
                                        ))}
                                    </tr>

                                        {/* Category Row */}
                                        <tr className="hover:bg-gray-700/30">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                            Category
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className="px-6 py-4 text-center text-white">
                                                {product.category?.name || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>

                                        {/* Rating Row */}
                                        <tr className="hover:bg-gray-700/30">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                            Rating
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="text-white">
                                                        {product.rating} ({product.numReviews} reviews)
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                        {/* Stock Row */}
                                        <tr className="hover:bg-gray-700/30">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                            In Stock
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.countInStock > 0 
                                                        ? 'bg-green-500/20 text-green-300' 
                                                        : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {product.countInStock > 0 ? `${product.countInStock} available` : 'Out of Stock'}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>

                                        {/* Description Row */}
                                        <tr className="hover:bg-gray-700/30">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                            Description
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className="px-6 py-4 text-center">
                                                <p className="text-gray-300 text-sm line-clamp-3">
                                                    {product.description}
                                                </p>
                                            </td>
                                        ))}
                                    </tr>

                                        {/* Actions Row */}
                                        <tr className="hover:bg-gray-700/30">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                            Actions
                                        </td>
                                        {comparisonItems.map((product) => (
                                            <td key={product._id} className="px-6 py-4 text-center">
                                                <div className="flex flex-col space-y-2">
                                                    <Link 
                                                        to={`/product/${product._id}`}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                                                        View Details
                                                    </Link>
                                                    <button
                                                        onClick={() => dispatch(removeFromComparison(product._id))}
                                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                            {/* Footer */}
                            <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-400 text-sm">
                                    Maximum {maxCompareItems} products can be compared
                                </p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductComparison;