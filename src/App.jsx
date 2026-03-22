import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';

import Home from './pages/Home';
import Planner from './pages/Planner';
import Tour from './pages/Tour';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTours from './pages/MyTours';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import ProtectedRoute from './components/routeguards/ProtectedRoute.jsx';
import UserManagement from './pages/UserManagement.jsx';
import AdminRoute from './components/routeguards/AdminRoute.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
    return (
        <AuthProvider>
            {' '}
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <BrowserRouter>
                    <ScrollToTop />
                    <div className="min-h-screen w-full">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <MainLayout>
                                        <Home />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path="/planner"
                                element={
                                    <MainLayout>
                                        <Planner />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path="/tour"
                                element={
                                    <MainLayout>
                                        <Tour />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    <MainLayout>
                                        <Login />
                                    </MainLayout>
                                }
                            />
                            <Route element={<AdminRoute />}>
                                <Route
                                    path="/admin/users"
                                    element={
                                        <MainLayout>
                                            <UserManagement />
                                        </MainLayout>
                                    }
                                />
                            </Route>
                            <Route element={<ProtectedRoute />}>
                                <Route
                                    path="/mytours"
                                    element={
                                        <MainLayout>
                                            <MyTours />
                                        </MainLayout>
                                    }
                                />
                            </Route>
                            <Route
                                path="/privacy"
                                element={
                                    <MainLayout>
                                        <PrivacyPolicy />
                                    </MainLayout>
                                }
                            />
                            <Route
                                path="/cookies"
                                element={
                                    <MainLayout>
                                        <CookiePolicy />
                                    </MainLayout>
                                }
                            />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </div>
                    <CookieBanner />
                </BrowserRouter>
            </GoogleOAuthProvider>
        </AuthProvider>
    );
}

export default App;
