# Build stage
FROM public.ecr.aws/docker/library/node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM public.ecr.aws/docker/library/node:20-alpine
RUN npm install -g serve
COPY --from=build /app/dist /dist
CMD ["sh", "-c", "serve -s /dist -l ${PORT:-3000}"]
