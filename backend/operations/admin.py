from django.contrib import admin
from .models import Traveler, ServiceVoucher, RoomAllocation, Itinerary

class RoomAllocationInline(admin.TabularInline):
    model = RoomAllocation
    extra = 1
    min_num = 1

class ItineraryInline(admin.TabularInline):
    model = Itinerary
    extra = 1

@admin.register(ServiceVoucher)
class ServiceVoucherAdmin(admin.ModelAdmin):
    list_display = ['reservation_number', 'hotel_name', 'traveler', 'travel_start_date', 'travel_end_date', 'total_rooms']
    list_filter = ['hotel_name', 'transfer_type', 'meal_plan', 'travel_start_date']
    search_fields = ['reservation_number', 'hotel_name', 'traveler__name']
    inlines = [RoomAllocationInline, ItineraryInline]
    fieldsets = (
        ('Booking Information', {
            'fields': ('traveler', 'reservation_number', 'hotel_confirmation_number')
        }),
        ('Travel Details', {
            'fields': ('travel_start_date', 'travel_end_date')
        }),
        ('Hotel Details', {
            'fields': ('hotel_name', 'transfer_type', 'meal_plan')
        }),
        ('Additional Information', {
            'fields': ('inclusions', 'arrival_details', 'departure_details', 'meeting_point'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Traveler)
class TravelerAdmin(admin.ModelAdmin):
    list_display = ['name', 'num_adults', 'num_infants', 'contact_email', 'contact_phone']
    search_fields = ['name', 'contact_email', 'contact_phone']
