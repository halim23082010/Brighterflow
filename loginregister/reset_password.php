<?php
// الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_registration";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// التحقق من وجود التوكن
if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // البحث عن المستخدم بالتوكن والتحقق من انتهاء الصلاحية
    $sql = "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        die("Token expired or invalid.");
    }

    // إذا تم إرسال POST لتحديث كلمة المرور
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $new_password = $_POST['new_password'];
        $confirm_password = $_POST['confirm_password'];

        // تحقق إضافي على السيرفر
        if ($new_password !== $confirm_password) {
            echo "كلمات المرور غير متطابقة.";
            exit();
        }

        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d).{8,}$/', $new_password)) {
            echo "كلمة المرور غير مستوفية للشروط.";
            exit();
        }

        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // تحديث كلمة المرور
        $updateSql = "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("ss", $hashed_password, $token);

        if ($updateStmt->execute()) {
            echo "password updated successfully! 1";
        } else {
            echo "حدث خطأ أثناء تحديث كلمة المرور. 1";
        }

        exit();
    }
} else {
    die("Invalid token.");
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور</title>
    <link rel="stylesheet" href="logreg.css">
</head>
<body>
    <div class="container2">
        <h1>إعادة تعيين كلمة المرور</h1>
        <form id="resetForm" method="POST" action="">
            <div class="input-group">
                <i class="fas fa-lock"></i>
                <input type="password" id="new_password" name="new_password" placeholder="كلمة المرور الجديدة" required>
            </div>

            <div class="input-group">
            <i class="fas fa-lock"></i>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                <div id="error-message" class="error-message"></div>
            </div>

            <input type="submit" id="resetButton" class="btn" ></input>
        </form>
    </div>

    
<script> document.addEventListener('DOMContentLoaded', function() {
            const passwordInput = document.getElementById('new_password');
            const confirmInput = document.getElementById('confirm_password');
            const errorMsg = document.getElementById('error-message');
            const resetButton = document.getElementById('resetButton');

            // دالة لفحص كلمة المرور
            function validatePasswords() {
                const password = passwordInput.value.trim();
                const confirmPassword = confirmInput.value.trim();

                // شرط واحد فقط يظهر في الرسالة
                let errorMessage = '';

                // شروط كلمة المرور
                if (confirmPassword !== '') {  // يتحقق فقط لو بدأ يكتب في الحقل الثاني
                    if (password.length < 8) {
                        errorMessage = "كلمة المرور يجب أن تكون 8 أحرف أو أكثر";
                    } else if (!/[a-zA-Z]/.test(password)) {
                        errorMessage = "يجب أن تحتوي على حرف واحد على الأقل";
                    } else if (!/\d/.test(password)) {
                        errorMessage = "يجب أن تحتوي على رقم واحد على الأقل";       
                    } else if (password !== confirmPassword) {
                        errorMessage = "كلمتا المرور غير متطابقتين";
                    }
                }

                // عرض الرسالة لو كان فيه خطأ في الحقل الثاني
                if (errorMessage !== '') {
                    errorMsg.innerHTML = errorMessage;
                    resetButton.disabled = true;  // تعطيل الزر إذا كانت هناك أخطاء
                } else {
                    errorMsg.innerHTML = '';
                    // تفعيل الزر إذا كانت الحقول مملوءة بشكل صحيح
                    if (password !== '' && confirmPassword !== '') {
                        resetButton.disabled = false;  // تفعيل الزر فقط إذا كانت الحقول مملوءة بشكل صحيح
                    }
                }
                console.log(errorMessage); // اضغط للديباج
            }

            // الأحداث على الحقلين
            passwordInput.addEventListener('input', validatePasswords);
            confirmInput.addEventListener('input', validatePasswords);
        });</script>

</body>

</html>



