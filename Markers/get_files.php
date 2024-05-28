<?php
$directory = __DIR__;
if ($handle = opendir($directory)) {
    $files = [];
    while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != "..") {
            $files[] = $file;
        }
    }
    closedir($handle);
    echo json_encode($files);
}
?>
