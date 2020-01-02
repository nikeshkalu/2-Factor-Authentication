// (function() {
//     var video = document.getElementById('video'),
//         vendorUrl = window.URL || window.webkitURL;

//     navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

//     navigator.getMedia({
//         video: true,
//         audio: false
//     }, function(stream) {
//         video.src = vendorUrl.createObjectURL(stream);
//         video.onplay();
//     }, function(error) {
//         //error code
//         console.log("Error Occured");
//     })
// })();


const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capturebutton');

function convertToImageData(canvas) {
    return canvas.toDataURL('image/png');
};

const constraints = {
    video: true,
};

function capButton() {
    captureButton.addEventListener('click', () => {
        // Draw the video frame to the canvas.
        context.drawImage(player, 0, 0, canvas.width, canvas.height);
    });

    var data = convertToImageData(canvas);
    console.log(data);
    // alert(data);
    document.getElementById('fileInput').value = data;
};


// Attach the video stream to the video element and autoplay.
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
})