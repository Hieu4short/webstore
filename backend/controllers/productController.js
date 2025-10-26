import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        console.log("Request file:", req.file); 
        console.log("Request body:", req.body); 
        
        const {name, description, price, category, quantity, brand, imageUrl} = req.body;
        
        // Validation
        switch (true) {
            case !name: return res.status(400).json({error: "Name is required"});
            case !description: return res.status(400).json({error: "Description is required"});
            case !price: return res.status(400).json({error: "Price is required"});
            case !category: return res.status(400).json({error: "Category is required"});
            case !quantity: return res.status(400).json({error: "Quantity is required"});
            case !brand: return res.status(400).json({error: "Brand is required"});    
        }

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            quantity: Number(quantity),
            brand,
            image: req.file ? `/uploads/${req.file.filename}` : imageUrl || null
        };

        console.log("Product data to save:", productData); 

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({error: error.message})
    }
});

const updateProductDetails = asyncHandler(async (req,res) => {
    try {
        console.log("Update request body:", req.body);
        console.log("Update request file:", req.file);

        const { name, description, price, category, quantity, brand, countInStock } = req.body;
        
        // Validation
        const requiredFields = { name, description, price, category, quantity, brand };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` });
            }
        }

        // Check if product exists
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        const updateData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            quantity: Number(quantity),
            brand: brand.trim(),
            countInStock: Number(countInStock || existingProduct.countInStock)
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
            console.log("New image uploaded:", updateData.image);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        console.log("Updated product with image:", product.image);
        res.json(product);

    } catch (error) {
        console.error("Update error:", error);
        res.status(400).json({ error: error.message });
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: "i"}} : {};
        const count = await Product.countDocuments({...keyword});
        const products = await Product.find({...keyword}).limit(pageSize);

        res.json({products, page: 1, pages: Math.ceil(count / pageSize), hasMore: false});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

const fetchProductById = asyncHandler(async(req, res) => {
     try {
        const product = await Product.findById(req.params.id);

        if (product) {
            return res.json(product);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
     } catch (error) {
        console.error(error);
        res.status(404).json({error: "Product not found"});
     }
});

const fetchAllProducts = asyncHandler(async(req, res) => {
    try {
        const products = await Product.find({})
        .populate('category')
        .limit(12)
        .sort({createAt: -1});
        res.json(products); 
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

const addProductReview = asyncHandler (async(req, res) => {
    try {
        const {rating, comment} = req.body;
        const product = await Product.findById(req.params.id);

        if(product) {
            const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

            if(alreadyReviewed) {
                res.status(400);
                throw new Error("Product already reviewed");
            }

            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            }

            product.reviews.push(review);
            product.numReviews = product.reviews.length;

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({message: "Review added"});
        } else {
            res.status(404);
            throw new Error("Product not found");
        }

    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({rating: -1}).limit(4);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({_id: -1}).limit(5);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

const filterProducts = asyncHandler(async (req, res) => {
    try {
        const {checked, radio} = req.body;

        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

export {
    addProduct, 
    updateProductDetails,
    removeProduct, 
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
};