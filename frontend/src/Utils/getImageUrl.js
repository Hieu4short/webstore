
export const getImageUrl = (imgPath) => {
    if (!imgPath) return "/default-product.jpg";
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:5050${imgPath}`;
};