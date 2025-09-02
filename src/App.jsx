import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ParentProvider } from "./ParentContext/ParentContext";
import { Toaster } from "sonner";

function App(props) {
  const router = createBrowserRouter([
    {
      path: "/",
      element:  <ParentProvider><LoginPage /></ParentProvider>,
    },
     {
      path: "/signup",
      element:   <ParentProvider><SignupPage /></ParentProvider>,
    },
    {
      path: "/dashboard",
      element: (
        <ParentProvider>
          <Dashboard />
        </ParentProvider>
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
