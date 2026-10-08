# ---- API image ----
FROM node:18-alpine

WORKDIR /app

# Install deps first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

# Uploaded media lives here; mount a volume in production to persist it.
RUN mkdir -p uploads/images

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "app.js"]
