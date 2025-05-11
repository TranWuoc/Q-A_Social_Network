import { io } from "socket.io-client";
const socket = io("http://localhost:5001"); // trỏ về server Nodejs
export default socket;