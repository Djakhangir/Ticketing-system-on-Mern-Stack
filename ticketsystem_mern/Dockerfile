# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install

COPY . .

# API origin is baked into the static bundle at build time.
ARG REACT_APP_API_ORIGIN=http://localhost:3001
ENV REACT_APP_API_ORIGIN=$REACT_APP_API_ORIGIN
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
