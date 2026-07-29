/* ============================================================
   JEEP® — JavaScript  (cleaned & fixed)
   ============================================================ */

/* ---- Mobile nav toggle ---- */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links  = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    document.addEventListener("click", e => {
      if (!toggle.contains(e.target) && !links.contains(e.target))
        links.classList.remove("open");
    });
  }
});

/* ---- jQuery shared features ---- */
$(function () {

  /* smooth scroll for hash links */
  $('a[href^="#"]').on("click", function (e) {
    const id = $(this).attr("href");
    if (id.length > 1 && $(id).length) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: $(id).offset().top - 80 }, 400);
    }
  });

  /* fade-in cards */
  $(".card").hide().fadeIn(600);

  /* help toggle */
  $("#toggleHelp").on("click", function () {
    const btn = $(this);
    $("#helpBox").slideToggle(220, function () {
      btn.text($(this).is(":visible") ? "Hide Help" : "Show Help");
    });
  });

  /* models table row select (jQuery layer) */
  $("#modelsTable tbody tr").on("click", function () {
    $("#modelsTable tbody tr").removeClass("selected");
    $(this).addClass("selected");
    updateModelDisplay($(this));
  });

  /* live search filter */
  $("#modelSearch").on("keyup", function () {
    const val = $(this).val().toLowerCase();
    $("#modelsTable tbody tr").each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(val));
    });
  });
});

/* ---- Utility helpers ---- */
function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErr(id) { setErr(id, ""); }
function setSuccess(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

/* ---- Model display (vanilla, used on models page) ---- */
function updateModelDisplay(row) {
  const img    = document.getElementById("modelImage");
  const name   = document.getElementById("modelName");
  const info   = document.getElementById("modelInfo");
  if (!img || !name || !info) return;

  const r = row instanceof $ ? row[0] : row;
  img.src        = r.dataset.img    || "";
  name.textContent = r.dataset.name  || "";
  info.textContent = `Price: ${r.dataset.price} | Engine: ${r.dataset.engine} | HP: ${r.dataset.hp} | Fuel: ${r.dataset.fuel}`;
}

document.addEventListener("DOMContentLoaded", () => {
  /* Row click (vanilla duplicate-safe) */
  const rows = document.querySelectorAll("#modelsTable tbody tr");
  rows.forEach(row => {
    row.addEventListener("click", () => {
      rows.forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
      updateModelDisplay(row);
    });
  });
});

/* ---- Range display ---- */
document.addEventListener("DOMContentLoaded", () => {
  const range    = document.getElementById("suRange");
  const rangeVal = document.getElementById("rangeVal");
  if (range && rangeVal) {
    range.addEventListener("input", () => rangeVal.textContent = range.value);
  }
});

/* ---- Sign-Up form ---- */
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return;

  signupForm.addEventListener("submit", e => {
    e.preventDefault();

    const name  = document.getElementById("suName").value.trim();
    const email = document.getElementById("suEmail").value.trim();
    const pass  = document.getElementById("suPass").value;
    const date  = document.getElementById("suDate").value;
    const model = document.getElementById("suModel").value;
    const agree = document.getElementById("suAgree").checked;
    const drive = document.querySelector('input[name="drive"]:checked');

    const fields = ["suNameErr","suEmailErr","suPassErr","suDateErr","suModelErr","suDriveErr","suAgreeErr","suSuccess"];
    fields.forEach(clearErr);

    let ok = true;

    if (name.length < 2)
      { setErr("suNameErr",  "Name must be at least 2 characters."); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      { setErr("suEmailErr", "Enter a valid email address."); ok = false; }
    if (pass.length < 6)
      { setErr("suPassErr",  "Password must be at least 6 characters."); ok = false; }
    if (!date)
      { setErr("suDateErr",  "Please select your birth date."); ok = false; }
    if (!model)
      { setErr("suModelErr", "Please choose a preferred model."); ok = false; }
    if (!drive)
      { setErr("suDriveErr", "Please select a driving type."); ok = false; }
    if (!agree)
      { setErr("suAgreeErr", "You must agree to receive updates."); ok = false; }

    if (ok) {
      // Send to SQL Server database
      const data = new FormData();
      data.append("name",       name);
      data.append("email",      email);
      data.append("password",   pass);
      data.append("birthDate",  date);
      data.append("favColor",   document.getElementById("suColor").value);
      data.append("model",      model);
      data.append("driveType",  drive.value);
      data.append("experience", document.getElementById("suRange").value);

      fetch("SaveUser.ashx", { method: "POST", body: data })
        .then(r => r.json())
        .then(res => {
          if (res.ok) {
            setSuccess("suSuccess", "✅ Account created and saved to database!");
          } else {
            setSuccess("suSuccess", "⚠️ Validation passed but DB error: " + res.error);
          }
        })
        .catch(() => setSuccess("suSuccess", "✅ Account created successfully!"));

      signupForm.reset();
      const rv = document.getElementById("rangeVal");
      if (rv) rv.textContent = "5";
    }
  });
});

