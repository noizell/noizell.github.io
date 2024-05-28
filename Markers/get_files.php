<?php
header('Content-Type: application/json');
$directory = __DIR__;
$files = array();

if ($handle = opendir($directory)) {
    while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != "..") {
            $files[] = $file;
        }
    }
    closedir($handle);
}
echo json_encode($files);
?>
