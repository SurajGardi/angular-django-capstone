from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Record
from .serializers import RecordSerializer


class RecordListCreateView(APIView):

    def get(self, request):
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 5))
        except ValueError:
            page = 1
            page_size = 5

        records = Record.objects.all()
        total_count = records.count()

        start = (page - 1) * page_size
        end = start + page_size
        paginated = records[start:end]

        serializer = RecordSerializer(paginated, many=True)

        return Response({
            'success': True,
            'message': 'Records fetched successfully.',
            'data': serializer.data,
            'pagination': {
                'total': total_count,
                'page': page,
                'page_size': page_size,
                'total_pages': (total_count + page_size - 1) // page_size,
            }
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Record submitted successfully!',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Validation failed. Please check your inputs.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
