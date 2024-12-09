from django.db import models
from django.utils import timezone

class Traveler(models.Model):
    name = models.CharField(max_length=200)
    num_adults = models.IntegerField(default=1)
    num_infants = models.IntegerField(default=0)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name

class ServiceVoucher(models.Model):
    TRANSFER_TYPES = [
        ('PRIVATE', 'Private Transfer'),
        ('SHARED', 'Shared Transfer'),
        ('GROUP', 'Group Transfer')
    ]

    MEAL_PLANS = [
        ('BB', 'Bed and Breakfast'),
        ('HB', 'Half Board'),
        ('FB', 'Full Board'),
        ('AI', 'All Inclusive')
    ]

    traveler = models.ForeignKey(Traveler, on_delete=models.CASCADE, related_name='bookings')
    reservation_number = models.CharField(max_length=50, unique=True)
    hotel_confirmation_number = models.CharField(max_length=50)
    
    # Travel Details
    travel_start_date = models.DateField()
    travel_end_date = models.DateField(blank=True, null=True)
    
    # Hotel Details
    hotel_name = models.CharField(max_length=200)
    
    # Transfer and Meal Details
    transfer_type = models.CharField(max_length=20, choices=TRANSFER_TYPES)
    meal_plan = models.CharField(max_length=10, choices=MEAL_PLANS)
    
    # Additional Details
    inclusions = models.TextField(blank=True)
    arrival_details = models.TextField(blank=True)
    departure_details = models.TextField(blank=True)
    meeting_point = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.reservation_number} - {self.hotel_name}"

    @property
    def total_rooms(self):
        return sum(room.quantity for room in self.room_allocations.all())


class RoomAllocation(models.Model):
    ROOM_TYPES = [
        ('SGL', 'Single'),
        ('DBL', 'Double'),
        ('TWN', 'Twin'),
        ('TPL', 'Triple'),
    ]

    service_voucher = models.ForeignKey(ServiceVoucher, on_delete=models.CASCADE, related_name='room_allocations')
    room_type = models.CharField(max_length=3, choices=ROOM_TYPES)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.get_room_type_display()} x{self.quantity}"

    class Meta:
        unique_together = ['service_voucher', 'room_type']


class Itinerary(models.Model):
    service_voucher = models.ForeignKey(ServiceVoucher, on_delete=models.CASCADE, related_name='itinerary_items')
    day = models.IntegerField()
    date = models.DateField()

    def __str__(self):
        return f"Day {self.day} - {self.date}"

    class Meta:
        ordering = ['day']
        unique_together = ['service_voucher', 'day']
        verbose_name_plural = 'Itineraries'


class ItineraryActivity(models.Model):
    ACTIVITY_TYPES = [
        ('TRANSFER', 'Transfer'),
        ('TOUR', 'Tour/Activity'),
        ('CHECKIN', 'Hotel Check-in'),
        ('CHECKOUT', 'Hotel Check-out'),
        ('MEAL', 'Meal'),
        ('FREE', 'Free Time'),
        ('OTHER', 'Other')
    ]

    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name='activities')
    time = models.TimeField()
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES, default='OTHER')
    description = models.TextField()
    location = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.time.strftime('%H:%M')} - {self.get_activity_type_display()}"

    class Meta:
        ordering = ['time']
        verbose_name_plural = 'Itinerary Activities'
