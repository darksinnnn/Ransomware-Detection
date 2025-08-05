import os
import time
import psutil
import hashlib
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from collections import deque
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
SUSPICIOUS_EXTENSIONS = [".encrypted", ".lock", ".enc", ".crypt"]
MODIFICATION_THRESHOLD = 10  # Files modified in quick succession to raise alert
HASHES = {}  # Dictionary to store file hashes for integrity checks
ALERT_LOG = "alert_log.txt"
FILE_LOG = "file_log.txt"

# Queue to track recent file modifications and their timestamps
modification_queue = deque(maxlen=MODIFICATION_THRESHOLD)

def log_alert(message):
    """Logs an alert message with a timestamp to a file."""
    with open(ALERT_LOG, "a") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {message}\n")
    print(f"[ALERT] {message}")

def log_file(message):
    """Logs a file message with a timestamp to a file."""
    with open(FILE_LOG, "a") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {message}\n")
    print(f"[FILE] {message}")

def hash_file(filepath):
    """Returns the SHA-256 hash of the specified file."""
    sha256_hash = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except IOError:
        return None

class RansomwareDetectionHandler(FileSystemEventHandler):
    """Handles file system events for ransomware detection."""
    
    def __init__(self, monitored_dir):
        self.monitored_dir = monitored_dir
    
    def on_modified(self, event):
        if not event.is_directory:
            file_path = event.src_path
            self.detect_suspicious_activity(file_path)
    
    def on_created(self, event):
        if not event.is_directory:
            file_path = event.src_path
            self.detect_suspicious_activity(file_path)

    def detect_suspicious_activity(self, file_path):
        # Check for suspicious file extensions
        _, ext = os.path.splitext(file_path)
        if ext in SUSPICIOUS_EXTENSIONS:
            log_alert(f"Suspicious file extension detected: {file_path}")
        
        # Check for unauthorized file modifications using hash comparison
        new_hash = hash_file(file_path)
        if new_hash:
            if file_path in HASHES and HASHES[file_path] != new_hash:
                log_alert(f"Unauthorized file modification detected: {file_path}")
            HASHES[file_path] = new_hash  # Update hash for future integrity checks
        
        # Record modification in queue and check for high modification rate
        modification_queue.append(time.time())
        if len(modification_queue) == MODIFICATION_THRESHOLD:
            time_span = modification_queue[-1] - modification_queue[0]
            if time_span < 1:  # Threshold exceeded within a second
                log_alert(f"High volume of file modifications detected. Possible ransomware activity in {self.monitored_dir}")

def monitor_directory(monitored_dir):
    """Monitors the specified directory for file changes."""
    event_handler = RansomwareDetectionHandler(monitored_dir)
    observer = Observer()
    observer.schedule(event_handler, monitored_dir, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

def monitor_processes():
    """Checks running processes for suspicious activity (e.g., high CPU usage, encryption)."""
    while True:
        for process in psutil.process_iter(attrs=["pid", "name", "cpu_percent", "create_time"]):
            try:
                # Detect high CPU usage or recently started processes with suspicious names
                if process.info["cpu_percent"] > 50:
                    log_alert(f"High CPU usage by process: {process.info['name']} (PID: {process.info['pid']})")
                if "encrypt" in process.info["name"].lower() or "ransom" in process.info["name"].lower():
                    log_alert(f"Suspicious process detected: {process.info['name']} (PID: {process.info['pid']})")
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        time.sleep(5)

def start_monitoring(monitored_dir):
    # Initialize file hashes for integrity checks
    for root, _, files in os.walk(monitored_dir):
        for file in files:
            file_path = os.path.join(root, file)
            HASHES[file_path] = hash_file(file_path)
    
    # Start monitoring file system and processes concurrently
    file_monitor_thread = threading.Thread(target=monitor_directory, args=(monitored_dir,))
    process_monitor_thread = threading.Thread(target=monitor_processes)
    
    file_monitor_thread.start()
    process_monitor_thread.start()

@app.route('/start-ransomware-detection', methods=['POST'])
def start_detection():
    data = request.json
    monitored_dir = data.get('directory')
    
    if not monitored_dir or not os.path.isdir(monitored_dir):
        return jsonify({"error": "Invalid directory path"}), 400
    
    # Clear previous logs
    open(ALERT_LOG, 'w').close()
    open(FILE_LOG, 'w').close()
    
    # Start monitoring in a new thread
    threading.Thread(target=start_monitoring, args=(monitored_dir,)).start()
    
    log_file(f"Started monitoring directory: {monitored_dir}")
    return jsonify({"status": "Ransomware detection started", "monitored_directory": monitored_dir})

@app.route('/get-logs', methods=['GET'])
def get_logs():
    alert_logs = []
    file_logs = []
    
    if os.path.exists(ALERT_LOG):
        with open(ALERT_LOG, 'r') as f:
            alert_logs = f.readlines()
    
    if os.path.exists(FILE_LOG):
        with open(FILE_LOG, 'r') as f:
            file_logs = f.readlines()
    
    return jsonify({
        "alertLogs": alert_logs,
        "fileLogs": file_logs
    })

if __name__ == "__main__":
    app.run(debug=True)

print("Flask server is running. Use the /start-ransomware-detection endpoint to begin monitoring.")