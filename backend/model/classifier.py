from ultralytics import YOLO
import cv2
from collections import Counter
import numpy as np

# Load your trained YOLOv8 model (fine-tuned for food, if available)
model = YOLO("yolov8n.pt")  # Replace with your custom model path if needed

# Set confidence threshold to filter weak detections
CONFIDENCE_THRESHOLD = 0.5

# Initialize webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

print("Webcam started. Press 'c' to capture and classify, 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Can't receive frame from webcam")
        break

    cv2.imshow("Webcam Feed", frame)
    key = cv2.waitKey(1) & 0xFF

    # Capture and classify on 'c'
    if key == ord('c'):
        # Run prediction
        results = model.predict(frame, conf=CONFIDENCE_THRESHOLD)

        # Extract predictions
        boxes = results[0].boxes
        if boxes is not None and boxes.cls.numel() > 0:
            class_ids = boxes.cls.cpu().numpy()
            confidences = boxes.conf.cpu().numpy()
            class_names = [model.names[int(cls_id)] for cls_id in class_ids]

            # Filter based on confidence
            filtered = [(name, conf) for name, conf in zip(
                class_names, confidences) if conf > CONFIDENCE_THRESHOLD]
            names_filtered = [name for name, _ in filtered]

            # Count object occurrences
            object_counts = Counter(names_filtered)

            # Output the results
            print("\nDetected Objects:")
            for obj, count in object_counts.items():
                print(f"{obj}: {count}")

            # OPTIONAL: Area-based estimation (good for loose items like rice, nuts, etc.)
            # Uncomment if needed
            # areas = [box.area().item() for box in boxes]
            # print("Areas of detections:", areas)

            # Show annotated frame
            annotated_frame = results[0].plot()
            cv2.imshow("Classification Results", annotated_frame)
            cv2.waitKey(2000)
            cv2.destroyWindow("Classification Results")
        else:
            print("No food items confidently detected.")

    # Quit on 'q'
    elif key == ord('q'):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()
