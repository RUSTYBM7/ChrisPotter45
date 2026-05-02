import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Fanbase from "@/pages/Fanbase";
import PressKit from "@/pages/PressKit";
import FanPortal from "@/pages/FanPortal";
import Admin from "@/pages/Admin";
import Charity from "@/pages/Charity";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/contact" component={Contact} />
        <Route path="/fanbase" component={Fanbase} />
        <Route path="/press-kit" component={PressKit} />
        <Route path="/fan-portal" component={FanPortal} />
        <Route path="/admin" component={Admin} />
        <Route path="/charity" component={Charity} />
        <Route component={Home} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
