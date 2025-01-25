from flask import Flask, request, jsonify
from video_analysis import analyze_video_activity
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Directory for uploading files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Directory for video analysis output
OUTPUT_FOLDER = os.path.join(os.getcwd(), "backend", "video_analysis_output")

@app.route('/upload', methods=['POST'])
def upload_files():
    print("Uploading file...")
    try:
        # Check if the request contains files
        if 'video' not in request.files:
            return jsonify({"error": "Video file is required."}), 400

        # Fetch files from the request
        video_file = request.files['video']
        audio_file = request.files.get('audio')  # Audio is optional

        # Validate file types
        if not video_file.filename.endswith('.mp4'):
            return jsonify({"error": "Only MP4 video files are allowed."}), 400
        if audio_file and not audio_file.filename.endswith('.mp3'):
            return jsonify({"error": "Only MP3 audio files are allowed."}), 400

        # Save files to the upload directory
        video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
        video_file.save(video_path)
        audio_path = None

        if audio_file:
            audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
            audio_file.save(audio_path)

        # Analyze the video
        result = analyze_video_activity(video_path)

        return jsonify({
            "message": "Files processed successfully.",
            "output_dir": result.get("output_dir", "video_analysis_output"),
            "details": result
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error processing files: {str(e)}"}), 500


@app.route('/get-text-files', methods=['GET'])
def get_text_files():
    try:
        audio_file_path = os.path.join(OUTPUT_FOLDER, "audio.txt")
        captions_file_path = os.path.join(OUTPUT_FOLDER, "captions.txt")

        # Read the content of the text files
        with open(audio_file_path, 'r') as audio_file:
            audio_text = audio_file.read()
        with open(captions_file_path, 'r') as captions_file:
            captions_text = captions_file.read()

        return jsonify({
            "audioText": audio_text,
            "captionsText": captions_text
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error reading text files: {str(e)}"}), 500

@app.route('/get-text', methods=['GET'])
def serve_text():
    # logic for serving the text
    text = ''
    # Define the paths of the input files
    audio_file_path = r"C:\Users\admin\OneDrive\Desktop\Latent\x\backend\backend\video_analysis_output\audio.txt"
    captions_file_path = r"C:\Users\admin\OneDrive\Desktop\Latent\x\backend\backend\video_analysis_output\captions.txt"
    combined_file_path = r"C:\Users\admin\OneDrive\Desktop\Latent\x\backend\backend\video_analysis_output\file.txt"

    # Read the content from both audio.txt and captions.txt
    with open(audio_file_path, 'r', encoding='utf-8') as audio_file:
        audio_text = audio_file.read()

    with open(captions_file_path, 'r', encoding='utf-8') as captions_file:
        captions_text = captions_file.read()
    combined_text = audio_text + "\n" + captions_text 

    return jsonify({"text":combined_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
