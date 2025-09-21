import { UserCircle } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { signupAPI } from "../../store/thunks/authThunk";
import { Link, useNavigate } from "react-router-dom";
import useAuthState from "../../hooks/useAuthState";
import { routes } from "../../App";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, email } = useAuthState();

  // useEffect(() => {
  //   if (email) {
  //     navigate(routes.login);
  //     // localStorage.setItem("email",email)
  //   } else if (isAuthenticated) {
  //     navigate(routes.protectedRoutes.welcome);
  //   }
  // }, [isAuthenticated, navigate]);

  // Yup validation schema
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string().trim().required("Username is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password"), null], "Password must match")
        .required("Password must match"),
    });
  }, []);

  return (
    <div data-theme="lemonade" className="hero bg-base-200 min-h-screen">
      <div className="flex flex-col items-center justify-center w-full">
        {/* Logo */}
        <h1 className="text-5xl font-extrabold mb-6 text-warning">
          <span className="text-warning">Q</span>uiz
        </h1>

        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card bg-base-100 w-screen max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <div className="flex flex-col items-center">
                <UserCircle size={80} className="text-error mb-4" />
              </div>

              {/* Formik Form */}
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  console.log("Form Data:", values);

                  dispatch(signupAPI(values));
                  navigate(routes.login);
                  toast.success("Signup Successful");
                }}
              >
                {() => (
                  <Form className="fieldset">
                    {/* Username */}
                    <label className="label">Username</label>
                    <Field
                      type="text"
                      name="username"
                      className="input"
                      placeholder="Username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm"
                    />

                    {/* Email */}
                    <label className="label">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="input"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />

                    {/* Password */}
                    <label className="label">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className="input"
                      placeholder="Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    {/* confirm password */}
                    <label className="label">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="input"
                      placeholder="confirm Password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />

                    {/* Button */}
                    <button type="submit" className="btn btn-neutral mt-4">
                      Register
                    </button>

                    <p>
                      Already Have a Account?{" "}
                      <Link to={routes.login} replace={true}>
                        {" "}
                        <span className="text-success font-semibold text-sm">
                          Login Here!
                        </span>
                      </Link>
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
