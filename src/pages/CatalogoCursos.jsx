import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import { ensureArray, normalizeCourse, unwrapApiData } from "../utils/apiData";
import "../styles/Dashboard.css";
import "../styles/VisualizadorRutas.css";

const FAVORITES_STORAGE_KEY = "learnia_course_favorites";

const readStoredFavorites = () => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const storedUser = apiServices.utils?.getStoredUser?.();
    const currentUserId =
      storedUser?.user_id || storedUser?.id || storedUser?.sub || null;

    if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
      if (!currentUserId || parsed.userId !== currentUserId) {
        return new Set();
      }
      return new Set(parsed.items);
    }
    if (Array.isArray(parsed)) {
      return new Set(parsed);
    }
  } catch {
    // noop
  }
  return new Set();
};

const writeStoredFavorites = (favoriteSet) => {
  if (typeof window === "undefined") return;
  try {
    const storedUser = apiServices.utils?.getStoredUser?.();
    const userId =
      storedUser?.user_id || storedUser?.id || storedUser?.sub || null;
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify({
        userId,
        items: Array.from(favoriteSet),
        updatedAt: new Date().toISOString(),
      })
    );
  } catch {
    // noop
  }
};

const buildSearchFilters = (filters) => {
  const payload = {};
  if (filters.categoria && filters.categoria !== "Todas") {
    payload.category = filters.categoria;
  }
  if (filters.nivel && filters.nivel !== "Todos") {
    payload.level = filters.nivel;
  }
  if (filters.idioma && filters.idioma !== "Todos") {
    payload.language = filters.idioma;
  }
  if (filters.precio && filters.precio !== "Todos") {
    if (filters.precio === "Gratis") {
      payload.max_price = 0;
    } else if (filters.precio === "Menos de 50") {
      payload.max_price = 50;
    } else if (filters.precio === "Menos de 100") {
      payload.max_price = 100;
    }
  }
  return payload;
};

