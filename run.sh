npx kill-port 3000 &&
npm run build &&
cp -r ./build/ ../server-webrtc &&
cd ../server-webrtc/ && nodemon

