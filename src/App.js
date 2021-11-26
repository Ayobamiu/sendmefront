import "./App.css";
import Dashboard from "./app/screens/Dashboard/Dashboard";
import NormalLoginForm from "./app/screens/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./app/screens/SignUp/SignUp";
import { Provider } from "react-redux";
import store from "./store/app/store";

function App() {
  return (
    <div className="">
      <Provider store={store}>
        <Router>
          <div>
            {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
            <Routes>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/login" element={<NormalLoginForm />} />

              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
