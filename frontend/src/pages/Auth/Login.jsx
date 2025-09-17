import { useState, useEffect  } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {isLoading}] = useLoginMutation();
    const {userInfo} = useSelector(state => state.auth);
    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            const res = await login({email, password}).unwrap()
            console.log(res);
            dispatch(setCredentials({...res}))
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }

    return <div>
<section className="flex w-full h-screen">
  {/* Left - Form */}
  <div className="flex-1 flex items-center justify-center">
    <div className="w-full max-w-md p-10">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>

      <form onSubmit={submitHandler} className="w-full">
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-2 p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-black">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-2 p-2 border rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="bg-pink-500 text-black px-4 py-2 rounded cursor-pointer my-4"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {isLoading && <>Loader</>}
      </form>

      <div className="mt-6">
        <p className="text-black">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-pink-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  </div>

  {/* Right - Image */}
  <div className="flex-1 hidden md:block">
    <img
      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80"
      alt="Login Visual"
      className="h-full w-full object-cover rounded-lg"
    />
  </div>
</section>

    </div>
};

export default Login;