import { Route, Routes } from "react-router-dom";
import { nav } from "./navigation";
import PageNotFound from "../components/micros/PageNotFound";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../stores/slices/authSlice";
const RenderRoutes = () => {

    const isAuthenticated =  useSelector(selectIsAuthenticated);
  return (
  <>
      <Routes>
        {nav.map((r, i) => {
          // Protected routes
          if (r.isPrivate === isAuthenticated) {
            return <Route key={i} path={r.path} element={r.element} />;
          }
          // Public Routes
          else if (!r.isPrivate) {
            return <Route key={i} path={r.path} element={r.element} />;
          } else return false;
        })}
         <Route path="*" element={<PageNotFound />} />
      </Routes>
  
  
  
  </>
  )
}

export default RenderRoutes