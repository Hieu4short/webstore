import { useState } from "react";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { 
    useFetchCategoriesQuery,
    useCreateCategoryMutation, 
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation 
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaFolder, FaTag } from "react-icons/fa";

const CategoryList = () => {
    const { data: categories, isLoading, error, refetch } = useFetchCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [name, setName] = useState("");
    const [editableCategoryId, setEditableCategoryId] = useState(null);
    const [editableCategoryName, setEditableCategoryName] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Category name is required");
            return;
        }

        try {
            await createCategory({ name }).unwrap();
            toast.success("Category created successfully");
            setName("");
            setShowCreateForm(false);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    const handleUpdate = async (id) => {
        if (!editableCategoryName) {
            toast.error("Category name is required");
            return;
        }

        try {
            await updateCategory({ categoryId: id, updatedCategory: { name: editableCategoryName } }).unwrap();
            toast.success("Category updated successfully");
            setEditableCategoryId(null);
            setEditableCategoryName("");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id).unwrap();
                toast.success("Category deleted successfully");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        }
    };

    const toggleEdit = (id, currentName) => {
        setEditableCategoryId(id);
        setEditableCategoryName(currentName);
    };

    const cancelEdit = () => {
        setEditableCategoryId(null);
        setEditableCategoryName("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Admin Menu */}
                    <div className="lg:w-1/4 xl:w-1/5">
                        <AdminMenu />
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4 xl:w-4/5">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.message}
                            </Message>
                        ) : (
                            <div className="space-y-6">
                                {/* Header Section */}
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3">
                                            <FaFolder className="text-pink-500 text-xl sm:text-2xl" />
                                            <div>
                                                <h1 className="text-xl sm:text-2xl font-bold text-white">Category Management</h1>
                                                <p className="text-gray-400 text-sm sm:text-base">Manage product categories and organization</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowCreateForm(!showCreateForm)}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200 w-full sm:w-auto"
                                        >
                                            <FaPlus className="mr-2" />
                                            New Category
                                        </button>
                                    </div>
                                </div>

                                {/* Create Category Form */}
                                {showCreateForm && (
                                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Create New Category</h3>
                                        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
                                            <label htmlFor="newCategoryName" className="sr-only">Category Name</label>
                                            <input
                                                type="text"
                                                id="newCategoryName"
                                                name="newCategoryName"
                                                placeholder="Enter category name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            />
                                            <div className="flex gap-2 sm:gap-4">
                                                <button
                                                    type="submit"
                                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                                >
                                                    Create
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCreateForm(false)}
                                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Categories Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {categories?.map((category, index) => (
                                        <div
                                            key={category._id}
                                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-4 sm:p-6 hover:border-pink-500 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3 min-w-0">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaTag className="text-pink-500 text-sm sm:text-base" />
                                                    </div>
                                                    {editableCategoryId === category._id ? (
                                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FaTag className="text-pink-500 text-sm sm:text-base" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor={`editCategoryName-${category._id}`} className="sr-only">Edit Category Name</label>
                                                            <input
                                                                type="text"
                                                                id={`editCategoryName-${category._id}`}
                                                                name={`editCategoryName-${category._id}`}
                                                                value={editableCategoryName}
                                                                onChange={(e) => setEditableCategoryName(e.target.value)}
                                                                className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                                                        {category.name}
                                                    </h3>
                                                )}
                                                </div>
                                                <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded flex-shrink-0 ml-2">
                                                    #{index + 1}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-400 truncate flex-1 mr-2">
                                                    ID: {category._id.substring(0, 8)}...
                                                </div>
                                                <div className="flex items-center space-x-2 flex-shrink-0">
                                                    {editableCategoryId === category._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdate(category._id)}
                                                                className="p-1 sm:p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                                            >
                                                                <FaCheck className="text-xs sm:text-sm" />
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="p-1 sm:p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                                                            >
                                                                <FaTimes className="text-xs sm:text-sm" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => toggleEdit(category._id, category.name)}
                                                                className="p-1 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                                            >
                                                                <FaEdit className="text-xs sm:text-sm" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category._id)}
                                                                className="p-1 sm:p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                                            >
                                                                <FaTrash className="text-xs sm:text-sm" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {(!categories || categories.length === 0) && (
                                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-8 sm:p-12 text-center">
                                        <FaFolder className="mx-auto text-3xl sm:text-4xl text-gray-500 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-400 mb-2">No categories found</h3>
                                        <p className="text-gray-500 mb-4">Get started by creating your first category.</p>
                                        <button
                                            onClick={() => setShowCreateForm(true)}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            <FaPlus className="mr-2" />
                                            Create Category
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;