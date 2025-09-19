<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// DB connection
$host = "localhost";
$user = "root";  // adjust if needed
$pass = "";
$db   = "retsej_ui";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$id       = $data["id"] ?? null; // if present → edit mode
$username = $data["username"] ?? "";
$email    = $data["email"] ?? "";
$password = $data["password"] ?? null;
$status   = $data["status"] ?? "active";

if (!$username || !$email) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

if ($id) {
    // =============================
    // Edit existing user
    // =============================
    if ($password) {
        // Update including password
        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE users SET name=?, email=?, password=?, status=? WHERE id=?");
        $stmt->bind_param("ssssi", $username, $email, $hashed, $status, $id);
    } else {
        // Update without password
        $stmt = $conn->prepare("UPDATE users SET name=?, email=?, status=? WHERE id=?");
        $stmt->bind_param("sssi", $username, $email, $status, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    }

    $stmt->close();
} else {
    // =============================
    // Add new user (password required)
    // =============================
    if (!$password) {
        echo json_encode(["status" => "error", "message" => "Password required for new user"]);
        exit;
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $hashed, $status);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email already exists or insert failed"]);
    }

    $stmt->close();
}

$conn->close();
?>
