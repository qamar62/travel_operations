from rest_framework import serializers
from .models import Traveler, ServiceVoucher, RoomAllocation, Itinerary, ItineraryActivity, HotelVoucher

class ItineraryActivitySerializer(serializers.ModelSerializer):
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = ItineraryActivity
        fields = ['id', 'itinerary', 'time', 'activity_type', 'activity_type_display', 'description', 'location', 'notes']

class ItinerarySerializer(serializers.ModelSerializer):
    activities = ItineraryActivitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Itinerary
        fields = ['id', 'day', 'date', 'service_voucher', 'activities']

class RoomAllocationSerializer(serializers.ModelSerializer):
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    
    class Meta:
        model = RoomAllocation
        fields = ['id', 'service_voucher', 'room_type', 'room_type_display', 'quantity']

class TravelerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveler
        fields = '__all__'

class ServiceVoucherSerializer(serializers.ModelSerializer):
    traveler = TravelerSerializer(read_only=True)
    traveler_id = serializers.PrimaryKeyRelatedField(
        queryset=Traveler.objects.all(),
        source='traveler',
        write_only=True
    )
    room_allocations = RoomAllocationSerializer(many=True, read_only=True)
    itinerary_items = ItinerarySerializer(many=True, read_only=True)
    total_rooms = serializers.IntegerField(read_only=True)
    transfer_type_display = serializers.CharField(source='get_transfer_type_display', read_only=True)
    meal_plan_display = serializers.CharField(source='get_meal_plan_display', read_only=True)

    class Meta:
        model = ServiceVoucher
        fields = '__all__'
        extra_kwargs = {
            'traveler': {'read_only': True}
        }

class HotelVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelVoucher
        fields = '__all__'
