FROM node:14

# Instalar Chromium en el contenedor
RUN apk --no-cache add chromium

# Establecer variables de entorno
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV CHROMIUM_PATH="/usr/bin/chromium-browser"
ENV PUPPETEER_EXECUTABLE_PATH="${CHROMIUM_PATH}"

# Copiar su proyecto en el contenedor
COPY . .

# Instalar dependencias de Node.js
RUN yarn

# Ejecutar su proyecto
CMD ["node", "index.js"]
