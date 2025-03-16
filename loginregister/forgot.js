document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('new_password');
    const confirmInput = document.getElementById('confirm_password');
    const errorMsg = document.getElementById('error-message');
    const resetButton = document.getElementById('resetButton');

    function validatePasswords() {
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();

        let errors = [];

        if (password.length < 8) {
            errors.push("كلمة المرور يجب أن تكون 8 أحرف أو أكثر");
        }

        if (!/[a-zA-Z]/.test(password)) {
            errors.push("يجب أن تحتوي على حرف واحد على الأقل");
        }

        if (!/\d/.test(password)) {
            errors.push("يجب أن تحتوي على رقم واحد على الأقل");
        }

        if (password !== confirmPassword) {
            errors.push("كلمتا المرور غير متطابقتين");
        }

        if (errors.length > 0) {
            errorMsg.innerHTML = errors.join("<br>");
            resetButton.disabled = true;
        } else {
            errorMsg.innerHTML = "";
            resetButton.disabled = false;
        }

        console.log(errors);
    }

    passwordInput.addEventListener('input', validatePasswords);
    confirmInput.addEventListener('input', validatePasswords);
});

