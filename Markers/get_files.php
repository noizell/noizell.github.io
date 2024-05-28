<?php
// Get the current directory
$directory = __DIR__;

// Open the directory
if ($handle = opendir($directory)) {
    // Loop through the directory contents
    while (false !== ($file = readdir($handle))) {
        // Skip the . and .. special directories
        if ($file != "." && $file != "..") {
            echo $file . "\n";
        }
    }
    // Close the directory handle
    closedir($handle);
}
?>
