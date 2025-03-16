<?php
// ****** الاتصال بقاعدة البيانات ******
$servername = "localhost";
$username = "root";       // اسم المستخدم الافتراضي لـ XAMPP/MAMP
$password = "";           // عادةً فاضي
$dbname = "user_registration"; // اسم قاعدة البيانات اللي عملناها

// الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
}

// ****** معالجة البيانات القادمة من الفورم ******
// تأكد أن الطلب قادم بطريقة POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // عرض البيانات المرسلة من النموذج باستخدام var_dump
    echo '<pre>';
    var_dump($_POST);
    echo '</pre>';

    // استقبال البيانات من الفورم
    $fname   = trim($_POST['fname']);
    $lname   = trim($_POST['lname']);
    $email   = trim($_POST['email']);
    $date    = $_POST['date'];
    $password = $_POST['password'];
    $repeatPassword = $_POST['password_repeat'];

    $country = $_POST['country'];
    $state   = $_POST['state'];
    $city    = $_POST['city'];
    $adress = $_POST['adress'];

    // ****** تحقق أساسي ******
    if (empty($fname) || empty($lname) || empty($email) || empty($date) || empty($password) || empty($repeatPassword) || empty($country) || empty($state) || empty($city) || empty($adress)) {
        echo "tum alanlari doldurulmali!";
        exit;
    }

    // تحقق من الإيميل (Gmail فقط)
    if (!preg_match("/^[a-zA-Z0-9._%+-]+@gmail\.com$/", $email)) {
        echo "❌ doğru Gmail adresi giriniz!";
        exit;
    }

    // تحقق من قوة الباسورد
    if (strlen($password) < 8 || !preg_match('/[a-zA-Z]/', $password) || !preg_match('/\d/', $password)) {
        echo "❌ Şifre en az 8 karakter olmalı, en az bir harf ve bir rakam içermeli!";
        exit;
    }

    // تحقق من تطابق الباسورد
    if ($password !== $repeatPassword) {
        echo "❌ Şifreler uyuşmuyor!";
        exit;
    }

    // ****** تشفير الباسورد ******
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // ****** استعلام الإدخال ******
    $sql = "INSERT INTO users (first_name, last_name, email, birth_date, password, country, state, city, adress)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

// تجهيز الاستعلام لتجنب الـ SQL Injection
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssss", $fname, $lname, $email, $date, $hashedPassword, $country, $state, $city, $adress);

    // تنفيذ الإدخال
    if ($stmt->execute()) {
        echo "✅ Kullanıcı başarıyla kaydedildi! 🎉";
    } else {
        echo "❌ Başarısız oldu: " . $stmt->error;
    }

    // إغلاق الاتصال
    $stmt->close();
    $conn->close();

} else {
    echo "❌ İsteğin hatalı!";
}
?>



