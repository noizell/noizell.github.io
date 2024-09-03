// Function to handle fullscreen requests
function requestFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Function to notify resolution change and send aspect ratio to Unity
function notifyResolutionChange() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;

    var data = {
        Width: width,
        Height: height,
        AspectRatio: aspectRatio
    };
    
    var jsonString = JSON.stringify(data);
    if (window.unityInstance) {
        unityInstance.SendMessage('JS_CALLBACK', 'OnResolutionChange', jsonString);
    }
}

// Debounced version of the notifyResolutionChange function
var debouncedNotifyResolutionChange = debounce(notifyResolutionChange, 250);

// Handle events
window.addEventListener('resize', debouncedNotifyResolutionChange);
window.addEventListener('load', notifyResolutionChange);

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");
var landscapeWarning = document.querySelector("#landscape-warning");
var orientationOverlay = document.querySelector("#orientation-overlay");

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

// Enforce landscape orientation on mobile devices
function enforceLandscape() {
    if (window.innerHeight > window.innerWidth) {
        orientationOverlay.style.display = 'flex';
    } else {
        orientationOverlay.style.display = 'none';
    }
}

window.addEventListener('resize', enforceLandscape);
window.addEventListener('load', enforceLandscape);

var mode = "";
var buildUrl = "Build";
var loaderUrl = `${buildUrl}/driving-sim${mode}.loader.js`;
var config = {
    dataUrl: `${buildUrl}/driving-sim${mode}.data`,
    frameworkUrl: `${buildUrl}/driving-sim${mode}.framework.js`,
    codeUrl: `${buildUrl}/driving-sim${mode}.wasm`,
    symbolsUrl: `${buildUrl}/driving-sim${mode}.symbols.json`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Satriver Studio",
    productName: "Driving Sim",
    productVersion: "0.0.1",
    showBanner: unityShowBanner,
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = "unity-mobile";
    // Avoid draining fillrate performance on mobile devices,
    // and default/override low DPI mode on mobile browsers.
    config.devicePixelRatio = 1;
} else {
    canvas.style.width = "1366px";
    canvas.style.height = "768px";
}
loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((unityInstance) => {
        loadingBar.style.display = "none";
        window.unityInstance = unityInstance;
        fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
        };
    }).catch((message) => {
        alert(message);
    });
};
document.body.appendChild(script);