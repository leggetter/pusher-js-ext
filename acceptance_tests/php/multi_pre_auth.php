<?php
include 'libs/squeeks-Pusher-PHP/lib/Pusher.php';
include 'config.php';

$body = file_get_contents('php://input');
$auth_request = json_decode($body);

$socket_id = $auth_request->socket_id;
$channels = $auth_request->channels;

$pusher = new Pusher(APP_KEY, APP_SECRET, APP_ID);

$authed_channels = get_auth_data($pusher, $socket_id, $channels);

header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');
$json = json_encode($authed_channels);
echo($json);

/*** helper functions ***/
function get_auth_data($pusher, $socket_id, $channels) {
  $authed_channels = array();
  $auth_data = null;
  foreach ($channels as $channel_name) {
    if( strrpos($channel_name, 'private-') === 0 ) {
      $auth_data = $pusher->socket_auth($channel_name, $socket_id);
    }
    else if( strrpos($channel_name, 'presence-') === 0 ) {
      $presence_data = get_presence_data($channel_name);
      $user_id = get_user_id($channel_name);
      $auth_data = $pusher->presence_auth($channel_name, $socket_id, $user_id, $presence_data);
    }
    
    $authed_channels[$channel_name] = $auth_data;
  }
  return $authed_channels;
}

function get_presence_data($channel_name) {
  return array();
}

function get_user_id($channel_name) {
  return microtime();
}
?>