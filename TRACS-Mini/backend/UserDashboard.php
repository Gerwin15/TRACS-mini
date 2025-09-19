<?php
// UserDashboard.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ---------- DB CONNECTION ----------
$host = "localhost";    // localhost
$user = "root";         // your DB user
$pass = "";             // your DB password
$db   = "retsej_ui";    // your DB name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed"]);
  exit();
}

// ---------- MAIN HANDLER ----------
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'GET':
    // fetch all users
    $result = $conn->query("SELECT id, name AS username, email, status, created_at FROM users ORDER BY id DESC");
    $users = [];
    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }
    echo json_encode($users);
    break;

  case 'POST':
    // create new user (with hashed password)
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['password']) || !isset($data['status'])) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid request"]);
      exit();
    }

    $name   = $conn->real_escape_string($data['name']);
    $email  = $conn->real_escape_string($data['email']);
    $status = $conn->real_escape_string($data['status']);
    $pass   = password_hash($data['password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $pass, $status);

    if ($stmt->execute()) {
      echo json_encode([
        "id" => $stmt->insert_id,
        "username" => $name,   // ✅ standardized
        "email" => $email,
        "status" => $status
      ]);
    } else {
      http_response_code(500);
      echo json_encode(["error" => "Failed to insert user"]);
    }
    break;

  case 'PUT':
    // update user (including status)
    parse_str($_SERVER['QUERY_STRING'], $qs);
    $id = $qs['id'] ?? null;

    if (!$id) {
      http_response_code(400);
      echo json_encode(["error" => "Missing ID"]);
      exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['status'])) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid request"]);
      exit();
    }

    $name   = $conn->real_escape_string($data['name']);
    $email  = $conn->real_escape_string($data['email']);
    $status = $conn->real_escape_string($data['status']);

    if (isset($data['password']) && !empty($data['password'])) {
      $pass = password_hash($data['password'], PASSWORD_BCRYPT);
      $stmt = $conn->prepare("UPDATE users SET name=?, email=?, password=?, status=? WHERE id=?");
      $stmt->bind_param("ssssi", $name, $email, $pass, $status, $id);
    } else {
      $stmt = $conn->prepare("UPDATE users SET name=?, email=?, status=? WHERE id=?");
      $stmt->bind_param("sssi", $name, $email, $status, $id);
    }

    if ($stmt->execute()) {
      echo json_encode([
        "id" => $id,
        "username" => $name,   // ✅ standardized
        "email" => $email,
        "status" => $status
      ]);
    } else {
      http_response_code(500);
      echo json_encode(["error" => "Failed to update user"]);
    }
    break;

  case 'DELETE':
    // delete user
    parse_str($_SERVER['QUERY_STRING'], $qs);
    $id = $qs['id'] ?? null;

    if (!$id) {
      http_response_code(400);
      echo json_encode(["error" => "Missing ID"]);
      exit();
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      echo json_encode(["status" => "deleted", "id" => $id]);
    } else {
      http_response_code(500);
      echo json_encode(["error" => "Failed to delete user"]);
    }
    break;

  default:
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    break;
}

$conn->close();
