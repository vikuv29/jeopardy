// server.js — superenkel LAN-buzzer-server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

let armed = false;           // om buzzers är öppna
let winner = null;           // {name, ts} första som buzzade

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const c of wss.clients) {
    if (c.readyState === 1) c.send(msg);
  }
}

wss.on('connection', (ws) => {
  ws.role = 'unknown';
  ws.name = 'Spelare';

  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }

    if (m.type === 'hello') {
      ws.role = m.role || 'unknown';
      ws.name = (m.name || 'Spelare').toString().slice(0, 40);
      ws.send(JSON.stringify({ type: 'state', armed, winner }));
      return;
    }

    if (m.type === 'arm') {
      armed = true; winner = null;
      broadcast({ type: 'reset' });
      broadcast({ type: 'armed', armed: true });
      return;
    }

    if (m.type === 'reset') {
      armed = false; winner = null;
      broadcast({ type: 'reset' });
      broadcast({ type: 'armed', armed: false });
      return;
    }

    if (m.type === 'buzz') {
      if (!armed || winner) { ws.send(JSON.stringify({ type: 'tooLate' })); return; }
      winner = { name: ws.name, ts: Date.now() };
      armed = false;
      broadcast({ type: 'buzzed', by: winner.name });
      broadcast({ type: 'armed', armed: false });
      return;
    }
  });
});

console.log('Buzzer-server kör på ws://0.0.0.0:3001');
