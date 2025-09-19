<?php
// LoginForm.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ---------- DB CONNECTION ----------
$host = "localhost";
$user = "root";   // adjust if needed
$pass = "";
$db   = "retsej_ui";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "DB connection failed"]);
  exit();
}

// ---------- LOGIN ----------
$data = json_decode(file_get_contents("php://input"), true);

$email    = $conn->real_escape_string($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
  http_response_code(400);
  echo json_encode([
    "status" => "error",
    "message" => "Missing email or password"
  ]);
  exit();
}

$stmt = $conn->prepare("SELECT id, name, email, password, status, created_at 
                        FROM users 
                        WHERE email=? 
                        LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
  // Check if user is active
  if ($user['status'] !== 'active') {
    echo json_encode([
      "status" => "error",
      "message" => "Your account is inactive. Please contact the administrator."
    ]);
    exit();
  }

  // Validate password
  if (password_verify($password, $user['password'])) {
    unset($user['password']); // never expose hash

    echo json_encode([
      "status" => "success",
      "message" => "Login successful",
      "user" => [
        "id" => $user['id'],
        "username" => $user['name'],
        "email" => $user['email'],
        "status" => $user['status'],
        "createdAt" => $user['created_at']
      ]
    ]);
  } else {
    echo json_encode([
      "status" => "error",
      "message" => "Invalid email or password"
    ]);
  }
} else {
  echo json_encode([
    "status" => "error",
    "message" => "User not found"
  ]);
}

$stmt->close();
$conn->close();
