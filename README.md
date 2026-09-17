# Albatros Tlaxcala — Frontend

Sitio público y panel de administración en Vue 3 + Vite.

La documentación completa del proyecto (arquitectura, cómo levantar todo, credenciales, variables de entorno, Docker) está en el [README de la raíz](../README.md).

## Arranque rápido (nativo)

```bash
pnpm install
pnpm run dev
```

> Este proyecto usa **pnpm**, no npm.

## Arranque rápido (Docker, solo frontend)

Modo desarrollo con recarga en caliente (puerto `5173`):
```bash
docker compose up --build
# o también:
pnpm run docker:dev
```

Para bajar el contenedor:
```bash
docker compose down
# o:
pnpm run docker:down
```

## Build de Producción (Nginx)

Para compilar la imagen de producción servida con Nginx (puerto `80`):
```bash
docker build -t albatros-frontend .
docker run -p 80:80 albatros-frontend
```


## Lint

```bash
pnpm run lint
```
