import { Switch, Route } from "wouter";
import { RequireAdmin } from "./auth/RequireAdmin";
import { AdminLogin } from "./components/ui/AdminLogin";
import { AdminDashboard } from "./components/ui/AdminDashboard";

export function AppRouter() {
  return (
    <Switch>
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      <Route path="/admin">
        <RequireAdmin>
          <AdminDashboard />
        </RequireAdmin>
      </Route>
    </Switch>
  );
}
