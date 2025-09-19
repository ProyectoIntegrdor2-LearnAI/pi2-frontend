import React, { useState } from "react";
import "../styles/App.css";

const MiPerfil = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    nombre: "Karen Ortiz",
    email: "karen.ortiz@example.com",
    telefono: "3001234567",
    bio: "Apasionada por el aprendizaje y la tecnología.",
    foto: null,
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

  // Cambio de contraseña (simulado)
  const handlePasswordChange = () => {
    if (newPassword.trim().length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    alert("Contraseña cambiada con éxito ✅");
    setNewPassword("");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "100px auto",
        padding: "2rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        background: "var(--background-gradient)",
        color: "white",
      }}
    >
      {!isEditing ? (
        // ---- VISTA PERFIL ----
        <div style={{ textAlign: "center" }}>
          <img
            src={
              user.foto ||
              "https://via.placeholder.com/120x120.png?text=Foto"
            }
            alt="Foto de perfil"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--accent-color)",
              marginBottom: "1rem",
            }}
          />
          <h2 style={{ fontSize: "2rem", fontWeight: "700" }}>Perfil de Usuario</h2>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.telefono}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <hr style={{ margin: "1.5rem 0", borderColor: "rgba(255,255,255,0.2)" }} />
          <h3>⚙️ Preferencias</h3>
          <p><strong>Tema:</strong> {user.preferencias.tema}</p>
          <p>
            <strong>Notificaciones:</strong>{" "}
            {user.preferencias.notificaciones ? "Activadas" : "Desactivadas"}
          </p>
          <p><strong>Privacidad:</strong> {user.preferencias.privacidad}</p>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-color)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        // ---- FORMULARIO DE EDICIÓN ----
        <form onSubmit={handleSave}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
            Editar Perfil
          </h2>

          {/* Foto */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={
                formData.foto ||
                "https://via.placeholder.com/120x120.png?text=Foto"
              }
              alt="Vista previa"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--accent-color)",
                marginBottom: "0.5rem",
              }}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Datos personales */}
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Biografía"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          {/* Preferencias */}
          <h3>⚙️ Preferencias</h3>
          <label>
            Tema:
            <select
              name="tema"
              value={formData.preferencias.tema}
              onChange={handlePrefChange}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="Claro">Claro</option>
              <option value="Oscuro">Oscuro</option>
            </select>
          </label>
          <br />
          <label>
            Notificaciones:
            <input
              type="checkbox"
              name="notificaciones"
              checked={formData.preferencias.notificaciones}
              onChange={handlePrefChange}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
          <br />
          <label>
            Privacidad:
            <select
              name="privacidad"
              value={formData.preferencias.privacidad}
              onChange={handlePrefChange}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="Público">Público</option>
              <option value="Privado">Privado</option>
              <option value="Solo Amigos">Solo Amigos</option>
            </select>
          </label>

          {/* Cambio de contraseña */}
          <h3 style={{ marginTop: "1.5rem" }}>🔐 Seguridad</h3>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <button
            type="button"
            onClick={handlePasswordChange}
            style={{
              background: "var(--primary-color)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Cambiar Contraseña
          </button>

          {/* Botones */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                background: "var(--accent-color)",
                color: "white",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "none",
              }}
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                background: "var(--primary-color)",
                color: "white",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "none",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MiPerfil;
