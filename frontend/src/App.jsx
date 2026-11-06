import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "./routes/ProtectedRoutes"
import AccountsPage from "./pages/AccountsPage"
import CategoriesPage from "./pages/CategoriesPage"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Route>

      {/*if use enters any wrong url, send back to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
