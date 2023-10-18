# Step 1: Build the Svelte app in a Node container
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Serve the Svelte app using an Nginx container
FROM nginx:alpine

# Copy the build output from the Node container
COPY --from=build /app/public /usr/share/nginx/html

# Use a custom nginx configuration if necessary (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
