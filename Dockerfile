FROM node:latest as build

WORKDIR /app
COPY server.js package.json ./
COPY changesetproto/* ./changesetproto/


# Clone the etherpad-lite repository
RUN git clone --branch 1.9.7 https://github.com/ether/etherpad-lite

# Install dependencies
WORKDIR /app/etherpad-lite
RUN chmod +x src/bin/functions.sh && ./src/bin/functions.sh
RUN chmod +x src/bin/installDeps.sh && ./src/bin/installDeps.sh

WORKDIR /app
RUN npm install


FROM gcr.io/distroless/nodejs

COPY --from=build /app /
EXPOSE 5051
CMD ["server.js", "0.0.0.0", "50051"]