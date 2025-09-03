import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MiPerfil from './pages/MiPerfil';
import MisCursos from './pages/MisCursos';
import MisFavoritos from './pages/MisFavoritos';
import './styles/App.css';
import QuienesSomos from './pages/QuienesSomos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import MisionVision from './pages/MisionVision';
import Contacto from './pages/Contacto';
import './styles/components.css';
import './styles/AuthModal.css'; 
function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/mi-perfil" element={<MiPerfil />} />
                        <Route path="/mis-cursos" element={<MisCursos />} />
                        <Route path="/mis-favoritos" element={<MisFavoritos />} />
                        <Route path="/quienes-somos" element={<QuienesSomos />} />
                        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
                        <Route path="/mision-vision" element={<MisionVision />} />
                        <Route path="/contacto" element={<Contacto />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;