// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify"; // Import toast

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
//     switch (name) {
//       case "email":
//         if (!value.trim()) {
//           newErrors.email = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           newErrors.email = "Invalid email format";
//         } else {
//           delete newErrors.email;
//         }
//         break;
//       case "password":
//         if (!value.trim()) {
//           newErrors.password = "Password is required";
//         } else if (value.length < 6) {
//           newErrors.password = "Password must be at least 6 characters long";
//         } else {
//           delete newErrors.password;
//         }
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     Object.keys(formData).forEach((key) => validateField(key, formData[key]));
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await fetch("/api/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           toast.success("Login successful!"); // Replace alert with toast.success
//           const role = data.role.toLowerCase();
//           navigate(`/${role}-dashboard`);
//         } else {
//           toast.error(data.error || "Login failed"); // Replace alert with toast.error
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         toast.error("An error occurred. Please try again."); // Replace alert with toast.error
//       }
//     } else {
//       toast.error("Please fix the errors in the form before submitting."); // Replace alert with toast.error
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
//           Login
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="your@email.com"
//               required
//               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
//                 errors.email ? "border-red-500" : ""
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter Password"
//               required
//               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
//                 errors.password ? "border-red-500" : ""
//               }`}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <Link
//             to="/"
//             className="text-blue-500 hover:text-blue-700 underline mr-4"
//           >
//             Back to Home
//           </Link>
//           <Link
//             to="/signup"
//             className="text-blue-500 hover:text-blue-700 underline"
//           >
//             Switch to Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// brute-force prevention
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
//     switch (name) {
//       case "email":
//         if (!value.trim()) {
//           newErrors.email = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           newErrors.email = "Invalid email format";
//         } else {
//           delete newErrors.email;
//         }
//         break;
//       case "password":
//         if (!value.trim()) {
//           newErrors.password = "Password is required";
//         } else if (value.length < 6) {
//           newErrors.password = "Password must be at least 6 characters long";
//         } else {
//           delete newErrors.password;
//         }
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     Object.keys(formData).forEach((key) => validateField(key, formData[key]));
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await fetch("/api/auth/login", { // Updated URL to match your backend
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//           credentials: "include", // Include session cookie
//         });
//         const data = await response.json();
//         if (response.ok) {
//           toast.success("Login successful!");
//           const role = data.role.toLowerCase();
//           navigate(`/${role}-dashboard`);
//         } else {
//           if (response.status === 403) {
//             // Account is locked
//             toast.error(data.error || "Account is locked. Please try again later.");
//           } else {
//             toast.error(data.error || "Login failed");
//           }
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         toast.error("An error occurred. Please try again.");
//       }
//     } else {
//       toast.error("Please fix the errors in the form before submitting.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
//           Login
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="your@email.com"
//               required
//               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
//                 errors.email ? "border-red-500" : ""
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter Password"
//               required
//               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
//                 errors.password ? "border-red-500" : ""
//               }`}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <Link
//             to="/"
//             className="text-blue-500 hover:text-blue-700 underline mr-4"
//           >
//             Back to Home
//           </Link>
//           <Link
//             to="/signup"
//             className="text-blue-500 hover:text-blue-700 underline"
//           >
//             Switch to Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// user avoid to see dashboards without project 
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
//     switch (name) {
//       case "email":
//         if (!value.trim()) {
//           newErrors.email = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           newErrors.email = "Invalid email format";
//         } else {
//           delete newErrors.email;
//         }
//         break;
//       case "password":
//         if (!value.trim()) {
//           newErrors.password = "Password is required";
//         } else if (value.length < 6) {
//           newErrors.password = "Password must be at least 6 characters long";
//         } else {
//           delete newErrors.password;
//         }
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     Object.keys(formData).forEach((key) => validateField(key, formData[key]));
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await fetch("/api/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (response.ok) {
//           if (data.restricted) {
//             toast.error(data.message || "You need to be assigned to a project to access your dashboard.");
//             navigate("/waiting"); // Redirect to waiting page
//           } else {
//             toast.success("Login successful!");
//             const role = data.role.toLowerCase();
//             navigate(`/${role}-dashboard`);
//           }
//         } else {
//           if (response.status === 403) {
//             toast.error(data.error || "Account is locked. Please try again later.");
//           } else {
//             toast.error(data.error || "Login failed");
//           }
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         toast.error("An error occurred. Please try again.");
//       }
//     } else {
//       toast.error("Please fix the errors in the form before submitting.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
//           Login
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="your@email.com"
//               required
//               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
//                 errors.email ? "border-red-500" : ""
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter Password"
//               required
//               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
//                 errors.password ? "border-red-500" : ""
//               }`}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <Link
//             to="/"
//             className="text-blue-500 hover:text-blue-700 underline mr-4"
//           >
//             Back to Home
//           </Link>
//           <Link
//             to="/signup"
//             className="text-blue-500 hover:text-blue-700 underline"
//           >
//             Switch to Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// bug
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters long";
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          if (data.restricted) {
            toast.error(data.message || "You need to be assigned to a project to access your dashboard.");
            navigate("/waiting");
          } else {
            toast.success("Login successful!");
            const role = data.role.toLowerCase();
            navigate(`/${role}-dashboard`);
          }
        } else {
          if (response.status === 403) {
            toast.error(data.error || "Account is locked. Please try again later.");
          } else {
            toast.error(data.error || "Login failed");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error("Please fix the errors in the form before submitting.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 underline mr-4"
          >
            Back to Home
          </Link>
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Switch to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;