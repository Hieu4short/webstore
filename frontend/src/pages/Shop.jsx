import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { FaFilter, FaTimes } from "react-icons/fa";

const Shop = () => {
    const dispatch = useDispatch();
    const { categories, products, checked, radio } = useSelector((state) => state.shop);

    const categoriesQuery = useFetchCategoriesQuery();
    const [priceFilter, setPriceFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    
    const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

    useEffect(() => {
        if (!categoriesQuery.isLoading) {
            dispatch(setCategories(categoriesQuery.data))
        }
    }, [categoriesQuery.data, dispatch]);

    useEffect(() => {
        if (!checked.length || !radio.length) {
            if (!filteredProductsQuery.isLoading) {
                const filteredProducts = filteredProductsQuery.data.filter((product) => {
                    return (
                        product.price.toString().includes(priceFilter) || 
                        product.price === parseInt(priceFilter, 10)
                    );
                });
                dispatch(setProducts(filteredProducts));
            }
        }
    }, [checked, filteredProductsQuery.data, radio, dispatch, priceFilter]);

    const handleBrandClick = (brand) => {
        const productsByBrand = filteredProductsQuery.data?.filter(
            (product) => product.brand === brand
        );
        dispatch(setProducts(productsByBrand));
    };

    const handleCheck = (value, id) => {
        const updatedChecked = value
            ? [...checked, id]
            : checked.filter((c) => c !== id);
        dispatch(setChecked(updatedChecked));
    };

    const uniqueBrands = [
        ...Array.from(
            new Set(
                filteredProductsQuery.data?.map((product) => product.brand).filter((brand) => brand !== undefined)
            )
        ),
    ];

    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value);
    };

    const resetFilters = () => {
        setPriceFilter("");
        window.location.reload();
    };

    return (
        <>
            <div className="container mx-auto px-3 sm:px-4">
                {/* Mobile Filter Toggle Button */}
                <div className="lg:hidden flex justify-between items-center mb-4 pt-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Shop Products</h1>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-pink-600 text-white p-2 rounded-lg flex items-center gap-2"
                    >
                        {showFilters ? <FaTimes /> : <FaFilter />}
                        <span className="text-sm">Filters</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Filter Sidebar */}
                    <div className={`
                        bg-[#151515] rounded-lg lg:w-64 xl:w-72 transition-all duration-300
                        ${showFilters 
                            ? 'block fixed inset-0 z-50 overflow-y-auto lg:static lg:inset-auto' 
                            : 'hidden lg:block'
                        }
                    `}>
                        {/* Mobile Header */}
                        {showFilters && (
                            <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-700">
                                <h2 className="text-lg font-semibold text-white">Filters</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        )}

                        <div className="p-4 sm:p-6">
                            {/* Categories Filter */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-center py-2 bg-black rounded-full mb-4 text-white">
                                    Filter by Categories
                                </h2>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {categories?.map((c) => (
                                        <div key={c._id} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id={`category-${c._id}`}
                                                onChange={(e) => handleCheck(e.target.checked, c._id)}
                                                className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                                            />
                                            <label 
                                                htmlFor={`category-${c._id}`}
                                                className="ml-3 text-sm font-medium text-white cursor-pointer"
                                            >
                                                {c.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Brands Filter */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-center py-2 bg-black rounded-full mb-4 text-white">
                                    Filter by Brands
                                </h2>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {uniqueBrands?.map((brand) => (
                                        <div key={brand} className="flex items-center">
                                            <input 
                                                type="radio" 
                                                id={`brand-${brand}`}
                                                name="brand"
                                                onChange={() => handleBrandClick(brand)}
                                                className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 focus:ring-2"
                                            />
                                            <label 
                                                htmlFor={`brand-${brand}`}
                                                className="ml-3 text-sm font-medium text-white cursor-pointer"
                                            >
                                                {brand}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-center py-2 bg-black rounded-full mb-4 text-white">
                                    Filter by Price
                                </h2>
                                <div className="p-2">
                                    <input 
                                        type="text" 
                                        placeholder="Enter Price" 
                                        value={priceFilter} 
                                        onChange={handlePriceChange}
                                        className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-black"
                                    />
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="pt-2">
                                <button 
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="flex-1">
                        {/* Desktop Header */}
                        <div className="hidden lg:flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white">Shop Products</h1>
                            <div className="text-gray-300">
                                <span className="bg-gray-700 px-3 py-1 rounded-full">
                                    {products?.length} Products
                                </span>
                            </div>
                        </div>

                        {/* Mobile Products Count */}
                        <div className="lg:hidden text-center mb-4">
                            <span className="bg-gray-700 px-3 py-1 rounded-full text-gray-300">
                                {products?.length} Products
                            </span>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {products.length === 0 ? (
                                <div className="col-span-full flex justify-center py-12">
                                    <Loader />
                                </div>
                            ) : (
                                products?.map((p) => (
                                    <div key={p._id} className="flex justify-center">
                                        <ProductCard p={p} />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* No Products Message */}
                        {!filteredProductsQuery.isLoading && products.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-400 text-lg">No products found matching your filters.</p>
                                <button 
                                    onClick={resetFilters}
                                    className="mt-4 bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition duration-200"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Overlay */}
                {showFilters && (
                    <div 
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowFilters(false)}
                    />
                )}
            </div>
        </>
    );
};

export default Shop;