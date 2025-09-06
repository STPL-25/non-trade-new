import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:  <LoginPage />,
    },
     {
      path: "/signup",
      element:   <SignupPage />,
    },
    {
      path: "/dashboard",
      element: (
        
          <Dashboard />
       
      ),
    },
  ]);
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
