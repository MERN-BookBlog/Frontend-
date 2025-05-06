// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import RegistrationForm from './components/Registration/RegistrationForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* other routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/Registration" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
