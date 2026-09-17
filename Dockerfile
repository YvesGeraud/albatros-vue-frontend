# ---- base stage ----
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./

# ---- dev stage (desarrollo con Vite y hot-reload) ----
FROM base AS dev
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--", "--host"]

# ---- build stage (compilación para producción) ----
FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ---- prod stage (servidor Nginx para producción) ----
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

