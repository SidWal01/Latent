// Select elements
const videoUpload = document.getElementById("video-upload");
const audioUpload = document.getElementById("audio-upload");
const videoName = document.getElementById("video-name");
const audioName = document.getElementById("audio-name");

// Display uploaded file names
videoUpload.addEventListener("change", (event) => {
  const fileName = event.target.files[0]?.name || "No file selected";
  videoName.textContent = `Video Uploaded: ${fileName}`;
});

audioUpload.addEventListener("change", (event) => {
  const fileName = event.target.files[0]?.name || "No file selected";
  audioName.textContent = `Audio Uploaded: ${fileName}`;
});

// Submit button functionality
document.getElementById("submit-button").addEventListener("click", () => {
  if (videoUpload.files.length === 0) {
    alert("Please upload video file.");
  } else {
    alert("Your entry has been submitted successfully!");
    // Future: Send the files to the backend here
  }
});
