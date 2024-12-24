from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Administrator'),
        ('STAFF', 'Staff'),
        ('AGENT', 'Travel Agent'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STAFF')
    department = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
