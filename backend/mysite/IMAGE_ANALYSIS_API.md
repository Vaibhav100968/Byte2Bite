# Image Analysis API

This endpoint allows authenticated users to analyze images using OpenAI's GPT-4-Vision API to count and identify inventory items.

## Endpoint

```
POST /api/analyze-image/
```

## Authentication

This endpoint requires authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Request Formats

### Option 1: Base64 Image (JSON)

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "image": "base64_encoded_image_string"
}
```

### Option 2: Multipart Form Data

**Content-Type:** `multipart/form-data`

**Request Body:**

- `image`: Image file (JPEG, PNG, etc.)

## Response

**Success Response (200):**

```json
{
  "apple": 3,
  "banana": 2,
  "milk": 1
}
```

**Error Response (400):**

```json
{
  "error": "Image data is required"
}
```

**Error Response (401):**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Error Response (500):**

```json
{
  "error": "OpenAI API error: ..."
}
```

## Setup

1. Set your OpenAI API key as an environment variable:

   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

2. Make sure you have the required dependencies:
   ```bash
   pip install requests
   ```

## Example Usage

### Using curl with base64:

```bash
# First, encode your image to base64
base64_image=$(base64 -i your_image.jpg)

# Make the API call
curl -X POST \
  http://localhost:8000/api/analyze-image/ \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d "{\"image\": \"$base64_image\"}"
```

### Using curl with multipart form:

```bash
curl -X POST \
  http://localhost:8000/api/analyze-image/ \
  -H "Authorization: Bearer your_jwt_token" \
  -F "image=@your_image.jpg"
```

### Using JavaScript/Fetch:

```javascript
// For base64
const response = await fetch("/api/analyze-image/", {
  method: "POST",
  headers: {
    Authorization: "Bearer your_jwt_token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    image: base64ImageString,
  }),
});

// For file upload
const formData = new FormData();
formData.append("image", imageFile);

const response = await fetch("/api/analyze-image/", {
  method: "POST",
  headers: {
    Authorization: "Bearer your_jwt_token",
  },
  body: formData,
});

const result = await response.json();
console.log(result);
```

## Notes

- The API uses OpenAI's `gpt-4-vision-preview` model
- Maximum response time is 30 seconds
- The prompt specifically asks for JSON format with item names and counts
- If OpenAI doesn't return valid JSON, the raw response will be returned in a `raw_response` field
