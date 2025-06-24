from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Customer
from .serializers import CustomerSerializer
import requests
import base64
import json
import os
from django.conf import settings


class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_image(request):
    """
    Analyze image using OpenAI GPT-4-Vision API
    Accepts base64 encoded image or multipart form data
    """
    try:
        # Get image data from request
        image_data = None

        # Check if image is sent as base64 in JSON
        if request.content_type == 'application/json':
            image_base64 = request.data.get('image')
            if not image_base64:
                return Response(
                    {'error': 'Image data is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            image_data = image_base64

        # Check if image is sent as multipart form data
        elif request.content_type.startswith('multipart/form-data'):
            image_file = request.FILES.get('image')
            if not image_file:
                return Response(
                    {'error': 'Image file is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Convert file to base64
            image_data = base64.b64encode(image_file.read()).decode('utf-8')

        else:
            return Response(
                {'error': 'Unsupported content type. Use application/json with base64 image or multipart/form-data with image file'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get OpenAI API key from environment variable
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            return Response(
                {'error': 'OpenAI API key not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Prepare request to OpenAI GPT-4-Vision API
        headers = {
            'Authorization': f'Bearer {openai_api_key}',
            'Content-Type': 'application/json'
        }

        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'text',
                            'text': 'Count and identify all inventory items in this image. Return JSON with item names and counts only.'
                        },
                        {
                            'type': 'image_url',
                            'image_url': {
                                'url': f'data:image/jpeg;base64,{image_data}'
                            }
                        }
                    ]
                }
            ],
            'max_tokens': 300
        }

        # Make request to OpenAI API
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            return Response(
                {'error': f'OpenAI API error: {response.text}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Parse OpenAI response
        openai_response = response.json()
        content = openai_response['choices'][0]['message']['content']

        # Try to parse JSON from the response
        try:
            # Extract JSON from the response (in case OpenAI wraps it in markdown)
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                parsed_data = json.loads(json_str)
            else:
                # If no JSON found, return the raw content
                parsed_data = {'raw_response': content}
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw content
            parsed_data = {'raw_response': content}

        return Response(parsed_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': f'Internal server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
