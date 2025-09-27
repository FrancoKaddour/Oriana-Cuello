# 📸 Oriana Cuello Photography Portfolio

Portafolio profesional de fotografía con diseño **mobile-first** completamente responsive, optimizado para ofrecer una experiencia visual excepcional en todos los dispositivos.

## 🎯 Características del Diseño Responsive

### 📱 Mobile First Approach

Este proyecto implementa una estrategia **mobile-first**, donde el diseño base está optimizado para dispositivos móviles y luego se escala progresivamente para pantallas más grandes usando media queries.

#### Ventajas del enfoque mobile-first:
- **Mejor rendimiento** en dispositivos móviles (mayoría del tráfico web)
- **Carga más rápida** al priorizar contenido esencial
- **UX optimizada** para touch y pantallas pequeñas
- **SEO mejorado** (Google prioriza mobile-first indexing)

### 🔧 Arquitectura CSS Modular

```
css/
├── variables.css     # Variables CSS personalizadas
├── base.css         # Estilos base y reset
├── components.css   # Componentes reutilizables
├── layout.css       # Sistema de layout
└── responsive.css   # Media queries mobile-first
```

### 📐 Breakpoints Responsivos

El diseño utiliza breakpoints estratégicos para una experiencia fluida:

| Dispositivo | Ancho | Breakpoint |
|-------------|-------|------------|
| **Móvil Pequeño** | < 409px | Base (sin media query) |
| **Móvil Medio** | 409px - 479px | `@media (min-width: 409px)` |
| **Móvil Grande** | 480px - 639px | `@media (min-width: 480px)` |
| **Tablet** | 640px - 767px | `@media (min-width: 640px)` |
| **Tablet Grande** | 768px - 1023px | `@media (min-width: 768px)` |
| **Desktop** | 1024px - 1279px | `@media (min-width: 1024px)` |
| **Desktop XL** | ≥ 1280px | `@media (min-width: 1280px)` |

### 🎨 Componentes Adaptativos

#### Galería de Polaroids
- **Móvil**: Diseño en columna única con scroll horizontal
- **Tablet**: Grid de 2-3 columnas con espaciado optimizado
- **Desktop**: Grid masonry de 4+ columnas con hover effects

#### Navegación
- **Móvil**: Menú hamburguesa colapsable
- **Tablet+**: Barra de navegación horizontal completa

#### Tipografía Escalable
- **Sistema de escalado fluido** usando `clamp()` y variables CSS
- **Jerarquía visual** que se adapta según el dispositivo
- **Legibilidad optimizada** para cada tamaño de pantalla

### ⚡ Optimizaciones de Rendimiento

#### Imágenes Responsivas
```html
<!-- Ejemplo de implementación -->
<picture>
  <source media="(min-width: 1024px)" srcset="image-large.webp">
  <source media="(min-width: 640px)" srcset="image-medium.webp">
  <img src="image-small.webp" alt="Descripción" loading="lazy">
</picture>
```

#### CSS Crítico
- **Preload de fuentes** críticas
- **CSS modular** para carga eficiente
- **Variables CSS** para consistencia y mantenimiento

### 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico** para estructura accesible
- **CSS3 Moderno** con Custom Properties y Grid/Flexbox
- **Vanilla JavaScript** para interacciones suaves
- **Progressive Enhancement** para compatibilidad universal

### 📊 Testing Responsive

El diseño ha sido probado en:
- ✅ iPhone SE (375px)
- ✅ iPhone 12/13/14 (390px)
- ✅ iPhone 12/13/14 Plus (428px)
- ✅ iPad (768px)
- ✅ iPad Pro (1024px)
- ✅ Desktop HD (1920px)
- ✅ Desktop 4K (2560px+)

### 🚀 Deployment

Desplegado en **Vercel** con configuración optimizada para sitios estáticos y detecta automáticamente la estructura del proyecto.

### 📈 Core Web Vitals

El diseño está optimizado para obtener puntuaciones excelentes en:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1

---

**Diseño responsive mobile-first que prioriza la experiencia del usuario en todos los dispositivos** 📱💻🖥️