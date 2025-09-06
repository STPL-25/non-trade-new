import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useAppState } from "./states/hooks/useAppState";
import { use, useEffect } from "react";
function App() {
  const { userData, decryptData } = useAppState();
  const cryptoSecret = import.meta.env.VITE_CRYPTO_SECRET;
  useEffect(() => {
    const storedUserToken = JSON.parse(localStorage.getItem("userToken"));
    console.log(storedUserToken);
    if (storedUserToken && (!userData || Object.keys(userData).length === 0)) {
      decryptData({
        encryptedData: storedUserToken,
        secretKey: cryptoSecret,
      });
    }
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: userData && Object.keys(userData).length > 0 ? (
        userData[0]?.ecno && userData[0]?.ename ? <Dashboard /> : <LoginPage />
      ) : (
        <LoginPage />
      ),
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    // {
    //   path: "/dashboard",
    //   element: userData && Object.keys(userData).length > 0 ? (
    //     userData[0]?.ecno && userData[0]?.ename ? <Dashboard /> : <LoginPage />
    //   ) : (
    //     <LoginPage />
    //   ),
    // },
  ]);
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
