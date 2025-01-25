// Select elements
const videoUpload = document.getElementById("video-upload");
const audioUpload = document.getElementById("audio-upload");
const videoName = document.getElementById("video-name");
const audioName = document.getElementById("audio-name");
const submitButton = document.getElementById("submit-button");

// Display uploaded file names
videoUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type !== "video/mp4") {
    alert("Please upload a valid MP4 video file!");
    videoUpload.value = "";
    videoName.textContent = "No file selected";
    return;
  }
  videoName.textContent = `Video Uploaded: ${file?.name || "No file selected"}`;
});

audioUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type !== "audio/mpeg") {
    alert("Please upload a valid MP3 audio file!");
    audioUpload.value = "";
    audioName.textContent = "No file selected";
    return;
  }
  audioName.textContent = `Audio Uploaded: ${file?.name || "No file selected"}`;
});

submitButton.addEventListener("click", () => {
  const videoFile = videoUpload.files[0];
  const audioFile = audioUpload.files[0];
  if (!videoFile) {
    alert("Please upload a video file!");
    return;
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  if (audioFile) formData.append("audio", audioFile);

  submitButton.textContent = "Processing...";
  submitButton.disabled = true;

  fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      console.log("Server Response:", data);
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
      console.error("Error:", error);
    })
    .finally(() => {
      submitButton.textContent = "Submit";
      submitButton.disabled = false;
    });
});
