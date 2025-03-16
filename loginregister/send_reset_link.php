<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:\xampp\htdocs\BrightFlowfolder\loginregister\src\Exception.php';
require 'C:\xampp\htdocs\BrightFlowfolder\loginregister\src\PHPMailer.php';
require 'C:\xampp\htdocs\BrightFlowfolder\loginregister\src\SMTP.php';

// 🔧 اضبط توقيت PHP عشان يكون مطابق لقاعدة البيانات
date_default_timezone_set('Europe/Istanbul'); // أو التوقيت المناسب لك

// الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_registration";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// التحقق من البريد الإلكتروني المرسل
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    // التحقق من وجود البريد الإلكتروني في قاعدة البيانات
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $token = bin2hex(random_bytes(50)); // توكن جديد
        $expiry_time = date('Y-m-d H:i:s', strtotime('+1 hour')); // ساعة من الآن
        
        echo "PHP NOW Time: " . date('Y-m-d H:i:s') . "<br>"; // Debug time
        echo "Expiry Time: " . $expiry_time . "<br>";

        // تحديث التوكن ووقت انتهاء الصلاحية
        $updateSql = "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("sss", $token, $expiry_time, $email);
        $updateStmt->execute();

        // إرسال الإيميل
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // يمكنك تغيير الخادم هنا إذا كنت تستخدم مزود خدمة آخر
            $mail->SMTPAuth   = true;
            $mail->Username   = 'abdulhalimabdulbaki23.08@gmail.com'; // البريد الإلكتروني المرسل
            $mail->Password   = 'wpzq miia raro kvwo'; // كلمة مرور التطبيق
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // إضافة الرد عند الرد على الرسالة
            $mail->addReplyTo('abdulhalimabdulbaki23.08@gmail.com', 'BrightFlow'); // بريد الرد

            // تعيين المرسل والمستلم
            $mail->setFrom('abdulhalimabdulbaki23.08@gmail.com', 'BrightFlow');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Reset your password';
            $mail->Body    = "Click the link to reset your password:<br><a href='http://localhost/BrightFlowfolder/loginregister/reset_password.php?token=$token'>Reset Password</a>";

            $mail->send();
            echo 'Reset link sent successfully!';
        } catch (Exception $e) {
            echo "Failed to send email: {$mail->ErrorInfo}";
        }
    } else {
        echo "This email is not registered in the database.";
    }
}

$conn->close();
?>




