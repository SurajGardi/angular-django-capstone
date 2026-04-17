from rest_framework import serializers
from .models import Record
import re

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = '__all__'
        read_only_fields = ['created_at']

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Name must be at least 2 characters.')
        if not re.match(r'^[a-zA-Z\s]+$', value):
            raise serializers.ValidationError('Name must contain only letters and spaces.')
        return value.strip()

    def validate_age(self, value):
        if value < 18:
            raise serializers.ValidationError('Age must be at least 18.')
        if value > 100:
            raise serializers.ValidationError('Age must be at most 100.')
        return value

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-\+]', '', value)
        if not cleaned.isdigit():
            raise serializers.ValidationError('Phone must contain only digits.')
        if len(cleaned) < 10 or len(cleaned) > 13:
            raise serializers.ValidationError('Phone must be 10-13 digits.')
        return value

    def validate_email(self, value):
        if Record.objects.filter(email=value).exists():
            if self.instance is None:
                raise serializers.ValidationError('A record with this email already exists.')
        return value.lower()
