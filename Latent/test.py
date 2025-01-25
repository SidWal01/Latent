# Define the paths of the input files
audio_file_path = r"C:\Users\admin\OneDrive\Desktop\Latent\x\backend\backend\video_analysis_output\audio.txt"
captions_file_path = r"C:\Users\admin\OneDrive\Desktop\Latent\x\backend\backend\video_analysis_output\captions.txt"
combined_file_path = r"C:\Users\admin\OneDrive\Desktop\Latent\x\backend\backend\video_analysis_output\file.txt"

# Read the content from both audio.txt and captions.txt
with open(audio_file_path, 'r', encoding='utf-8') as audio_file:
    audio_text = audio_file.read()

with open(captions_file_path, 'r', encoding='utf-8') as captions_file:
    captions_text = captions_file.read()

# Combine the content
combined_text = audio_text + "\n" + captions_text  # Adds a newline between the two texts
print(combined_text);