function CatalogoCursos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [baseCourses, setBaseCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoria: "Todas",
    nivel: "Todos",
    idioma: "Todos",
    precio: "Todos",
  });
  const [mode, setMode] = useState("trending"); // trending | search
  const [favoriteCourseIds, setFavoriteCourseIds] = useState(() =>
    readStoredFavorites()
  );

  const anyActiveFilter = useMemo(() => {
    return Object.values(filters).some(
      (value) => value && value !== "Todos" && value !== "Todas"
    );
  }, [filters]);

  const applyFilters = useCallback(
    (courses) => {
      if (!Array.isArray(courses) || courses.length === 0) {
        return [];
      }

      return courses.filter((course) => {
        if (
          filters.categoria !== "Todas" &&
          course.categoria &&
          course.categoria.toLowerCase() !== filters.categoria.toLowerCase()
        ) {
          return false;
        }
        if (
          filters.nivel !== "Todos" &&
          course.nivel &&
          course.nivel.toLowerCase() !== filters.nivel.toLowerCase()
        ) {
          return false;
        }
        if (
          filters.idioma !== "Todos" &&
          course.raw?.language &&
          course.raw.language.toLowerCase() !== filters.idioma.toLowerCase()
        ) {
          return false;
        }
        if (filters.precio === "Gratis") {
          const normalized =
            (course.precio && String(course.precio).toLowerCase()) || "";
          if (!normalized.includes("gratis") && Number(course.precio) > 0) {
            return false;
          }
        } else if (filters.precio === "Menos de 50") {
          const price = Number(
            typeof course.precio === "string"
              ? course.precio.replace(/[^0-9.,]/g, "").replace(",", ".")
              : course.precio
          );
          if (!Number.isNaN(price) && price > 50) {
            return false;
          }
        } else if (filters.precio === "Menos de 100") {
          const price = Number(
            typeof course.precio === "string"
              ? course.precio.replace(/[^0-9.,]/g, "").replace(",", ".")
              : course.precio
          );
          if (!Number.isNaN(price) && price > 100) {
            return false;
          }
        }

        return true;
      });
    },
    [filters]
  );

  useEffect(() => {
    writeStoredFavorites(favoriteCourseIds);
  }, [favoriteCourseIds]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesResult, categoriesResult] = await Promise.allSettled([
          apiServices.courses.getAllCourses({ limit: 30 }),
          apiServices.courses.getCategories(),
        ]);

        if (coursesResult.status === "fulfilled") {
          const normalized = ensureArray(coursesResult.value)
            .map(normalizeCourse)
            .filter(Boolean);
          setBaseCourses(normalized);
          setActiveCourses(normalized);
        } else {
          throw coursesResult.reason;
        }

        if (categoriesResult.status === "fulfilled") {
          const rawCategories = ensureArray(
            unwrapApiData(categoriesResult.value)
          );
          const normalizedCategories = rawCategories
            .map((item) => item?.name || item?.categoria || item?._id)
            .filter(Boolean);
          setCategories(["Todas", ...new Set(normalizedCategories)]);
        }
      } catch (err) {
        console.error("Error cargando catálogo:", err);
        setError(
          err?.message || "No fue posible cargar los cursos recomendados"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    setFilteredCourses(applyFilters(activeCourses));
  }, [activeCourses, applyFilters]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    const query = searchTerm.trim();
    if (!query) {
      setMode("trending");
      setActiveCourses(baseCourses);
      setError(null);
      return;
    }

    setSearching(true);
    setError(null);
    try {
      const searchFilters = buildSearchFilters(filters);
      const response = await apiServices.search.main({
        query,
        limit: 30,
        filters: searchFilters,
      });

      const normalized = ensureArray(response?.results)
        .map(normalizeCourse)
        .filter(Boolean);

      setMode("search");
      setActiveCourses(normalized);

      if (normalized.length === 0) {
        setError("No encontramos cursos que coincidan con tu búsqueda.");
      }
    } catch (err) {
      console.error("Error buscando cursos:", err);
      setError(err?.message || "No fue posible realizar la búsqueda");
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setMode("trending");
    setError(null);
    setActiveCourses(baseCourses);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFavoriteCourse = async (courseId) => {
    try {
      const result = await apiServices.courses.toggleFavorite(courseId);
      setFavoriteCourseIds((prev) => {
        const next = new Set(prev);
        const favoriteId = String(result.courseId ?? courseId);
        if (result.isFavorite) {
          next.add(favoriteId);
        } else {
          next.delete(favoriteId);
        }
        return next;
      });
    } catch (err) {
      console.error("No se pudo actualizar el favorito:", err);
      setError(err?.message || "No se pudo actualizar el favorito");
    }
  };

  const visibleCourses = filteredCourses;

  return (
    <div className="dashboard-content mis-cursos-container">
      <section className="mis-cursos-header">
        <div className="mis-cursos-header-top">
          <div>
            <h1>Explorar Cursos</h1>
            <p>
              Descubre cursos relevantes y agrégalos a tus rutas de aprendizaje
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            ← Volver al Dashboard
          </button>
        </div>

        <form className="mis-cursos-search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder="Busca por tema, tecnología o habilidad"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={searching}>
            {searching ? "Buscando..." : "Buscar"}
          </button>
          {mode === "search" && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClearSearch}
            >
              Limpiar búsqueda
            </button>
          )}
        </form>

        <div className="mis-cursos-filters">
          <div className="filter-group">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
            >
              {(categories.length ? categories : ["Todas"]).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="nivel">Nivel</label>
            <select
              id="nivel"
              name="nivel"
              value={filters.nivel}
              onChange={handleFilterChange}
            >
              {["Todos", "Beginner", "Intermediate", "Advanced"].map(
                (level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="idioma">Idioma</label>
            <select
              id="idioma"
              name="idioma"
              value={filters.idioma}
              onChange={handleFilterChange}
            >
              {["Todos", "es", "en"].map((lang) => (
                <option key={lang} value={lang}>
                  {lang === "Todos" ? "Todos" : lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="precio">Precio</label>
            <select
              id="precio"
              name="precio"
              value={filters.precio}
              onChange={handleFilterChange}
            >
              {["Todos", "Gratis", "Menos de 50", "Menos de 100"].map(
                (price) => (
                  <option key={price} value={price}>
                    {price}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {mode === "search" && !loading && (
          <div className="search-context">
            <span>
              Mostrando resultados para <strong>{searchTerm}</strong>
            </span>
            {anyActiveFilter && <span> con filtros aplicados</span>}
          </div>
        )}
      </section>

      <section className="mis-cursos-content">
        {loading ? (
          <div className="card-placeholder">
            <div className="loading-spinner small"></div>
            <p>Cargando cursos...</p>
          </div>
        ) : error ? (
          <div className="card-placeholder">
            <p>{error}</p>
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="card-placeholder">
            <p>
              {mode === "search"
                ? "No encontramos cursos que coincidan con tu búsqueda."
                : "Aún no tenemos cursos para mostrar con los filtros seleccionados."}
            </p>
            {(mode === "search" || anyActiveFilter) && (
              <button
                type="button"
                className="btn-secondary compact"
                onClick={() => {
                  if (mode === "search") {
                    handleClearSearch();
                  }
                  setFilters({
                    categoria: "Todas",
                    nivel: "Todos",
                    idioma: "Todos",
                    precio: "Todos",
                  });
                }}
              >
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          <div className="mis-cursos-grid">
            {visibleCourses.map((course) => {
              const favoriteKey = String(course.id);
              const isFavorite = favoriteCourseIds.has(favoriteKey);
              const safeImage =
                course.imagen ||
                "https://via.placeholder.com/400x250?text=Curso";
              return (
                <article key={course.id} className="mis-cursos-card">
                  <div className="course-image-wrapper">
                    <img src={safeImage} alt={course.titulo} />
                    <span className="course-level-chip">{course.nivel}</span>
                    {course.precio && (
                      <span className="course-price-chip">{course.precio}</span>
                    )}
                  </div>
                  <div className="course-card-body">
                    <h3>{course.titulo}</h3>
                    <p className="course-desc">
                      {course.descripcion && course.descripcion.length > 160
                        ? `${course.descripcion.slice(0, 160)}…`
                        : course.descripcion || "Curso sin descripción."}
                    </p>
                    <div className="course-meta">
                      {course.categoria && (
                        <span>📚 {course.categoria}</span>
                      )}
                      {course.plataforma && (
                        <span>🌐 {course.plataforma}</span>
                      )}
                      {course.duracion && <span>⏱️ {course.duracion}</span>}
                      {Number(course.calificacion) > 0 && (
                        <span>⭐ {Number(course.calificacion).toFixed(1)}</span>
                      )}
                    </div>
                    <div className="course-actions">
                      <button
                        type="button"
                        className="enroll-btn"
                        onClick={() => {
                          if (course.url) {
                            window.open(course.url, "_blank", "noopener");
                          }
                        }}
                      >
                        Ver Curso
                      </button>
                      <button
                        type="button"
                        className={`favorite-btn ${isFavorite ? "active" : ""}`}
                        onClick={() => toggleFavoriteCourse(course.id)}
                        title={
                          isFavorite
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                        }
                      >
                        {isFavorite ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default CatalogoCursos;
