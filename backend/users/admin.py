from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'department')
    list_filter = ('role', 'department') + UserAdmin.list_filter
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Information', {'fields': ('role', 'department', 'phone')}),
    )
