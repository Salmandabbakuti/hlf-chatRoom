echo "Removing key from key store..."

rm -rf ./hfc-key-store

# Remove chaincode docker image
sudo docker rmi -f dev-peer0.org1.example.com-mycc-1.0-384f11f484b9302df90b453200cfb25174305fce8f53f4e94d45ee3b6cab0ce9
sleep 2

cd ../basic-network
./start.sh

sudo docker ps -a



echo 'Installing chaincode..'
sudo docker exec -it cli peer chaincode install -n mycc -v 1.0 -p "/opt/gopath/src/github.com" -l "node"

echo 'Instantiating chaincode..'
sudo docker exec -it cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -l "node" -v 1.0 -c '{"Args":[]}'

echo 'Getting things ready for Chaincode Invocation..should take only 10 seconds..'

sleep 10

echo 'Registering Users..'

sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"register","Args":["salman279","12345","Salman Dev","salman@email.com","Software Craftsman"]}'
sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"register","Args":["ramesh079","12345","Ramesh","Ramesh@email.com","Electrical Engineer"]}'

sleep 3
echo 'sending message'

sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"sendMessage","Args":["salman279","12345","ramesh079","Hi Ramesh"]}'
sleep 3
sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"sendMessage","Args":["salman279","12345","ramesh079","How Are You?"]}'
sleep 3
sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"sendMessage","Args":["salman279","12345","ramesh079","I tried calling you yesterday."]}'
echo "checking messages.."
sleep 3
sudo docker exec -it cli peer chaincode query -C mychannel -n mycc -c '{"function":"inbox","Args":["ramesh079","12345"]}'
sleep 3
sudo docker exec -it cli peer chaincode query -C mychannel -n mycc -c '{"function":"outbox","Args":["salman279","12345"]}'
sleep 5

echo 'Adding Friends..'

sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"addFriend","Args":["salman279","12345","ramesh079"]}'

echo 'checking Friends..'

sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"myFriends","Args":["salman279","12345"]}'



sleep 5
# Starting docker logs of chaincode container

sudo docker logs -f dev-peer0.org1.example.com-mycc-1.0


