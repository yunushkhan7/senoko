#stage 1
FROM node:14.17.1 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/senoko /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
