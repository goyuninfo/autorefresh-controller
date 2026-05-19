(function(){
  if (window.__arLoaded) return;
  window.__arLoaded = true;

  var interval = localStorage.__arInterval ? parseInt(localStorage.__arInterval,10) : null;
  var active = localStorage.__arActive === "1";

  if (!interval) {
    interval = parseInt(prompt("Refresh interval (seconds):","60"),10);
    if (isNaN(interval) || interval <= 0) return;
    localStorage.__arInterval = interval;
  }

  var sec = interval;
  var box = document.createElement("div");
  box.id = "__arBox";
  box.style.cssText = "position:fixed;bottom:20px;right:20px;padding:10px;background:rgba(0,0,0,0.8);color:#fff;font-size:14px;font-family:Arial;border-radius:6px;z-index:999999;cursor:move;user-select:none;width:180px;box-shadow:0 0 6px rgba(0,0,0,0.5)";

  var status = document.createElement("div");
  status.style.marginBottom = "8px";
  status.textContent = active ? ("Refreshing in " + sec + "s") : "Stopped";

  var start = document.createElement("button");
  start.textContent = "Start";
  start.style.width = "80px";
  start.style.marginRight = "5px";

  var stop = document.createElement("button");
  stop.textContent = "Stop";
  stop.style.width = "80px";

  box.appendChild(status);
  box.appendChild(start);
  box.appendChild(stop);
  document.body.appendChild(box);

  var timer = null;

  function tick() {
    if (!active) return;
    sec--;
    if (sec <= 0) {
      sec = interval;
      location.reload();
      return;
    }
    status.textContent = "Refreshing in " + sec + "s";
  }

  if (active) {
    timer = setInterval(tick, 1000);
  }

  start.onclick = function() {
    if (active) return;
    active = true;
    localStorage.__arActive = "1";
    sec = interval;
    status.textContent = "Refreshing in " + sec + "s";
    timer = setInterval(tick, 1000);
  };

  stop.onclick = function() {
    active = false;
    localStorage.__arActive = "0";
    clearInterval(timer);
    status.textContent = "Stopped";
  };

  var drag = false, ox = 0, oy = 0;
  box.addEventListener("mousedown", function(e){
    if (e.target === start || e.target === stop) return;
    drag = true;
    ox = e.clientX - box.offsetLeft;
    oy = e.clientY - box.offsetTop;
    e.preventDefault();
  });

  document.addEventListener("mousemove", function(e){
    if (!drag) return;
    box.style.left = (e.clientX - ox) + "px";
    box.style.top = (e.clientY - oy) + "px";
    box.style.bottom = "auto";
    box.style.right = "auto";
  });

  document.addEventListener("mouseup", function(){
    drag = false;
  });
})();
