document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // إيقاف الإرسال الافتراضي للنموذج

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordErrorMessage = document.getElementById("passwordErrorMessage");

    // إعادة تعيين الرسائل السابقة (إن وجدت)
    passwordErrorMessage.textContent = "";

    // التحقق من أن البريد الإلكتروني يحتوي على صيغة صحيحة
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // التحقق من أن كلمة المرور ليست فارغة
    if (password.trim() === "") {
        passwordErrorMessage.textContent = "Please enter a password.";
        passwordErrorMessage.style.color = "red";
        return;
    }

    // إرسال البيانات إلى PHP للتحقق منها
    fetch("login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
            window.location.href = "reister.html"; // مثال
        } else {
            passwordErrorMessage.textContent = "The email or password is incorrect.";
            passwordErrorMessage.style.color = "red";
            passwordErrorMessage.style.fontSize = "14px";
        }
    })
    .catch(error => {
        console.error("حدث خطأ:", error);
        passwordErrorMessage.textContent = "An error occurred while trying to log in.";
        passwordErrorMessage.style.color = "red";
    });
});









