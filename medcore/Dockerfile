# --- Etapa de build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Si tu front usa REACT_APP_API_URL, puedes inyectarlo en build (opcional):
# ARG REACT_APP_API_URL=/api
# ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# --- Etapa de serve ---
FROM nginx:1.27-alpine
# Copiamos la app compilada
COPY --from=build /app/build /usr/share/nginx/html
# Config Nginx para SPA y proxy del backend
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
