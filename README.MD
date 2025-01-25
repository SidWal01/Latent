🎬 THE VIRTUAL LATENT SHOW
🚀 Overview
This project provides a backend service for analyzing video files by extracting audio and captions, combining them into a single text file, and offering APIs for interaction. It’s a fun and engaging project designed to simulate a chat experience with judges who ask questions and give roasts based on user responses!

🛠️ Features
Extract Audio and Captions from Video

Audio Extraction: Uses FFmpeg to extract audio from video.mp4 and converts it into text (audio.txt) using a speech-to-text API.
Captions Extraction: Extracts captions (captions.srt) from video.mp4 and converts them into plain text (captions.txt).
Combine Audio and Captions

Combines the extracted audio.txt and captions.txt into a single file, file.txt.
APIs for Interaction

/get-combined-text: Combines audio.txt and captions.txt into file.txt and returns the combined text.
/ask-question: Simulates fetching a judge's question based on the combined text.
/get-roast: Generates a fun roast based on the user's answer.
Engaging Chat Interface

Judges ask users questions based on their video content, and users reply in a chat-like interface.
Each judge has unique personalities, avatars, and witty responses!
Inspired by:- Samay Raina - India's Got Latent Show ...
🧰 Prerequisites
Node.js installed on your machine.
FFmpeg installed and added to your system’s PATH.
Any speech-to-text library or API integration (e.g., Google Speech-to-Text, Whisper).
📂 File Structure
css
Copy
Edit
backend/
│
├── video_analysis_output/
│   ├── video.mp4            # Input video file
│   ├── audio.wav            # Extracted audio from video
│   ├── audio.txt            # Converted text from audio
│   ├── file.txt             # Combined text (audio + captions)
│
├── server.js                # Backend server file
└── README.md                # Project documentation
📝 How It Works
1️⃣ Extract Audio and Captions
The server uses FFmpeg to extract audio and captions from video.mp4:

Audio Extraction:
Converts video audio to audio.wav. Then, a speech-to-text service processes audio.wav to generate audio.txt.
bash
Copy
Edit
ffmpeg -i video.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 audio.wav
Captions Extraction:
Extracts subtitles from video.mp4 into captions.srt. Then, it processes the .srt file to generate captions.txt.
bash
Copy
Edit
ffmpeg -i video.mp4 -map 0:s:0 captions.srt
2️⃣ Combine Text
Combines audio.txt and captions.txt into a single file, file.txt, which serves as the base for judge interactions.

3️⃣ APIs
/get-combined-text: Combines audio.txt and captions.txt into file.txt and returns it as JSON.
/ask-question: Judges analyze file.txt to generate personalized questions.
/get-roast: Judges roast the user based on their answers.
🖥️ Installation and Setup
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/video-analysis-backend.git
cd video-analysis-backend
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
node server.js
Place your video file in the video_analysis_output folder as video.mp4.

Access the server at:

arduino
Copy
Edit
http://localhost:3000
🔥 API Endpoints
1️⃣ /get-combined-text
Method: GET
Description: Combines audio.txt and captions.txt into file.txt and returns it.
Response:
json
Copy
Edit
{
  "combinedText": "Combined content from audio.txt and captions.txt"
}
2️⃣ /ask-question
Method: POST
Description: Generates a personalized question based on file.txt.
Request Body:
json
Copy
Edit
{
  "intro": "Content from file.txt"
}
Response:
json
Copy
Edit
{
  "result": "Why should we choose you based on this intro?"
}
3️⃣ /get-roast
Method: POST
Description: Generates a fun roast based on the user's answer.
Request Body:
json
Copy
Edit
{
  "ans": "User's answer"
}
Response:
json
Copy
Edit
{
  "result": "That's an interesting answer, but I have to roast you for it!"
}
📜 Scripts
Start Server:
bash
Copy
Edit
node server.js
Extract Audio (Manually):
bash
Copy
Edit
ffmpeg -i backend/video_analysis_output/video.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 backend/video_analysis_output/audio.wav
Extract Captions (Manually):
bash
Copy
Edit
ffmpeg -i backend/video_analysis_output/video.mp4 -map 0:s:0 backend/video_analysis_ou


In last I conclude it as :- 
1. Run app.py in proper directory..
2. then run index.html file from x/frontend folder 
3. it will directs to website where you paste the video.mp4 file (not necesary audio.mp3 file)
4. wait for some time it will automatically save all text files.
5. Then run node server.js
6. then after that dashboard.html where you can chat with judges..

Thankyou for using this repo..
