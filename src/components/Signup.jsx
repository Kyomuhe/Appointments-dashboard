import logo from '../assets/logo.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showToast, makeRequest } from '../utils/util';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape(
    {
      firstName: Yup.string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters')
        .required('First name is required'),
      lastName: Yup.string()
        .trim()
        .min(5, 'Last name must be at least 5 characters ')
        .max(50, 'Last name cannot exceed 50 characters')
        .required('Last name is required'),
      username: Yup.string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .required('Username is required'),
      email: Yup.string()
        .trim()
        .email('invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'password must be at least 8 characters')

    }
  );

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password
        };

        const response = await makeRequest('signup', 'Auth', userData);
        const data = response;

        if (data?.returnCode !== 0) {
          const errorMessage = data?.returnMessage || 'Signup failed';
          setFieldError('general', errorMessage);
          showToast(errorMessage, 'error');
          return;
        }

        const { token, user, refreshToken } = data?.returnObject || {};

        if (!token || !user) {
          const errorMessage = 'Signup failed - no token or user data received';
          setFieldError('general', errorMessage);
          showToast(errorMessage, 'error');
          return;
        }

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refreshToken', refreshToken);

        showToast('Account created successfully', 'success');
        formik.resetForm();

        navigate('/layout');

      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
        setFieldError('general', errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-sky-50 dark:bg-[#101828] dark:text-white px-4">
      <img src={logo} alt="Logo" className="w-50 h-16 mb-8" />

      <div className="w-full max-w-md border dark:border-white/30 border-gray-200 shadow-lg rounded-xl p-8 dark:bg-[#1A2234]/70 bg-white backdrop-blur-sm">

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="firstName"
                name="firstName"
                className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${formik.touched.firstName && formik.errors.firstName
                  ? 'border-red-500 ring-red-400'
                  : 'border-gray-400 focus:ring-green-400'
                  }`}
                placeholder="Enter first name"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.firstName}</p>
              )}

            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="lastName"
                name="lastName"
                className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${formik.touched.lastName && formik.errors.lastName
                  ? 'border-red-500 ring-red-400'
                  : 'border-gray-400 focus:ring-green-400'
                  }`}
                placeholder="Enter last name"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.lastName}</p>
              )}

            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="username"
              className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${formik.touched.username && formik.errors.username
                ? 'border-red-500 ring-red-400'
                : 'border-gray-400 focus:ring-green-400'
                }`}

              placeholder="Choose a username"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.username}</p>
            )}

          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="email"
              className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${formik.touched.email && formik.errors.email
                ? 'border-red-500 ring-red-400'
                : 'border-gray-400 focus:ring-green-400'
                }`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
            )}

          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="password"
              className={`w-full p-2 border rounded bg-white text-black focus:outline-none focus:ring-2 ${formik.touched.password && formik.errors.password
                ? 'border-red-500 ring-red-400'
                : 'border-gray-400 focus:ring-green-400'
                }`}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
            )}

          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-500"></div>
          <p className="mx-3 text-sm text-gray-300 whitespace-nowrap">or</p>
          <div className="flex-1 h-px bg-gray-500"></div>
        </div>
        <div className="flex flex-row items-center justify-center gap-1 text-sm dark:text-gray-300">
          <p>Already have an account?</p>
          <a
            onClick={() => navigate("/")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
