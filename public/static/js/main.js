$(document.links).filter(function() {
    return this.hostname != window.location.hostname;
}).attr('target', '_blank');

/* Persona/Browser ID stuff */

$("#login").click(function() {
  navigator.id.request();
});

$("#logout").click(function() {
  console.log("logging out!");
  console.log("Issuing logout");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/persona/logout", true);
  xhr.addEventListener("loadend", function(e) {
    console.log("reporting logout for user: " + email);
    if (location.pathname != '/stats' ||
        location.pathname != '/admin') {
      location.reload(); 
    } else {
      location.href = '/';
    }
  });
  xhr.send();

  navigator.id.logout();
});

$("#del-stats").click(function() {
  if (!confirm("Are you sure you want to completely nuke all of your user data?")) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/stats", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("loadend", function(e) {
    var data = JSON.parse(this.responseText);
    if (data && data.status === "okay") {
      console.log("Data was successfully deleted");
      location.reload(); 
    }
  }, false);

  xhr.send(JSON.stringify({
  }));
});

$(function() {
  // By default, express-persona adds the users email address to req.session.email when their email is validated.
  navigator.id.watch({
    onlogin: function(assertion) {
      console.log("onlogin");
      // Check for already logged in
      if (email) {
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/persona/verify", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("loadend", function(e) {
        var data = JSON.parse(this.responseText);
        if (data && data.status === "okay") {
          console.log("reporting login for user: " + email);
          location.reload(); 
        }
      }, false);

      xhr.send(JSON.stringify({
        assertion: assertion
      }));
    },
    onlogout: function() {
      // For some reason we're getting onlogout calls when we shouldn't.
      // To avoid this I put the actual xhr calls inside the logout button
      // handler.
      if (!email) {
        console.log("persona calling onlogout with known email");
      } else {
        console.log("persona calling onlogout with unknown email");
      }
    }
  });
});
