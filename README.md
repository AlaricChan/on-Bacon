# on-Bacon
Static files renderer

- Use data example.json to import example to your hwinfo collection in cmdb database in mongo

## start application
- cd on-Bacon
- npm install
- node app.js

## test application

- wget http://localhost:9999/cmdb/install_ubuntu_payload_iso_full.json?macaddress=00:11:22:33:44:77

## on-bacon can be used as an application

- cd on-Bacon
- sudo npm install -g
- render -t templates/template.sh -j myjson.json
