import { useState } from 'react';
import { FaBalanceScale, FaCheck } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addToComparison, removeFromComparison } from '../redux/features/comparison/comparisonSlice';
import { toast } from 'react-toastify';

const CompareButton = ({ product, className = "" }) => {
    const dispatch = useDispatch();
    const { comparisonItems } = useSelector(state => state.comparison);
    const [isAnimating, setIsAnimating] = useState(false);

    const isInComparison = comparisonItems.some(item => item._id === product._id);
    const maxCompareItems = 4;

    const handleCompare = () => {
        if (isInComparison) {
            dispatch(removeFromComparison(product._id));
            toast.info('Removed from comparison');
        } else {
            if (comparisonItems.length >= maxCompareItems) {
                toast.warning(`Maximum ${maxCompareItems} products can be compared`);
                return;
            }
            
            dispatch(addToComparison(product));
            setIsAnimating(true);
            toast.success('Added to comparison');
            
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    return (
        <button
        onClick={handleCompare}
        className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
          isInComparison 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        } ${isAnimating ? 'animate-bounce' : ''} ${className}`}
        >
            {isInComparison ? (
                <FaCheck className="text-white text-lg" />
            ) : (
                <FaBalanceScale className="text-white text-lg" />
            )}
        </button>
    );
};

export default CompareButton;