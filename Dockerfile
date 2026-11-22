FROM node:20-alpine AS frontend
WORKDIR /ui
COPY Frontend/inkflow-ui/package*.json ./
RUN npm ci
COPY Frontend/inkflow-ui/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY INKFLOW.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish INKFLOW.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
COPY --from=frontend /ui/dist ./wwwroot
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "INKFLOW.dll"]