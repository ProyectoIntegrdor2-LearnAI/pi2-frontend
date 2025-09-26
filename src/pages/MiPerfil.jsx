import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Settings, 
  Lock, 
  Bell, 
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import "../styles/App.css";

const MiPerfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    nombre: "Karen Ortiz",
    email: "karen.ortiz@example.com",
    telefono: "3001234567",
    bio: "Apasionada por el aprendizaje y la tecnología. Siempre buscando nuevas formas de crecer profesional y personalmente.",
    foto: null,
    fechaRegistro: "15 de Marzo, 2024",
    cursosCompletados: 12,
    horasAprendizaje: 48,
    preferencias: {
      tema: "Claro",
      notificaciones: true,
      privacidad: "Público",
    },
  });

  const [formData, setFormData] = useState(user);
  const [newPassword, setNewPassword] = useState("");

  // Manejo de cambios en inputs normales
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejo de cambios en preferencias
  const handlePrefChange = (e) => {
    setFormData({
      ...formData,
      preferencias: {
        ...formData.preferencias,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      },
    });
  };

  // Subir foto de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar cambios
  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };

  // Cambio de contraseña
  const handlePasswordChange = () => {
    if (newPassword.trim().length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    alert("Contraseña cambiada con éxito ✅");
    setNewPassword("");
  };

  return (
    <div className="mi-perfil-container">
      <div className="perfil-header">
        <div className="perfil-banner"></div>
        <div className="perfil-info-header">
          <div className="foto-container">
            <img
              src={
                isEditing
                  ? formData.foto ||
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                  : user.foto ||
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
              }
              alt="Foto de perfil"
              className="foto-perfil"
            />
            {isEditing && (
              <label className="cambiar-foto-btn">
                <Camera size={16} />
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            )}
          </div>
          <br />
          <br />
          <div className="info-basica">
            <h1 className="nombre-usuario">{user.nombre}</h1>
            <br></br>
            <div className="stats-rapidas">
              <div className="stat-item">
                <span className="stat-numero">{user.cursosCompletados}</span>
                <span className="stat-label">Cursos</span>
              </div>
              <div className="stat-item">
                <span className="stat-numero">{user.horasAprendizaje}</span>
                <span className="stat-label">Horas</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
          >
            {isEditing ? <X size={18} /> : <Edit3 size={18} />}
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
      </div>

      <div className="perfil-content">
        {!isEditing ? (
          // ---- VISTA PERFIL ----
          <div className="perfil-grid">
            <div className="info-card">
              <h3 className="card-title">
                <User size={20} />
                Información Personal
              </h3>
              <div className="info-list">
                <div className="info-item">
                  <Mail size={16} />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={16} />
                  <div>
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{user.telefono}</span>
                  </div>
                </div>
                <div className="info-item bio-item">
                  <div>
                    <span className="info-label">Biografía</span>
                    <span className="info-value bio-text">{user.bio}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="preferencias-card">
              <h3 className="card-title">
                <Settings size={20} />
                Preferencias
              </h3>
              <div className="pref-list">
                <div className="pref-item">
                  <div className="pref-icon">🎨</div>
                  <div>
                    <span className="pref-label">Tema</span>
                    <span className="pref-value">{user.preferencias.tema}</span>
                  </div>
                </div>
                <div className="pref-item">
                  <Bell size={16} className="pref-icon" />
                  <div>
                    <span className="pref-label">Notificaciones</span>
                    <span className={`pref-value ${user.preferencias.notificaciones ? 'active' : 'inactive'}`}>
                      {user.preferencias.notificaciones ? 'Activadas' : 'Desactivadas'}
                    </span>
                  </div>
                </div>
                <div className="pref-item">
                  <Shield size={16} className="pref-icon" />
                  <div>
                    <span className="pref-label">Privacidad</span>
                    <span className="pref-value">{user.preferencias.privacidad}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ---- FORMULARIO DE EDICIÓN ----
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-grid">
              <div className="form-section">
                <h3 className="section-title">
                  <User size={20} />
                  Datos Personales
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="300 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Biografía</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Cuéntanos sobre ti..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <Settings size={20} />
                  Preferencias
                </h3>

                <div className="form-group">
                  <label className="form-label">Tema de la aplicación</label>
                  <select
                    name="tema"
                    value={formData.preferencias.tema}
                    onChange={handlePrefChange}
                    className="form-select"
                  >
                    <option value="Claro">🌞 Claro</option>
                    <option value="Oscuro">🌙 Oscuro</option>
                    <option value="Sistema">⚡ Automático</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="notificaciones"
                      checked={formData.preferencias.notificaciones}
                      onChange={handlePrefChange}
                      className="form-checkbox"
                    />
                    <span className="checkbox-text">
                      <Bell size={16} />
                      Recibir notificaciones por email
                    </span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Configuración de privacidad</label>
                  <select
                    name="privacidad"
                    value={formData.preferencias.privacidad}
                    onChange={handlePrefChange}
                    className="form-select"
                  >
                    <option value="Público">🌍 Público</option>
                    <option value="Privado">🔒 Privado</option>
                    <option value="Solo Amigos">👥 Solo Amigos</option>
                  </select>
                </div>

                {/* Sección de Seguridad */}
                <h3 className="section-title security-section">
                  <Lock size={20} />
                  Seguridad
                </h3>

                <div className="form-group">
                  <label className="form-label">Nueva contraseña</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-input password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="change-password-btn"
                    disabled={!newPassword}
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <Save size={18} />
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;