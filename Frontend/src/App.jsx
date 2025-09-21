import Layout from "./components/Layout";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import WelcomePage from "./components/pages/WelcomePage";
import QuestionScreen from "./components/QuestionScreen";
import Logout from "./components/pages/Logout";
import ResultScreen from "./components/ResultScreen";

export const routes = {
  signup: "/signup",
  login: "/login",
  protectedRoutes: {
    welcome: "/welcome",
    questions: "/questions",
    result: "/result",
    logout: "/logout"
  },
};

// const router = createBrowserRouter([
//   { path: "/", element: <Navigate to={routes.login} replace /> },
//   {
//     path: routes.signup,
//     element: <Register />,
//   },
//   {
//     path: routes.login,
//     element: <Login />,
//   },
//   {
//     path: routes.protectedRoutes.welcome,
//     element: <ProtectedRoutes element={<WelcomePage />} />,
//   },
//   {
//     path: routes.protectedRoutes.questions,
//     element: <ProtectedRoutes element={<QuestionScreen />} />,
//   },
//   {
//     path: routes.protectedRoutes.logout,
//     element: <ProtectedRoutes element={<Logout />} />,
//   },
// ]);

const router = createBrowserRouter([
  {path: "/", element: <Navigate to={routes.login} replace />},
  {
    path: routes.signup,
    element: <Register/>
  },
  {
    path: routes.login,
    element : <Login/>
  },
  {
    path: routes.protectedRoutes.welcome,
    element: <ProtectedRoutes element={<WelcomePage/>}/>
  },
  {
    path: routes.protectedRoutes.questions,
    element: <ProtectedRoutes element={<QuestionScreen/>}/>
  },
  {
    path: routes.protectedRoutes.logout,
    element: <ProtectedRoutes element={<Logout/>}/>
  },
  {
    path: routes.protectedRoutes.result,
    element: <ProtectedRoutes element={<ResultScreen/>}/>
  }
])

const App = () => {
  return (
    <div>
      <Toaster />
      <RouterProvider router={router}>
        <Layout />
      </RouterProvider>
      
    </div>
  );
};

export default App;