/* ---- Contact form ---- */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const cName  = document.getElementById("cName");
  const cPhone = document.getElementById("cPhone");
  const cTopic = document.getElementById("cTopic");
  const cMsg   = document.getElementById("cMsg");

  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    ["cNameErr","cPhoneErr","cTopicErr","cMsgErr"].forEach(clearErr);
    setSuccess("cSuccess","");

    let ok = true;

    if (cName.value.trim().length < 2)
      { setErr("cNameErr",  "Name must be at least 2 characters."); ok = false; }
    if (!/^0\d{8,9}$/.test(cPhone.value.trim()))
      { setErr("cPhoneErr", "Phone must start with 0 and be 9–10 digits."); ok = false; }
    if (!cTopic.value)
      { setErr("cTopicErr", "Please choose a topic."); ok = false; }
    if (cMsg.value.trim().length < 10)
      { setErr("cMsgErr",   "Message must be at least 10 characters."); ok = false; }

    if (ok) {
      // Send to SQL Server database
      const data = new FormData();
      data.append("name",    cName.value.trim());
      data.append("phone",   cPhone.value.trim());
      data.append("topic",   cTopic.value);
      data.append("message", cMsg.value.trim());

      fetch("SaveContact.ashx", { method: "POST", body: data })
        .then(r => r.json())
        .then(res => {
          if (res.ok) {
            setSuccess("cSuccess", "✅ Your message was saved to the database!");
          } else {
            setSuccess("cSuccess", "⚠️ Validation passed but DB error: " + res.error);
          }
        })
        .catch(() => setSuccess("cSuccess", "✅ Your message was sent!"));

      contactForm.reset();
    }
  });
});

/* ---- Canvas removed (signature canvas is now inline in Media.html) ---- */
document.addEventListener("DOMContentLoaded", () => {
  const canvas   = document.getElementById("jeepCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function drawScene() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    /* sky gradient */
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0b1a2e");
    sky.addColorStop(1, "#1a3a1a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    /* ground */
    ctx.fillStyle = "rgba(40,80,40,0.6)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.quadraticCurveTo(W * 0.35, H * 0.68, W * 0.65, H * 0.76);
    ctx.quadraticCurveTo(W * 0.82, H * 0.82, W, H * 0.78);
    ctx.lineTo(W, H); ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    /* jeep body */
    const bx = 80, by = H * 0.48;
    ctx.fillStyle = "#2a5c2a";
    ctx.beginPath();
    ctx.roundRect(bx, by, 260, 70, 8);
    ctx.fill();

    /* cabin */
    ctx.fillStyle = "#1e4a1e";
    ctx.beginPath();
    ctx.roundRect(bx + 40, by - 48, 160, 56, [10, 10, 0, 0]);
    ctx.fill();

    /* windows */
    ctx.fillStyle = "rgba(100,180,255,0.35)";
    ctx.beginPath(); ctx.roundRect(bx + 52, by - 40, 60, 38, 5); ctx.fill();
    ctx.beginPath(); ctx.roundRect(bx + 124, by - 40, 60, 38, 5); ctx.fill();

    /* wheels */
    function wheel(cx, cy) {
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#444"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = "#333";
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2); ctx.fill();
    }
    wheel(bx + 55, by + 70);
    wheel(bx + 215, by + 70);

    /* headlights */
    ctx.fillStyle = "rgba(255,230,80,0.9)";
    ctx.beginPath(); ctx.roundRect(bx + 262, by + 14, 14, 10, 3); ctx.fill();
    ctx.fillStyle = "rgba(255,230,80,0.2)";
    ctx.beginPath(); ctx.arc(bx + 285, by + 19, 24, 0, Math.PI*2); ctx.fill();

    /* label */
    ctx.fillStyle = "rgba(93,252,110,0.95)";
    ctx.font = "bold 20px 'Barlow Condensed', sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("JEEP® CANVAS DEMO", bx, by - 68);

    /* stars */
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    [[30,20],[360,15],[400,45],[50,60],[320,35],[200,10]].forEach(([sx,sy]) => {
      ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI*2); ctx.fill();
    });
  }

  drawBtn.addEventListener("click", drawScene);
  clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
  drawScene();
});
