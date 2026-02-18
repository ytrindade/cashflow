import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/login";
import Register from "./Auth/register";
import Expense from "./Expense/expenses";
import ExpenseDetail from "./Expense/expenseDetail";
import Profile from "./Profile/profile";
import PrivateRoute from '../components/PrivateRoute';
import { ThemeProvider, ThemeContext } from '../context/ThemeContext';

function AppRoutes() {
  const { themeName, theme, toggle } = useContext(ThemeContext);
  return (
    <div>
      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 60 }}>
        <button onClick={toggle} className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.borderColor, color: theme.textPrimary}}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            {themeName === 'dark' ? 'wb_sunny' : 'bedtime'}
          </span>
        </button>
      </div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={Login} />
          <Route exact path="register" Component={Register} />
          <Route exact path="expenses" Component={Expense}  />
          <Route exact path="expenses/edit/:id" Component={ExpenseDetail} />
          <Route exact path="expenses/add" Component={ExpenseDetail} />
          <Route exact path="profile" Component={Profile} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default function RoutesComponent() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}