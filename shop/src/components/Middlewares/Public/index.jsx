import { Navigate, Outlet } from "react-router-dom";

const Public = () => {
  return localStorage.getItem("token") && localStorage.getItem('client') ? <Navigate to={"/"} /> : <Outlet />;
};

export default Public;
