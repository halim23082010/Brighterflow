<?php
// الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_registration";

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

// استعلام للتحقق من وجود المستخدم في قاعدة البيانات
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// التحقق من البيانات المدخلة
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // التحقق من كلمة المرور (كلمة المرور يجب أن تكون مشفرة)
    if (password_verify($password, $row['password'])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false]);
}

$stmt->close();
$conn->close();
?>

