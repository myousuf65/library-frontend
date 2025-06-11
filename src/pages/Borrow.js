import * as faceapi from "face-api.js";
import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, CircularProgress, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Borrow() {
  let FACE_API = process.env.REACT_APP_FACE_BACKEND;
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgCanvasRef = useRef(null);
  const videoWidth = 640;
  const videoHeight = 480;
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // "success", "error", "loading"
  const navigate = useNavigate();

  // Load models once
  useEffect(() => {
    console.log("face api", FACE_API);
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
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
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    if (modelsLoaded && !captureVideo) {
      startVideo();
    }
  }, [modelsLoaded]);

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
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    };
    interval = setInterval(runDetection, 100);
    return () => clearInterval(interval);
  }, [modelsLoaded, captureVideo]);

  const handleTakePhoto = async () => {
    const video = videoRef.current;
    const imgcanvas = imgCanvasRef.current;
    const displaySize = { width: videoWidth, height: videoHeight };

    if (!video || !imgcanvas) return;

    // Set canvas size and draw video frame
    imgcanvas.width = displaySize.width;
    imgcanvas.height = displaySize.height;
    const ctx = imgcanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, displaySize.width, displaySize.height);

    // Convert canvas to Blob
    imgcanvas.toBlob(
      async (blob) => {
        if (!(blob instanceof Blob)) {
          alert("Failed to create image blob.");
          return;
        }

        const imageURL = URL.createObjectURL(blob);
        const img = new window.Image();
        img.src = imageURL;
        await new Promise((resolve) => (img.onload = resolve));
        const detections = await faceapi
          .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections.length === 0) {
          setModalType("error");
          setModalMessage("Could not detect a human in the image.");
          setModalOpen(true);
          return;
        }

        const formData = new FormData();
        formData.append("image", blob, "photo.jpeg");

        setLoading(true);
        setModalOpen(true);
        setModalType("loading");
        setModalMessage("Processing, please wait...");

        fetch(`${FACE_API}/match/compare/`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setLoading(false);
            setModalType("success");
            setModalMessage(`Student ID: ${data['matched']}`);
            sessionStorage.setItem("borrow", data["matched"]);
          })
          .catch((err) => {
            setLoading(false);
            setModalType("error");
            setModalMessage(`Error: ${err.message}`);
          });
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <Box className="page-container">
      <h1 style={{ textAlign: "center" }}>Borrow Books</h1>
      <Paper
        elevation={3}
        sx={{ maxWidth: 700, mx: "auto", p: 4, borderRadius: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {captureVideo ? (
            modelsLoaded ? (
              <>
                <Box
                  sx={{
                    position: "relative",
                    width: videoWidth,
                    height: videoHeight,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width={videoWidth}
                    height={videoHeight}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      borderRadius: 8,
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    width={videoWidth}
                    height={videoHeight}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      pointerEvents: "none",
                      borderRadius: 8,
                    }}
                  />
                  <canvas ref={imgCanvasRef} style={{ display: "none" }} />
                </Box>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleTakePhoto}
                  disabled={!modelsLoaded || !captureVideo}
                >
                  Take Photo
                </Button>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Loading models...
              </Typography>
            )
          ) : null}
        </Box>
      </Paper>
      <Dialog open={modalOpen} onClose={() => { if (!loading) setModalOpen(false); }}>
        <DialogTitle>
          {modalType === "loading" && "Loading"}
          {modalType === "success" && "Success"}
          {modalType === "error" && "Error"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          {modalType === "loading" && <CircularProgress />}
          <Typography>
            {modalMessage}
          </Typography>
          {modalType === "success" && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate("/admin/scan")}
            >
              Start Borrowing
            </Button>
          )}
        </DialogContent>
        {modalType !== "loading" && (
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}

export default Borrow;
