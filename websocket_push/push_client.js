let ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
	console.log('Connected to server');
	ws.send("Hello! I'm client");
};
ws.onmessage = message => console.log(`received: ${message.data}`);
