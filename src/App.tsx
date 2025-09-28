import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Services from './pages/Services';
import Experience from './pages/Experience';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ContactTable from './components/ContactTable';
import SubscriberTable from './components/SubscriberTable';
import BlogManagement from './components/BlogManagement';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="skills" element={<Skills />} />
            <Route path="services" element={<Services />} />
            <Route path="experience" element={<Experience />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin/blog-management" element={<BlogManagement />} />

            <Route path="ContactTable" element={<ContactTable />} />
            <Route path="SubscriberTable" element={<SubscriberTable />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;