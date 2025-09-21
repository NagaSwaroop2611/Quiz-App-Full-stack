import React, { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CircleQuestionMark } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginAPI } from "../../store/thunks/authThunk";
import useAuthState from "../../hooks/useAuthState";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../App";
import toast from "react-hot-toast";

const Login = () => {
  const { isAuthenticated, loading, error, email } = useAuthState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.protectedRoutes.welcome);
      toast.success("Login Successfull");
    }
  }, [isAuthenticated, navigate]);

  // Yup validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      }),
    []
  );

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
                <CircleQuestionMark size={80} className="text-success mb-2" />
              </div>

              <p className="text-lg font-bold text-center text-accent">
                User Login
              </p>
              <p className="text-lg font-bold mb-4 text-accent text-center">
                Welcome Back
              </p>

              {/* Formik Form */}
              <Formik
                initialValues={{ email: email || "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  console.log("Form submitted:", values);
                  // You can add API call here
                  dispatch(loginAPI(values));
                }}
              >
                {() => (
                  <Form className="w-full">
                    <fieldset className="fieldset">
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
                        className="text-error text-sm mt-1"
                      />

                      {/* Password */}
                      <label className="label mt-2">Password</label>
                      <Field
                        type="password"
                        name="password"
                        className="input"
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-error text-sm mt-1"
                      />

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="btn btn-neutral mt-4"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </button>
                      <p>
                        Don't Have a Account?{" "}
                        <Link to={routes.signup} replace={true}>
                          {" "}
                          <span className="text-accent font-semibold text-sm">
                            Register Here!
                          </span>
                        </Link>
                      </p>
                      {error && <p className="text-error">{error}</p>}
                    </fieldset>
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

export default Login;
