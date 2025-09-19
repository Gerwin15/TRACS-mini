<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection
$host = "localhost";
$user = "root";   // change if needed
$pass = "";       // change if needed
$db   = "retsej_ui"; // your DB name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB Connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);

$email    = $data["email"] ?? "";
$password = $data["password"] ?? "";

// Validate
if (!$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit;
}

// Check user
$stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // ✅ use password_verify since password is hashed
    if (password_verify($password, $row["password"])) {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id" => $row["id"],
                "name" => $row["name"], // 🔑 use 'name' since DB column is 'name'
                "email" => $email
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}

$conn->close();
?>
