import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInForm from './SignInForm.jsx';
import ProfilePage from './profile-page.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInForm />} />
        <Route path="/portal/*" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
