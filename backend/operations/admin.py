from django.contrib import admin
from .models import ServiceVoucher, Traveler, RoomAllocation, Itinerary, ItineraryActivity, HotelVoucher

class RoomAllocationInline(admin.TabularInline):
    model = RoomAllocation
    extra = 1
    min_num = 1

class ItineraryActivityInline(admin.TabularInline):
    model = ItineraryActivity
    extra = 1
    fields = ('time', 'activity_type', 'description', 'location', 'notes')
    ordering = ('time',)

class ItineraryInline(admin.TabularInline):
    model = Itinerary
    extra = 1
    fields = ('day', 'date')
    ordering = ('day',)
    show_change_link = True

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('activities')

@admin.register(ServiceVoucher)
class ServiceVoucherAdmin(admin.ModelAdmin):
    list_display = ('reservation_number', 'hotel_name', 'traveler', 'travel_start_date', 'travel_end_date')
    list_filter = ('hotel_name', 'transfer_type', 'meal_plan')
    search_fields = ('reservation_number', 'hotel_name', 'traveler__name')
    inlines = [RoomAllocationInline, ItineraryInline]
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('traveler', 'reservation_number', 'hotel_confirmation_number')
        }),
        ('Travel Details', {
            'fields': ('travel_start_date', 'travel_end_date')
        }),
        ('Hotel & Services', {
            'fields': ('hotel_name', 'transfer_type', 'meal_plan')
        }),
        ('Additional Information', {
            'fields': ('inclusions', 'arrival_details', 'departure_details', 'meeting_point'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('service_voucher', 'day', 'date', 'get_activities')
    list_filter = ('service_voucher', 'date')
    inlines = [ItineraryActivityInline]
    
    def get_activities(self, obj):
        return ", ".join([f"{activity.time.strftime('%H:%M')} - {activity.get_activity_type_display()}" 
                         for activity in obj.activities.all().order_by('time')])
    get_activities.short_description = 'Activities'

@admin.register(ItineraryActivity)
class ItineraryActivityAdmin(admin.ModelAdmin):
    list_display = ('itinerary', 'time', 'activity_type', 'location', 'description')
    list_filter = ('activity_type', 'itinerary__date')
    search_fields = ('description', 'location')
    ordering = ('itinerary__day', 'time')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('itinerary')

@admin.register(Traveler)
class TravelerAdmin(admin.ModelAdmin):
    list_display = ('name', 'num_adults', 'num_infants', 'contact_email', 'contact_phone')
    search_fields = ('name', 'contact_email', 'contact_phone')

@admin.register(HotelVoucher)
class HotelVoucherAdmin(admin.ModelAdmin):
    list_display = ('hotel_name', 'guest_name', 'check_in_date', 'check_out_date', 'confirmation_number')
    search_fields = ('hotel_name', 'guest_name', 'confirmation_number')
