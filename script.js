window.onload = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      window.location.href = "auth.html";
    } else {
      document.getElementById("username-display").textContent = user;
      showMeetingHistory();
    }
  };
  
  function createMeeting() {
    const code = Math.random().toString(36).substring(2, 8);
    saveMeeting(code);
    window.location.href = `meeting.html?code=${code}`;
  }
  
  function joinMeeting() {
    const code = document.getElementById("join-code").value.trim();
    if (code === "") {
      alert("Please enter a code.");
      return;
    }
    saveMeeting(code);
    window.location.href = `meeting.html?code=${code}`;
  }
  
  function saveMeeting(code) {
    const user = localStorage.getItem("currentUser");
    let meetings = JSON.parse(localStorage.getItem(`meetings_${user}`)) || [];
    if (!meetings.includes(code)) {
      meetings.unshift(code);
      if (meetings.length > 10) meetings.pop(); // Limit to 10 meetings
      localStorage.setItem(`meetings_${user}`, JSON.stringify(meetings));
    }
  }
  
  function showMeetingHistory() {
    const user = localStorage.getItem("currentUser");
    const list = document.getElementById("meeting-list");
    let meetings = JSON.parse(localStorage.getItem(`meetings_${user}`)) || [];
  
    meetings.forEach(code => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="meeting.html?code=${code}">${code}</a>`;
      list.appendChild(li);
    });
  }
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "auth.html";
  });

  function addFriend() {
    const username = localStorage.getItem("currentUser");
    const newFriend = document.getElementById("friend-username").value.trim();
    if (!newFriend || newFriend === username) return;
  
    const friendKey = `friends_${username}`;
    let friends = JSON.parse(localStorage.getItem(friendKey)) || [];
  
    if (!friends.includes(newFriend)) {
      friends.push(newFriend);
      localStorage.setItem(friendKey, JSON.stringify(friends));
      displayFriends();
    }
    document.getElementById("friend-username").value = "";
  }
  
  function displayFriends() {
    const username = localStorage.getItem("currentUser");
    const friendKey = `friends_${username}`;
    let friends = JSON.parse(localStorage.getItem(friendKey)) || [];
  
    const list = document.getElementById("friend-list");
    list.innerHTML = "";
  
    friends.forEach(friend => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${friend} 
        <button onclick="inviteFriend('${friend}')">Invite</button>
      `;
      list.appendChild(li);
    });
  }
  
  function inviteFriend(friendName) {
    const code = Math.random().toString(36).substring(2, 8);
    saveMeeting(code);
  
    alert(`Invite sent to ${friendName} with meeting code: ${code}
  (Since this is offline/local, you can copy the code and send it yourself.)`);
  
    // Optional: Copy link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/meeting.html?code=${code}`);
  }
  
  window.onload = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      window.location.href = "auth.html";
    } else {
      document.getElementById("username-display").textContent = user;
      showMeetingHistory();
      displayFriends(); // Show friends after login
    }
  };
  