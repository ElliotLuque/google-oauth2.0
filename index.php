<?php
require_once __DIR__ . "/vendor/autoload.php";

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

session_start();

$client = new Google\Client();
$client->setClientId($_ENV["CLIENT_ID"]);
$client->setClientSecret($_ENV["CLIENT_SECRET"]);
$client->setRedirectUri($_ENV["CALLBACK_URL"]);
$client->addScope(Google\Service\Oauth2::USERINFO_PROFILE);
$client->addScope(Google\Service\Oauth2::USERINFO_EMAIL);

$allowed_origins = [
    "http://localhost:5555",
    "http://127.0.0.1:5555",
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

function getUserInfo($client) {
    $oauth2 = new Google\Service\Oauth2($client);
    return $oauth2->userinfo->get();
}

$request = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

switch ($request) {
    case "/auth/login":
        $authUrl = $client->createAuthUrl();
        header("Location: $authUrl");
        exit;
        break;

    case "/auth/logout":
        if (isset($_SESSION["access_token"])) {
            $client->setAccessToken($_SESSION["access_token"]);
            $client->revokeToken();
            unset($_SESSION["access_token"]);
        }
        session_destroy();
        header("Content-Type: application/json");
        echo json_encode(["message" => "Logged out"]);
        break;

    case "/auth/status":
        // User is logged in
        if (isset($_SESSION["access_token"])) {
            $client->setAccessToken($_SESSION["access_token"]);
            $user = getUserInfo($client);
            header("Content-Type: application/json");
            echo json_encode([
                "loggedIn" => true,
                "user" => [
                    "name" => $user->name,
                    "email" => $user->email,
                    "photo" => $user->picture
                ]
            ]);
        // User is logged out
        } else {
            header("Content-Type: application/json");
            echo json_encode([
                "loggedIn" => false,
                "message" => "Not logged in."
            ]);
        }
        break;

    case "/oauth2callback":
        if (isset($_GET["code"])) {
            $token = $client->fetchAccessTokenWithAuthCode($_GET["code"]);
            $_SESSION["access_token"] = $token;

            // Redirect to client
            $client_url = $_ENV["CLIENT_URL"];
            header("Location: $client_url");
            exit;
        }
        break;

    default:
        header("HTTP/1.0 404 Not Found");
        echo "404 Not Found";
        break;
}
