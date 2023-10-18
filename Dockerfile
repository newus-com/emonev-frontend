# Dockerfile
FROM node:16-alpine
 
 
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
 
COPY . .
RUN npm run build
 
EXPOSE 80
CMD ["node", "build"]

