import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './Home';
import About from './About';
import Projects from './projects/Projects';
import Skills from './skills/Skills';
import Services from './services/Services';
import Experience from './experience/Experience';
import Testimonials from './testimonials/Testimonials';
import Blog from './blogs/Blog';
import BlogPost from './blog-posts/BlogPost';
import Contact from './contacts/Contact';
import Admin from './admins/Admin';
import ContactTable from './contact-tables/ContactTable';
import SubscriberTable from './subscriber-tables/SubscriberTable';
import BlogManagement from './blog-management/BlogManagement';

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