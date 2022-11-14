const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPass = document.getElementById("confirm-password");
const signBtn = document.getElementById("sign-btn");
const errMSg = document.getElementById("err-msg");

if (username) username.addEventListener("input", checkName);
if (email) email.addEventListener("input", checkEmail);
if (password) password.addEventListener("input", checkPassStrength);
if (confirmPass) confirmPass.addEventListener("input", checkConfirmPass);
if (signBtn) signBtn.addEventListener("clicl", signUp);

function checkName() {
  let nameRegx = "^([a-zA-z0-9]){3,15}$";
  if (!username.value.match(nameRegx)) {
    username.classList.add("wrong");
    return false;
  } else {
    username.classList.remove("wrong");
    return true;
  }
}

function checkEmail() {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.value.match(emailRegex)) {
    email.classList.add("wrong");
    return false;
  } else {
    email.classList.remove("wrong");
    return true;
  }
}

function checkPassStrength() {
  let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
  if (!password.value.match(strongRegex)) {
    password.classList.add("wrong");
    return false;
  } else {
    password.classList.remove("wrong");
    return true;
  }
}

function checkConfirmPass() {
  if (confirmPass.value !== password.value) {
    confirmPass.classList.add("wrong");
    return false;
  } else {
    confirmPass.classList.remove("wrong");
    return true;
  }
}

signBtn.addEventListener("click", signUp);

async function signUp(e) {
  e.preventDefault();
  if (checkName() & checkEmail() & checkPassStrength() & checkConfirmPass()) {
    this.disabled = true;
    this.classList.add("disabled");
    const data = {};
    data.username = username.value;
    data.email = email.value;
    data.password = password.value;
    const res = await fetch("/sign-Up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      window.location = "/";
    } else {
      errMSg.classList.add("err-msg");
      this.disabled = false;
      this.classList.remove("disabled");
      setTimeout(() => {
        errMSg.classList.remove("err-msg");
      }, 5000);
    }
  }
}
