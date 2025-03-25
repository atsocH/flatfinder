import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import AddFlatPage from './pages/AddFlat';
import HomePage from './pages/HomePage';
import FlatPage from './pages/FlatPage'; // Import FlatPage component
import InboxPage from './pages/InboxPage'; // Import InboxPage component
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage component
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create-listing" element={<AddFlatPage />} />
                <Route path="/flat/:flatId" element={<FlatPage />} /> {/* Update route for FlatPage */}
                <Route path="/inbox/:ownerId" element={<InboxPage />} /> {/* Add route for InboxPage */}
                <Route path="/profile" element={<ProfilePage />} /> {/* Add route for ProfilePage */}
                <Route path="/" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
            </Routes>
        </>
    );
};

export default App;