import cv2
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
import os
import speech_recognition as sr  # For audio transcription
from moviepy.video.io.VideoFileClip import VideoFileClip

# Initialize BLIP model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Directory to save frames, captions, and audio transcription
output_dir = os.path.join("backend", "video_analysis_output")
os.makedirs(output_dir, exist_ok=True)

# Caption generation function for frames
def generate_caption(image):
    inputs = processor(images=image, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_length=50, num_beams=5)
    return processor.decode(outputs[0], skip_special_tokens=True).strip()


def load_video_and_extract_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Error: Could not open video.")
    frames = []
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % 50 == 0:  # Extract every 30th frame
            frames.append((frame, frame_count))
        frame_count += 1
    cap.release()
    return frames


def save_frames_and_captions(frames, captions):
    captions_file_path = os.path.join(output_dir, "captions.txt")
    with open(captions_file_path, "w") as captions_file:
        for idx, (frame, frame_index) in enumerate(frames):
            frame_filename = os.path.join(output_dir, f"frame_{frame_index}.jpg")
            cv2.imwrite(frame_filename, frame)
            captions_file.write(f"Frame {frame_index}: {captions[idx]}\n")


def extract_audio(video_path, audio_output_path):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_output_path)
    except Exception as e:
        print(f"Error extracting audio: {e}")


def convert_audio_to_text(audio_path, transcription_path):
    try:
        if not os.path.exists(audio_path):
            print(f"Audio file {audio_path} not found.")
            return
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as audio_file:
            audio_data = recognizer.record(audio_file)
        text = recognizer.recognize_google(audio_data)
        with open(transcription_path, "w") as transcription_file:
            transcription_file.write(text)
    except Exception as e:
        print(f"Error converting audio to text: {e}")


def analyze_video_activity(video_path):
    frames = load_video_and_extract_frames(video_path)
    pil_frames = [Image.fromarray(frame) for frame, _ in frames]
    captions = [generate_caption(image) for image in pil_frames]
    save_frames_and_captions(frames, captions)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print("Audio extraction starting...")

    audio_output_path = os.path.join(output_dir, "audio.wav")
    transcription_output_path = os.path.join(output_dir, "audio.txt")
    
    try:
        # Check if video has audio
        video = VideoFileClip(video_path)
        if video.audio is None:
            print("No audio found in the video.")
            return
        
        video.audio.write_audiofile(audio_output_path)
        print("Audio extraction completed.")
        
        convert_audio_to_text(audio_output_path, transcription_output_path)
        print("Audio transcription completed.")
        
    except Exception as e:
        print(f"Audio processing error: {e}")

    return {"output_dir": output_dir, "captions_count": len(captions)}