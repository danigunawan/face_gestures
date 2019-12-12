const video = document.querySelector("#video-webcam");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models')
]).then(startVideo);

function startVideo(){
    navigator.getUserMedia(
        {video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

video.addEventListener('play',()=>{
    setInterval(async()=>{
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        if(detections[0] == undefined){
            console.log("No Face Found");
        }else{
            var yLeft = (detections[0].landmarks.relativePositions[36].y - detections[0].landmarks.relativePositions[18].y);
            var xLeft = (detections[0].landmarks.relativePositions[36].x - detections[0].landmarks.relativePositions[18].x);
            var distLeft =  Math.pow((Math.pow(xLeft,2) + Math.pow(yLeft,2)),0.5);
            var yRight = (detections[0].landmarks.relativePositions[45].y - detections[0].landmarks.relativePositions[25].y);
            var xRight = (detections[0].landmarks.relativePositions[45].x - detections[0].landmarks.relativePositions[25].x);
            var distRight =  Math.pow((Math.pow(xRight,2) + Math.pow(yRight,2)),0.5);
            var yMouth = (detections[0].landmarks.relativePositions[63].y - detections[0].landmarks.relativePositions[67].y);
            var xMouth = (detections[0].landmarks.relativePositions[63].x - detections[0].landmarks.relativePositions[67].x);
            var distMouth =  Math.pow((Math.pow(xMouth,2) + Math.pow(yMouth,2)),0.5);
            var yNose = (detections[0].landmarks.relativePositions[35].y - detections[0].landmarks.relativePositions[31].y);
            var xNose = (detections[0].landmarks.relativePositions[35].x - detections[0].landmarks.relativePositions[31].x);
            var distNose =  Math.pow((Math.pow(xNose,2) + Math.pow(yNose,2)),0.5);
            var stdDist = 10*distNose;
            var l = (10000*distLeft)/stdDist;
            var r = (10000*distRight)/stdDist;
            var m = (10000*distMouth)/stdDist;
            var d = l-r;

            if(m>800){
                console.log("Forward");
                document.querySelector("#display-text").innerHTML = "<h1>Forward</h1>"
            }else if(d<-150){
                console.log("Right");
                document.querySelector("#display-text").innerHTML = "<h1>Right</h1>"
            }else if(d<-50){
                console.log("Stop");
                document.querySelector("#display-text").innerHTML = "<h1>Stop</h1>"
            }else{
                console.log("Left");
                document.querySelector("#display-text").innerHTML = "<h1>Left</h1>"
            }

            var ratio = (detections[0].landmarks.relativePositions[36].y - detections[0].landmarks.relativePositions[18].y) - (detections[0].landmarks.relativePositions[45].y - detections[0].landmarks.relativePositions[25].y);

        }

    },200);
});