import * as faceapi from 'face-api.js';
import React, { useRef, useEffect, useState } from 'react';

function Borrow() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoWidth = 640;
  const videoHeight = 480;

  // Load models once
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // Start/stop video stream
  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: videoWidth, height: videoHeight } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        console.error('error:', err);
      });
  };

  const closeWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.pause();
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCaptureVideo(false);
  };

  // Detection loop
  useEffect(() => {
    if (!modelsLoaded || !captureVideo) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    let interval;
    const runDetection = async () => {
      if (video.paused || video.ended) return;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    };
    interval = setInterval(runDetection, 100);
    return () => clearInterval(interval);
  }, [modelsLoaded, captureVideo]);

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: 'pointer',
              backgroundColor: 'green',
              color: 'white',
              padding: '15px',
              fontSize: '25px',
              border: 'none',
              borderRadius: '10px',
            }}
          >
            Close Webcam
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: 'pointer',
              backgroundColor: 'green',
              color: 'white',
              padding: '15px',
              fontSize: '25px',
              border: 'none',
              borderRadius: '10px',
            }}
          >
            Open Webcam
          </button>
        )}
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <div style={{ position: 'relative', width: videoWidth, height: videoHeight, margin: '0 auto' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              width={videoWidth}
              height={videoHeight}
              style={{ position: 'absolute', top: 0, left: 0, borderRadius: '10px' }}
            />
            <canvas
              ref={canvasRef}
              width={videoWidth}
              height={videoHeight}
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            />
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : null}
    </div>
  );
}

export default Borrow;
