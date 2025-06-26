/* eslint-disable no-unused-vars */
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Memberships from "./pages/Memberships";
import Trainers from "./pages/Trainers";
import Events from "./pages/Events";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import TrainerProfile from "./components/TrainerProfile";
/* eslint-enable no-unused-vars */

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="mt-4">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/memberships" element={<Memberships />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events" element={<Events />} />
                <Route path="/trainer/profile" element={<TrainerProfile />} />

                {/* Только для авторизованных */}
                <Route
                    path="/profile"
                    element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                    }
                />
            </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;