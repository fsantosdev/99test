# 99test

1. Install Dependencies
1.1 Install Express
npm install -g express

1.2 Install Mongoose 
npm install -g mongoose

1.3 Install Nodemon
npm install -g nodemon

1.4 Install general dependencies
npm install packages.json

2. Run Docker 
2.1 Go to Folder docker/mongodb
2.2 Build Mongodb Docker | sudo docker-compose up
2.3 After Builded just start with | sudo docker-compose start

3 Populate database
3.1 Run project | nodemon app.js
3.2 Populate Orders | Hit url: http://localhost:3000/order-book/import-orderbook
3.2 Populate Exchanges | Hit url: http://localhost:3000/exchanges/import-exchanges



Docker Cheat Sheet
stop all containers:
sudo docker kill $(docker ps -q)

remove all containers
sudo docker rm $(docker ps -a -q)

remove all images
sudo docker rmi $(docker images -q)