import {Outlet} from "react-router-dom"; 
import Navigation from "./pages/Auth/Navigation";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductComparison from "./components/ProductComparison";
import { useSelector } from "react-redux";
import ChatbotWidget from './components/ChatbotWidget';


function App() {
  const { comparisonItems } = useSelector(state => state.comparison);
  
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3 md:ml-[4%]">
        <Outlet />
      </main>

      {comparisonItems && comparisonItems.length > 0 && <ProductComparison />}

      <ChatbotWidget />
    </>
  )
}

export default App;
