import {FaHeart, FaRegHeart} from "react-icons/fa";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { addToFavorites, removeFromFavorites, setFavorites } from "../../redux/features/favorites/FavoriteSlice";
import { addFavoriteToLocalStorage, removeFavoriteFromLocalStorage, getFavoritesFromLocalStorage } from "../../Utils/localStorage";

const HeartIcons = ({product}) => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites) || [];
    const isFavorite = favorites.some((p) => p._id === product._id);

    useEffect(() => {
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    }, []);

    const toggleFavorites = () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(product));
            // remove the product from the LocalStorage as well
            removeFavoriteFromLocalStorage(product._id);
        } else {
            dispatch(addToFavorites(product));
            //add the product to the LocalStorage as well
            addFavoriteToLocalStorage(product);
        }
    }

    return ( 
        <div onClick={toggleFavorites} className="absolute top-2 right-5 cursor-pointer">
            {isFavorite ? (<FaHeart className="text-pink-500"/>) : (
                <FaRegHeart onClick={toggleFavorites} className="text-gray-400"/>
            )}
        </div>
    )
};

export default HeartIcons;