# Flujo de Trabajo Git

Este documento describe el flujo de trabajo (workflow) para el manejo de ramas (branches) y fusiones (merges) en nuestro repositorio, asegurando un desarrollo organizado y una integración continua (Continuous Integration).

## Ramas Principales

### `main` (Producción)

**Descripción:** Contiene la versión estable y en producción del sistema.

**Actualización:** Solo se actualiza mediante merge desde `develop` (para nuevas versiones) o `hotfix/*` (para correcciones urgentes) a través de pull requests (solicitudes de extracción) aprobadas y verificadas por GitHub Actions.

**Restricciones:** No se realizan desarrollos directos en esta rama. Requiere pull requests para merge, con checks (verificaciones) de GitHub Actions (por ejemplo, tests o pruebas) aprobados.

#### Flujo de Fusión (solo vía pull request):

Para fusionar `develop` o `hotfix/*` a `main`:

1. Abre una pull request desde la rama `develop` o `hotfix/fix-XYZ` hacia `main`
2. GitHub Actions ejecutará los tests y otras verificaciones
3. Una vez que todos los checks pasen y la pull request sea aprobada por un revisor, se podrá hacer el merge

#### Etiquetar la versión:

Después del merge a `main`, es una buena práctica crear un tag (etiqueta) en `main` para marcar la nueva versión. Esto se hace en tu repositorio local después de un `git pull` en `main` o directamente en la interfaz de GitHub.

```bash
git checkout main
git pull # Para asegurarte de tener el último merge
git tag vX.Y.Z
git push origin vX.Y.Z # Sube el tag a GitHub
```

### `develop` (Desarrollo)

**Descripción:** Contiene el código en desarrollo y pruebas.

**Actualización:** Recibe los cambios de las ramas `feature/*` y `hotfix/*` a través de pull requests.

**Restricciones:** Se mantiene siempre funcional. Requiere pull requests para merge, con checks de GitHub Actions (tests) aprobados.

#### Flujo de Fusión desde `feature/*`:

Una vez finalizado el desarrollo en `feature/nueva-funcionalidad`:

1. Asegúrate de que tu rama esté actualizada en GitHub:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

2. Abre una pull request desde `feature/nueva-funcionalidad` hacia `develop`

3. GitHub Actions ejecutará los tests configurados para `develop`

4. Si los tests pasan y la pull request es aprobada, se puede hacer el merge

5. Después del merge, puedes eliminar la rama local y remota:
   ```bash
   git branch -d feature/nueva-funcionalidad
   git push origin --delete feature/nueva-funcionalidad
   ```

#### Crear una nueva rama de desarrollo desde `develop`:

```bash
git checkout develop
git pull # Asegúrate de tener la última versión de develop
git checkout -b feature/nueva-funcionalidad
```

## Ramas Temporales

Estas ramas son temporales y se crean según la necesidad, con un enfoque estricto en el uso de pull requests para sus fusiones.

### `feature/*` (Nuevas Funcionalidades)

**Descripción:** Se crean desde `develop` para desarrollar nuevas funcionalidades.

#### Flujo:

1. **Crear una nueva rama para una funcionalidad:**
   ```bash
   git checkout develop
   git pull # Siempre actualiza develop antes de crear una feature branch
   git checkout -b feature/nombre-de-la-funcionalidad
   ```

2. **Desarrolla y commitea (commit o confirma) tus cambios**

3. **Haz push de tu rama a GitHub:**
   ```bash
   git push origin feature/nombre-de-la-funcionalidad
   ```

4. **Abrir una pull request:** Desde `feature/nombre-de-la-funcionalidad` hacia `develop`

5. **Revisión y GitHub Actions:** Espera que GitHub Actions ejecute los tests y que tu pull request sea revisada y aprobada

6. **Merge:** Una vez aprobada, fusiona la pull request a `develop`

7. **Eliminar la rama (local y remota):**
   ```bash
   git branch -d feature/nombre-de-la-funcionalidad
   git push origin --delete feature/nombre-de-la-funcionalidad
   ```

### `hotfix/*` (Correcciones Urgentes en Producción)

**Descripción:** Se crean desde `main` para corregir errores críticos que están en producción.

#### Flujo:

1. **Crear una rama hotfix:**
   ```bash
   git checkout main
   git pull # Asegúrate de tener la última versión de main
   git checkout -b hotfix/descripcion-del-arreglo
   ```

2. **Aplica el fix (arreglo) y commitea**

3. **Haz push de tu rama a GitHub:**
   ```bash
   git push origin hotfix/descripcion-del-arreglo
   ```

4. **Abrir pull request a main:** Desde `hotfix/descripcion-del-arreglo` hacia `main`

5. **Revisión y GitHub Actions (main):** Espera que los tests de GitHub Actions pasen y que la pull request sea aprobada

6. **Merge a main:** Una vez aprobada, fusiona la pull request a `main`

7. **Sincronizar develop:** Abre OTRA pull request desde `hotfix/descripcion-del-arreglo` hacia `develop`. Esto es crucial para asegurar que el fix también esté en el desarrollo futuro

8. **Revisión y GitHub Actions (develop):** Espera que los tests de GitHub Actions pasen y que la pull request sea aprobada

9. **Merge a develop:** Una vez aprobada, fusiona la pull request a `develop`

10. **Eliminar la rama (local y remota):**
    ```bash
    git branch -d hotfix/descripcion-del-arreglo
    git push origin --delete hotfix/descripcion-del-arreglo
    ```

---

## Resumen del Flujo

<img width="365" height="379" alt="image" src="https://github.com/user-attachments/assets/86caae41-9f11-4c19-9de0-4215fc86d42e" />

