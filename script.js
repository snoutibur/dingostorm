// Automatically scroll to the bottom & toggles
let autoscroll = true;

function toBottom() {
  window.scrollTo({
    top:document.body.scrollHeight
  });
}

function scrollToggle() {
  autoscroll = !autoscroll;
  console.log("Auto scroll: ", autoscroll);

  let toggleButton = document.getElementById("scrollToggle");
  if(autoscroll == true) {
    toggleButton.innerText = "Autoscroll ON";
  } else {
    toggleButton.innerText = "Autoscroll OFF";
  }
};

// Connect
async function connect() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("wss://chat.stormyyy.dev");

    socket.onopen = function(event) {
      console.log("Connection with server established!");
      resolve(socket);
    };

    socket.onclose = function(event) {
      console.log(`WebSocket closed. Reconnecting... (Code: ${event.code})`);
      setTimeout(connect, 1000); // Reconnect after 1 sec
    };

    socket.onerror = function (error) {
      console.log(error);
      reject(error);
    };
  })
}

// Notification spammer //
let notify = true;
function notifyToggle() {
  notify = !notify;

  console.log("Notifications: ", autoscroll);

  let notifyToggle = document.getElementById("notifyToggle");
  if(notify == true) {
    notifyToggle.innerText = "Notifications ON";
  } else {
    notifyToggle.innerText = "Notifications MUTED";
  }
}

function sendNotif(notifMessage) {
  if(Notification.permission == "granted") {
    if(document.hidden || !document.hasFocus()) {
      new Notification("StormChat Message!", {
        body: notifMessage,
        icon: "https://cdn.discordapp.com/avatars/1283147889702604841/29b0ac10fee801532b577c57f3bffb50.webp?size=1024&width=384&height=256"
      })
  
      let notificationSound = new Audio("borkNotif.mp3");
      notificationSound.play().catch(error => {
        console.warn("Notification sound error: ", error);
      });
    }
  } else {
    Notification.requestPermission();
  }
}

// Client events
(async () => {
  try {
    // Login form
    const socket = await connect();
    console.log("WebSocket connected:", socket);
    
    let username = "bob";
    let password = "bob";

    document.forms['login'].onsubmit = function(event) {
      event.preventDefault();

      username = this['username-login'].value;
      password = this['password-login'].value;

      socket.send(`LOGIN,${username},${password},"NULL"`);
      this.reset();
      return false;
    };

    document.forms.message_send.onsubmit = function() {
      let out_msg = this.message.value;
      socket.send(`USER_MESSAGE,${username},${password},${out_msg}`);
      this.reset();
      this.message.focus();

      return false;
    }

    socket.onmessage = function(event) {
      let split_msg = event.data.split(",");
      
      let msg_type = split_msg[0];
      let msg = `[${split_msg[1]}]: ${split_msg[2]}`;

      if (msg_type === "RESPONSE_LOGIN_SUCCESS") {
        document.getElementById("error-message").textContent = "";
        document.getElementById("chat").classList.remove("removed");
        // document.getElementById("register-form").classList.add("removed");
        document.getElementById("login-form").classList.add("removed");
        document.createElement
        return; // don't show this message
      }

      if (msg_type === "RESPONSE_LOGIN_FAIL") {
        document.getElementById("error-message").textContent = "Error logging in."
        return;
      }
      

    // Message handler
      console.log(event.data);
      if (msg == `[${username}]: !givemedoom`) {
        let doomElement = document.createElement("iframe");
        doomElement.src = "https://ustymukhman.github.io/webDOOM/public/";
        doomElement.classList.add("doom");

        document.getElementById("messages").append(doomElement);
        return;
      }

      if (msg == `[${username}]: !minecraftforfree`) {
        let mcElement = document.createElement("iframe");
        mcElement.src = "https://games.stormyyy.dev/minecraft";
        mcElement.classList.add("minecraft");

        document.getElementById("messages").append(mcElement);
        return;
      }

      if (msg == `[${username}]: !givemeslope`) {
        let slopeElement = document.createElement("iframe");
        slopeElement.src = "https://y8.com/embed/slope";
        slopeElement.scrolling= "no";
        slopeElement.classList.add("slope");

        document.getElementById("messages").append(slopeElement);
      }

      if (msg ==`[${username}]: !givemerick`) {
        let video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.classList.add("rick");

        let source = document.createElement("source");
        source.src = "https://dn720407.ca.archive.org/0/items/rick-roll/Rick%20Roll.mp4";
        source.type = "video/mp4";

        video.appendChild(source);
        document.getElementById("messages").append(video);

        return;
      }

      if (msg ==`[${username}]: !drippybozo`) {
        let video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.classList.add("drippy");

        let source = document.createElement("source");
        source.src = "https://stormyyy.dev/media/drippy.mp4";
        source.type = "video/mp4";

        video.appendChild(source);
        document.getElementById("messages").append(video);

        return;
      }

      // remove all games/videos added with commands
      if (msg ==`[${username}]: !ihatefun`) {
        return;
      }

      // Inserts messages
      let msgElement = document.createElement("div");
      msgElement.textContent = msg;
      document.getElementById("messages").append(msgElement);

      // autoscroll
      if(autoscroll == true) {
        toBottom();
      }

      // Annoy users with notifications!
      if(notify == true) {
        sendNotif(msg);
      }
    }

    // no get booted
    setInterval(() => {
      socket.send("ping");
    }, 10000);

  } catch (error) {
    console.error("Failed to connect:", error);
  }
})();
