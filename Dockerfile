FROM node:4

COPY . /RackHD/on-bacon
WORKDIR /RackHD/on-bacon
RUN npm install
EXPOSE 9999
CMD [ "node", "/RackHD/on-bacon/app.js" ]
