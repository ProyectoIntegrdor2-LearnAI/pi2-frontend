import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MiPerfil from './pages/MiPerfil';
import MisCursos from './pages/MisCursos';
import MisFavoritos from './pages/MisFavoritos';
import './styles/App.css';

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
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;