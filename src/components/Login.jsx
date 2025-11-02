import * as Yup from 'yup';
import { useFormik } from 'formik';
import { showToast, makeRequest } from '../utils/util';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userData = {
          username: values.username,
          password: values.password
        };
        
        const response = await makeRequest("login", "Auth", userData);
        const data = response;

        if (data?.returnCode !== 0) {
          const errorMessage = data?.returnMessage || 'Login failed. Please try again.';
          setFieldError('general', errorMessage);
          showToast(errorMessage, 'error');
          return;
        }

        const { token, user } = data?.returnObject || {};
        
        if (!token || !user) {
          const errorMessage = 'Server is misbehaved. Please try again later.';
          setFieldError('general', errorMessage);
          showToast(errorMessage, 'error');
          return;
        }

        dispatch(loginSuccess({ token, user }));
        
        formik.resetForm();
        showToast('Login successful', 'success');

        const savedPage = localStorage.getItem('lastVisitedPage') || 'dashboard';
        
        // console.log('savedPage value:', savedPage);
        // console.log('Navigating to:', `/layout/${savedPage}`);

        const targetPath = `/layout/${savedPage}`;
        navigate(targetPath, { replace: true });

      } catch (error) {
        console.error('Login error:', error);
        showToast('An error occurred during login', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#101828] text-white px-4">
      <img src={logo} alt="Logo" className="w-50 h-16 mb-8" />

      <div className="w-full max-w-md border border-white/30 shadow-lg rounded-xl p-8 bg-[#1A2234]/70 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${
                formik.touched.username && formik.errors.username
                  ? 'border-red-500 ring-red-400'
                  : 'border-gray-400 focus:ring-green-400'
              }`}
              placeholder="Enter your username"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500 ring-red-400'
                  : 'border-gray-400 focus:ring-green-400'
              }`}
              placeholder="********"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition-colors"
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-500"></div>
          <p className="mx-3 text-sm text-gray-300 whitespace-nowrap">or</p>
          <div className="flex-1 h-px bg-gray-500"></div>
        </div>

        <p className="text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <a
          onClick={()=>{navigate('/signup')}}
           className="text-blue-400 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;