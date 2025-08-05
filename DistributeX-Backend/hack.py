import os
import time
import random
import string

# Directory to simulate ransomware behavior
target_directory = "D:/Project/Ransomware_detection/DistributeX-Backend/Test"  # Use the same path your detection script is monitoring

# Step 1: Set up the test directory with some files
def create_test_files(directory, num_files=20):
    os.makedirs(directory, exist_ok=True)
    for i in range(num_files):
        with open(os.path.join(directory, f"test_file_{i}.txt"), 'w') as f:
            f.write("This is a test file.")

# Step 2: Simulate ransomware behavior by renaming files quickly
def simulate_ransomware_behavior(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            # Randomly generate a new "encrypted" filename
            new_name = ''.join(random.choices(string.ascii_letters + string.digits, k=10)) + ".locked"
            src_path = os.path.join(directory, filename)
            dst_path = os.path.join(directory, new_name)
            
            # Rename the file to simulate encryption behavior
            os.rename(src_path, dst_path)
            print(f"Renamed {filename} to {new_name}")
            time.sleep(0.2)  # Add a short delay to simulate rapid changes

if __name__ == "__main__":
    create_test_files(target_directory)
    print("Test files created. Simulating ransomware behavior...")
    time.sleep(2)
    simulate_ransomware_behavior(target_directory)
    print("Simulation complete.")
