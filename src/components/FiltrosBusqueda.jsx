import React, { useState } from 'react';

const FiltrosBusqueda = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [selectedLevel, setSelectedLevel] = useState('todos');
    const [selectedPrice, setSelectedPrice] = useState('todos');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const categorias = [
        { value: 'todas', label: 'Todas las categorías' },
        { value: 'programacion', label: 'Programación' },
        { value: 'ia', label: 'Inteligencia Artificial' },
        { value: 'web', label: 'Desarrollo Web' },
        { value: 'datos', label: 'Ciencia de Datos' },
        { value: 'movil', label: 'Desarrollo Móvil' },
        { value: 'diseno', label: 'Diseño' },
    ];

    const niveles = [
        { value: 'todos', label: 'Todos los niveles' },
        { value: 'principiante', label: 'Principiante' },
        { value: 'intermedio', label: 'Intermedio' },
        { value: 'avanzado', label: 'Avanzado' },
    ];

    const precios = [
        { value: 'todos', label: 'Todos los precios' },
        { value: 'gratis', label: 'Gratis' },
        { value: 'pago', label: 'De pago' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        // Aquí implementarías la lógica de búsqueda
        console.log('Buscando:', { searchTerm, selectedCategory, selectedLevel, selectedPrice });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('todas');
        setSelectedLevel('todos');
        setSelectedPrice('todos');
    };

    return (
        <div className="filtros-busqueda">
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-container">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" fill="currentColor"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar cursos, instructores, temas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="clear-search"
                            aria-label="Limpiar búsqueda"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="currentColor"/>
                            </svg>
                        </button>
                    )}
                </div>

                <button type="submit" className="search-button">
                    Buscar
                </button>
            </form>

            <div className="filters-container">
                <button
                    className="filters-toggle"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    aria-label="Mostrar filtros"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM4 11a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H4z" fill="currentColor"/>
                    </svg>
                    Filtros
                    <svg
                        className={`dropdown-arrow ${isFiltersOpen ? 'arrow-up' : ''}`}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                    >
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </button>

                <div className={`filters-panel ${isFiltersOpen ? 'filters-open' : ''}`}>
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label htmlFor="categoria" className="filter-label">Categoría</label>
                            <select
                                id="categoria"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categorias.map(categoria => (
                                    <option key={categoria.value} value={categoria.value}>
                                        {categoria.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="nivel" className="filter-label">Nivel</label>
                            <select
                                id="nivel"
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="filter-select"
                            >
                                {niveles.map(nivel => (
                                    <option key={nivel.value} value={nivel.value}>
                                        {nivel.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="precio" className="filter-label">Precio</label>
                            <select
                                id="precio"
                                value={selectedPrice}
                                onChange={(e) => setSelectedPrice(e.target.value)}
                                className="filter-select"
                            >
                                {precios.map(precio => (
                                    <option key={precio.value} value={precio.value}>
                                        {precio.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-actions">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="clear-filters-button"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltrosBusqueda;