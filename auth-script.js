function signup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
  
    if (!username || !password) {
      showMessage("Please enter username and password.");
      return;
    }
  
    if (localStorage.getItem(`user_${username}`)) {
      showMessage("Username already exists.");
      return;
    }
  
    localStorage.setItem(`user_${username}`, password);
    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  }
  
  function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
  
    const storedPassword = localStorage.getItem(`user_${username}`);
  
    if (storedPassword && storedPassword === password) {
      localStorage.setItem("currentUser", username);
      window.location.href = "index.html";
    } else {
      showMessage("Invalid username or password.");
    }
  }
  
  function showMessage(msg) {
    document.getElementById("message").textContent = msg;
  }
  