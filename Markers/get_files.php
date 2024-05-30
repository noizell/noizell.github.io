<?php
header('Content-Type: application/json');

// Get the current directory
$directory = __DIR__;
$files = array();

// Open the directory
if ($handle = opendir($directory)) {
    // Loop through the directory contents
    while (false !== ($file = readdir($handle))) {
        // Exclude the current directory and parent directory links
        if ($file != "." && $file != "..") {
            $files[] = $file;
        }
    }
    // Close the directory handle
    closedir($handle);
} else {
    // Handle the error if the directory cannot be opened
    echo json_encode(array("error" => "Unable to open directory"));
    exit;
}

// Output the file list as a JSON array
echo json_encode($files);
?>
