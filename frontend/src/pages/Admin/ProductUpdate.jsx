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
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock || 0);
    }
  }, [productData]);

  // Upload image handler
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", { position: "top-right" });
      setImage(res.image); // lưu lại đường dẫn trả về từ backend
    } catch (err) {
      toast.error("Image upload failed", { position: "top-right" });
    }
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (image instanceof File) {
        formData.append("image", image);
      } else {
        formData.append("image", image); 
      }

      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const result = await updateProduct({ productId: params._id, formData });

      if (result?.error) {
        toast.error(result.error, { position: "top-right" });
      } else {
        toast.success("Product successfully updated", { position: "top-right" });
        refetch();
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
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
    return `http://localhost:5050${imgPath}`;
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Update / Delete Product</div>

          {image && (
            <div className="text-center">
              <img
                src={getImageUrl(image)}
                alt="product"
                className="block mx-auto max-h-[150px] object-cover"
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="productImage" className="text-white py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? "Change Image" : "Upload Image"}
              <input
                type="file"
                id="productImage"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  name="name"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="two">
                <label htmlFor="price">Price</label> <br />
                <input
                  type="number"
                  name="price"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div>
                <label htmlFor="quantity">Quantity</label> <br />
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand">Brand</label> <br />
                <input
                  type="text"
                  name="brand"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="description" className="my-5">
              Description
            </label>
            <textarea
              name="description"
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-between">
              <div>
                <label htmlFor="stock">Count In Stock</label> <br />
                <input
                  type="number"
                  name="countInStock"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="category">Category</label> <br />
                <select
                  name="category"
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
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
