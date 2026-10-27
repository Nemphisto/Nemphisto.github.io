# Portafolio personal futurista — NEMPHISTO

Portafolio estático profesional, responsivo y dinámico, realizado con **HTML, CSS y JavaScript**. No requiere instalar dependencias.

## Funciones incluidas

- Portada futurista con núcleo holográfico, órbitas, estrellas y texto animado.
- Diseño adaptable para celulares, tabletas y computadoras.
- Navegación móvil, indicador de lectura y animaciones al desplazarse.
- Cambio entre modo oscuro y claro; guarda la preferencia.
- Tarjetas de proyectos con filtro por categoría.
- Enlaces reales al perfil **https://github.com/Nemphisto** y al deber de bisección.
- **Laboratorio funcional de bisección** para f(x) = x³ − x − 2, con gráfica en Canvas, validación de intervalos, iteraciones individuales, resolución completa y tabla de resultados.
- Consideraciones de accesibilidad, como navegación por teclado y respeto a la preferencia de movimiento reducido.

## Organización

```text
portafolio-futurista/
├── index.html          # Estructura y contenido del sitio
├── css/
│   └── styles.css      # Diseño, efectos visuales y responsive
├── js/
│   └── app.js          # Interacciones y algoritmo de bisección
├── assets/
│   └── favicon.svg     # Ícono del sitio
├── .nojekyll           # Compatible con GitHub Pages
├── .gitignore
└── README.md
```

## Personalización

- **Nombre y presentación:** busca `NEMPHISTO` en `index.html` y edita el alias, los encabezados y la descripción personal. Se usó tu usuario de GitHub como nombre visual; sustituye por tu nombre real si así lo deseas.
- **GitHub:** los enlaces actuales apuntan a `https://github.com/Nemphisto` y a `https://github.com/Nemphisto/METODOS-NUMERICOS/tree/main/Deber_01_Biseccion`.
- **Proyectos:** edita las tarjetas en la sección `<section id="proyectos">` de `index.html`. Las tarjetas de Sistemas Operativos y Redes están marcadas como **en desarrollo** y no simulan enlaces publicados.
- **Estilo visual:** modifica las variables al comienzo de `css/styles.css`.
- **Funciones y gráfica:** modifica `js/app.js`. La función actual es `const f = x => x * x * x - x - 2`; si cambias la función, cambia también su etiqueta en `index.html`.

## Subir a GitHub y publicar gratis (GitHub Pages)

**Recomendado:** crear un repositorio independiente llamado `Nemphisto.github.io` para que el sitio esté en la dirección principal `https://nemphisto.github.io/`. Este repositorio no reemplaza `METODOS-NUMERICOS`; desde el sitio ya hay vínculos a ese proyecto.

### Método desde Visual Studio Code y terminal integrada

Con Git instalado y tu sesión de GitHub configurada:

```bash
git init
git add .
git commit -m "Crear portafolio personal futurista"
git branch -M main
git remote add origin https://github.com/Nemphisto/Nemphisto.github.io.git
git push -u origin main
```

**Importante:** primero crea en github.com el repositorio público `Nemphisto.github.io`, vacío y sin README (el proyecto ya incluye uno). Si tu Git local no tiene nombre/correo configurados, Git te solicitará configurarlos antes del commit.

En GitHub, abre el nuevo repositorio y navega a:

`Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → Folder: /(root) → Save`.

Espera a que GitHub termine de publicar y abre `https://nemphisto.github.io/` (la dirección funcionará solo **después** del despliegue). Revisa la pestaña **Actions** si no aparece.

### Alternativa sin terminal

En GitHub crea el mismo repositorio y utiliza **Add file → Upload files** para subir `index.html`, las carpetas `css`, `js`, `assets` y los demás archivos, manteniendo sus nombres y estructura. Configura después **Settings → Pages** como se describe arriba.

## Entrega para la actividad

En el aula virtual puedes compartir la **URL pública de tu página**, `https://nemphisto.github.io/`, después de verificar que carga correctamente. El enlace al repositorio del código web es `https://github.com/Nemphisto/Nemphisto.github.io`, después de crearlo.

---

Proyecto creado para una actividad de Métodos Numéricos. El método de bisección que muestra el laboratorio es una demostración real, no una simulación visual sin algoritmo.
