import { useState } from "react";
import { useCreateCategoryMutation } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const CategoryList = () => {
    const [name, setName] = useState("");
    const [createCategory] = useCreateCategoryMutation();

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await createCategory({name}).unwrap();
            if(res.error) {
                toast.error(res.error);
            } else {
                setName("");
                toast.success(`${res.name} is created`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Creating category failed");
        }
    };

    return (
        <div className="ml-[10rem] flex flex-col items-center justify-center">
            <div className="md:w-3/4 p-3">
                <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>
                <form onSubmit={handleCreateCategory} className="flex flex-col">
                    <input 
                        type="text" 
                        className="w-full p-3 mb-3 border rounded-lg bg-[#151515] text-white"
                        placeholder="Enter Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                        Create Category
                    </button>
                </form>
                {/* Category List will go here */}
            </div>
        </div>
    );
};

export default CategoryList;
