let in1 = document.getElementById("form-sms-1"),
  ins = document.querySelectorAll('input[inputtype="numeric"]');

ins.forEach(function (input) {
  input.addEventListener("keyup", function (e) {
    if (
      e.keyCode === 16 ||
      e.keyCode == 9 ||
      e.keyCode == 224 ||
      e.keyCode == 18 ||
      e.keyCode == 17
    ) {
      return;
    }
    if (
      (e.keyCode === 8 || e.keyCode === 37) &&
      this.previousElementSibling &&
      this.previousElementSibling.tagName === "INPUT"
    ) {
      this.previousElementSibling.select();
    } else if (e.keyCode !== 8 && this.nextElementSibling) {
      this.nextElementSibling.select();
    }
    if (e.target.value.length < 2) {
      input.value = input.value.replace(/[^0-9\.]/g, "");
    } else {
      input.value = input.value.replace(/[^0-9\.]/g, "").slice(0, -1);
    }
  });
  input.addEventListener("focus", function (e) {
    if (this === in1) return;
    if (in1.value == "") {
      in1.focus();
    }
    if (this.previousElementSibling.value == "") {
      this.previousElementSibling.focus();
    }
  });
});
in1.addEventListener("input", function (e) {
  let data = e.data || this.value;
  if (!data) return;
  if (data.length === 1) return;
  for (i = 0; i < data.length; i++) {
    ins[i].value = data[i];
  }
});
// sms form
if ("OTPCredential" in window) {
  window.addEventListener("DOMContentLoaded", (e) => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        ac.abort();
      });
    }
    navigator.credentials
      .get({
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otp) => {
        [...otp.code].forEach((e, i) => {
          console.log(e, i);
          ins[i].value = e;
        });
        if (form) form.submit();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
var timeleft = 60;
var timerDown = setInterval(function () {
  if (timeleft <= 0) {
    clearInterval(timerDown);
  }
  document.getElementById("smsTime").innerHTML = timeleft;
  timeleft -= 1;
}, 1000);
