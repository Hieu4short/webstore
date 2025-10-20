import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Fetch product by ID
  const { data: productData, refetch } = useGetProductByIdQuery(params._id);

  // States
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Queries & Mutations
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // When product data changes, update state
  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || productData.category || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock || 0);
    }
  }, [productData]);

  // Upload image handler - FIXED
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiển thị preview ảnh ngay lập tức
    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
    setImageFile(file);

    // Tự động upload ảnh lên server
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", { position: "top-right" });
      // Cập nhật đường dẫn ảnh từ server
      setImage(res.image);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.data?.message || "Image upload failed", { position: "top-right" });
      // Rollback preview nếu upload thất bại
      setImage(productData?.image || "");
      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle update - FIXED FOR IMAGE
// Handle update - FIXED FOR IMAGE
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (isUploading) {
    toast.warning("Please wait for image upload to complete", { position: "top-right" });
    return;
  }

  try {
    const formData = new FormData();

    // Append all product data
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("quantity", quantity.toString());
    formData.append("brand", brand);
    formData.append("countInStock", stock.toString());

    // QUAN TRỌNG: Luôn gửi image field với đường dẫn ảnh hiện tại
    formData.append("image", image);

    console.log("Updating product with image path:", image);

    const result = await updateProduct({ 
      productId: params._id, 
      formData 
    });

    if (result?.error) {
      console.error("Update error:", result.error);
      const errorMessage = result.error.data?.message || result.error.data?.error || "Update failed";
      toast.error(errorMessage, { position: "top-right" });
    } else {
      toast.success("Product successfully updated", { position: "top-right" });
      await refetch();
      navigate("/admin/allproductslist");
    }
  } catch (err) {
    console.error("Submit error:", err);
    toast.error("Product update failed", { position: "top-right" });
  }
};

  // Handle delete
  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;

      const result = await deleteProduct(params._id);

      if (result?.error) {
        toast.error(result.error, { position: "top-right" });
      } else {
        toast.success("Product deleted successfully!", { position: "top-right" });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Product deletion failed.", { position: "top-right" });
    }
  };

  // Helper để fix đường dẫn ảnh
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("blob:")) return imgPath; // Cho blob URLs (preview)
    return `http://localhost:5050${imgPath}`;
  };

  // Remove image
  const handleRemoveImage = () => {
    setImage("");
    setImageFile(null);
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 font-bold text-xl text-white">Update / Delete Product</div>

          <div className="mb-3">
            <label className="border border-gray-300 text-white py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold hover:bg-gray-800 transition duration-200">
              {image ? "Change Image" : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="text-center text-yellow-500 mt-2">Uploading image...</div>
            )}
          </div>

          {image && (
            <div className="text-center my-4 relative">
              <img
                src={getImageUrl(image)}
                alt="product"
                className="block mx-auto max-h-[200px] object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one mb-4">
                <label htmlFor="name" className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="two mb-4">
                <label htmlFor="price" className="block text-white mb-2">Price</label>
                <input
                  type="number"
                  className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-white mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="brand" className="block text-white mb-2">Brand</label>
                <input
                  type="text"
                  className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-white mb-2">Description</label>
              <textarea
                className="p-4 bg-[#101011] border rounded-lg w-[95%] text-white h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <div className="mb-4">
                <label htmlFor="stock" className="block text-white mb-2">Count In Stock</label>
                <input
                  type="number"
                  className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-white mb-2">Category</label>
                <select
                  className="p-4 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="py-4 px-10 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 transition duration-200 disabled:bg-gray-600"
              >
                {isUploading ? "Uploading..." : "Update"}
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-10 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;