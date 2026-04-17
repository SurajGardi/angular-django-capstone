from django.db import models

class Record(models.Model):
    name = models.CharField(max_length=100)
    # name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.email}'
