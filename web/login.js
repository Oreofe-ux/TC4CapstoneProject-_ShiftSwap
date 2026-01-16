const password=document.getElementById('password');
const toggleEye=document.getElementById('toggleEye');

toggleEye.addEventListener('click', () => {
    if(password.type==="password"){
        password.type = "text";
        toggleEye.src="./assets/humbleicons--eye-close.svg";
    }
    else{
        password.type = "password";
        toggleEye.src = "./assets/fluent--eye-20-filled.svg ";
    }
});