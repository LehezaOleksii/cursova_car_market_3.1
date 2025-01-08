// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// const SOCKET_URL = 'http://localhost:8080/ws';

// export const connectWebSocket = (onMessage) => {
//   const jwtStr = localStorage.getItem("jwtToken");

//   const client = new Client({
//     brokerURL: SOCKET_URL,
//     Authorization: "Bearer " + jwtStr,
//     debug: (str) => console.log(str),
//     reconnectDelay: 5000,
//     heartbeatIncoming: 4000,
//     heartbeatOutgoing: 4000,
//     webSocketFactory: () => new SockJS(SOCKET_URL),
//     onConnect: () => console.log('Connected to WebSocket!'),
//     onStompError: (frame) => console.error('STOMP Error', frame),
//   });

//   client.onUnhandledMessage = (message) => {
//     if (onMessage) onMessage(message.body);
//   };

//   client.activate();
//   return client;
// };

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws';

export const connectWebSocket = (senderId, onMessage) => {
  const jwtStr = localStorage.getItem("jwtToken");

  const client = new Client({
    brokerURL: SOCKET_URL,
    Authorization: "Bearer " + jwtStr,
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    webSocketFactory: () => new SockJS(SOCKET_URL),
    onConnect: () => {
      console.log('Connected to WebSocket!');
      client.subscribe(`/user/${senderId}/messages`, (message) => {
        if (onMessage) onMessage(message.body);
      });
    },
    onStompError: (frame) => console.error('STOMP Error', frame),
  });

  client.activate();
  return client;
};
