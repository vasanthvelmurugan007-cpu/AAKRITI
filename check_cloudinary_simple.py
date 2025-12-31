from dotenv import load_dotenv
import os

load_dotenv()
name = os.getenv("CLOUDINARY_CLOUD_NAME")
key = os.getenv("CLOUDINARY_API_KEY")
secret = os.getenv("CLOUDINARY_API_SECRET")

print(f"Cloud Name set: {bool(name)}")
print(f"API Key set: {bool(key)}")
print(f"API Secret set: {bool(secret)}")

if name:
    print(f"Cloud Name Value: '{name}'")
