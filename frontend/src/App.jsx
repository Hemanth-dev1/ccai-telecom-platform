import {

  BrowserRouter,

  Routes,

  Route,

  Navigate,

} from "react-router-dom";

import Workspace from "./pages/Workspace";

import Analytics from "./pages/Analytics";

import TopNav from "./components/TopNav";


function App() {

  return (

    <BrowserRouter>

      <div className="
        min-h-screen
        bg-[#050505]
        text-[#ededed]
      ">

        <TopNav />

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to="/workspace"
              />
            }
          />

          <Route
            path="/workspace"
            element={<Workspace />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;