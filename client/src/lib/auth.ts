import { logout } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/lib/store";

export const handleLogout = (dispatch: AppDispatch) => {
  // Clear Redux state
  dispatch(logout());
  
  // Clear cookie
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Redirect to login
  window.location.href = "/login";
};