import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Vacancies from './pages/Vacancies';
import Contacts from './pages/Contacts';
import Admin from './pages/Admin';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout className="min-h-screen">
          <Navbar />
          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/vacancies" element={<Vacancies />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;