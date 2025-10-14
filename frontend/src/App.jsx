import {Outlet} from "react-router-dom"; 
import Navigation from "./pages/Auth/Navigation";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductComparison from "./components/ProductComparison";
import { useSelector } from "react-redux";


function App() {
  const { comparisonItems } = useSelector(state => state.comparison);
  
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>

      {comparisonItems && comparisonItems.length > 0 && <ProductComparison />}
    </>
  )
}

export default App;
