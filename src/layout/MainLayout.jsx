import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
    //get current path
    const location = useLocation();
    const pagesWithoutFooter = ['/planner', '/login', '/register'];
    const hideFooter = pagesWithoutFooter.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            {!hideFooter && <Footer />}
        </div>
    );
}
