const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPass = document.getElementById("confirm-password");
const signBtn = document.getElementById("sign-btn");

if (username) username.addEventListener("input", checkName);
if (email) email.addEventListener("input", checkEmail);
if (password) password.addEventListener("input", checkPassStrength);
if (confirmPass) confirmPass.addEventListener("input", checkConfirmPass);
if(signBtn) signBtn.addEventListener('clicl', signUp)
function checkName() {
  let nameRegx = "^([a-zA-z0-9]){3,15}$";
  if (!this.value.match(nameRegx)) {
    this.classList.add("wrong");
    return false;
  } else {
    this.classList.remove("wrong");
    return true;
  }
}

function checkEmail() {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!this.value.match(emailRegex)) {
    this.classList.add("wrong");
    return false;
  } else {
    this.classList.remove("wrong");
    return true;
  }
}

function checkPassStrength() {
  let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
  if (!this.value.match(strongRegex)) {
    this.classList.add("wrong");
    return false;
  } else {
    this.classList.remove("wrong");
    return true;
  }
}

function checkConfirmPass() {
  if (this.value !== password.value) {
    this.classList.add("wrong");
    return false;
  } else {
    this.classList.remove("wrong");
    return true;
  }
}

function signUp(){
    
}
