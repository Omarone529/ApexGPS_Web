import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';

import Home from './pages/Home';
import Planner from './pages/Planner';
import Tour from './pages/Tour';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTours from './pages/MyTours.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
    return (
        <AuthProvider>
            {' '}
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <BrowserRouter>
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
                            <Route path="/mytours" element={<MyTours />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </GoogleOAuthProvider>
        </AuthProvider>
    );
}

export default App;
