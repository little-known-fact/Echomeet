let localStream;
let peer;
let currentCall;
let conn;

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localStream = stream;
  document.getElementById('localVideo').srcObject = stream;

  peer = new Peer();
  peer.on('open', id => {
    document.getElementById('meetingIdDisplay').textContent = id;
  });

  // Handle incoming calls
  peer.on('call', call => {
    currentCall = call;
    call.answer(localStream);
    call.on('stream', remoteStream => {
      document.getElementById('remoteVideo').srcObject = remoteStream;
    });
  });

  // Handle incoming chat connection
  peer.on('connection', connection => {
    conn = connection;
    conn.on('data', data => {
      showMessage(`Stranger: ${data}`);
    });
  });
}).catch(err => {
  console.error('Error accessing media devices.', err);
  alert('Cannot access camera/mic.');
});

function callPeer() {
  const remotePeerId = document.getElementById('peer-id').value.trim();
  if (!remotePeerId) return alert('Enter a valid ID');

  // Chat connection
  conn = peer.connect(remotePeerId);
  conn.on('open', () => {
    conn.on('data', data => {
      showMessage(`Stranger: ${data}`);
    });
  });

  // Media call
  const call = peer.call(remotePeerId, localStream);
  currentCall = call;
  call.on('stream', remoteStream => {
    document.getElementById('remoteVideo').srcObject = remoteStream;
  });
}

function sendMessage() {
  const msg = document.getElementById('message').value.trim();
  if (!msg || !conn || conn.open === false) return;

  conn.send(msg);
  showMessage(`You: ${msg}`);
  document.getElementById('message').value = '';
}

function showMessage(msg) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function shareScreen() {
  if (!currentCall) return alert('Call must be active to share screen.');

  navigator.mediaDevices.getDisplayMedia({ video: true }).then(screenStream => {
    const screenTrack = screenStream.getVideoTracks()[0];

    // Replace the video track in the call with the screen track
    const sender = currentCall.peerConnection.getSenders().find(s => s.track.kind === 'video');
    if (sender) {
      sender.replaceTrack(screenTrack);
    }

    screenTrack.onended = () => {
      // Switch back to camera when screen sharing ends
      const camTrack = localStream.getVideoTracks()[0];
      if (sender) {
        sender.replaceTrack(camTrack);
      }
    };
  }).catch(err => {
    console.error('Error sharing screen:', err);
    alert('Screen sharing failed.');
  });
}

function endCall() {
  if (currentCall) {
    currentCall.close();
    document.getElementById('remoteVideo').srcObject = null;
    currentCall = null;
  }
  if (conn) {
    conn.close();
    conn = null;
  }
  alert('Call ended.');
}

let micEnabled = true;

function toggleMic() {
  localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  micEnabled = !micEnabled;
  document.getElementById('micBtn').textContent = micEnabled ? 'Mute Mic' : 'Unmute Mic';
}
setInterval(() => {
  const audioTracks = document.getElementById('remoteVideo').srcObject?.getAudioTracks();
  if (audioTracks && audioTracks.length > 0) {
    const muted = !audioTracks[0].enabled;
    document.getElementById('remoteMicStatus').textContent = muted ? 'Mic: Off' : 'Mic: On';
  }
}, 1000);
