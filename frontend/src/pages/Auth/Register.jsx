import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

        const dispatch = useDispatch();
        const navigate = useNavigate();

        const [register, {isLoading}] = useRegisterMutation();
        const {userInfo} = useSelector(state => state.auth);

        const {search} = useLocation();
        const sp = new URLSearchParams(search);
        const redirect = sp.get('redirect') || '/';

        useEffect(() => {
            if(userInfo) {
                navigate(redirect)
            }
        }, [navigate, redirect, userInfo]);

        const submitHandler = async (e) => {
            e.preventDefault()

            if(password !== confirmPassword) {
                toast.error('Passwords do not match. Please try again!');
            } else {
                try {
                    const res = await register({username, email, password}).unwrap();
                    dispatch(setCredentials({...res}));
                    navigate(redirect);
                    toast.success('User account successfully registered');
                } catch (error) {
                    console.log(error)
                    toast.error(error.data.message)
                }
            }
        }

    return <section className="flex w-full h-screen">
    {/* Left - Form */}
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md p-10">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
  
        <form onSubmit={submitHandler} className="w-full">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
  
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter Your Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
  
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
  
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
  
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
  
          {isLoading && <Loader />}
        </form>
  
        <div className="mt-6">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  
    {/* Right - Image */}
    <div className="flex-1 hidden md:block">
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80"
        alt="Register Visual"
        className="h-full w-full object-cover rounded-lg"
      />
    </div>
  </section>  
};

export default Register;