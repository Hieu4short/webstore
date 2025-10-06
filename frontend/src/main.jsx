// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Home from "./pages/Home.jsx";
import {Route, RouterProvider, createRoutesFromElements} from "react-router";
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/features/store.js';

//Private route
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './pages/Admin/AdminRoute.jsx';

//Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Profile from './pages/User/Profile.jsx';
import UserList from './pages/Admin/UserList.jsx';
import CategoryList from './pages/Admin/CategoryList.jsx';
import AllProducts from './pages/Admin/AllProducts.jsx';
import ProductList  from './pages/Admin/ProductList.jsx';
import ProductUpdate  from './pages/Admin/ProductUpdate.jsx';

import Favorites from './pages/Products/Favorites.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';

import Cart from './pages/Cart.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route index={true} path='/' element={<Home />}></Route>
      <Route path='/shop' element={<Home />}></Route>
      <Route path='/favorite' element={<Favorites />}></Route>
      <Route path='/product/:id' element={<ProductDetails />}></Route>
      <Route path='/cart' element={<Cart />}></Route> 


      <Route path='' element={< PrivateRoute />} >
        <Route path='/profile' element={<Profile />}/>
      </Route>


      {/* Admin routes */}
      <Route path='/admin' element={< AdminRoute />}>
        <Route path='userlist' element={<UserList />}></Route>
        <Route path='categorylist' element={<CategoryList/>}></Route>
        <Route path='allproductslist' element={<AllProducts/>}></Route>
        <Route path='productlist/:pageNumber?' element={<ProductList/> }></Route>
        <Route path='product/update/:_id' element={<ProductUpdate/> }></Route>

      </Route>
    </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <RouterProvider router={router} />
  </Provider>
);
