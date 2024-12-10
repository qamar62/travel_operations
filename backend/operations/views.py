from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Traveler, ServiceVoucher, RoomAllocation, Itinerary, ItineraryActivity
from .serializers import (
    TravelerSerializer, 
    ServiceVoucherSerializer,
    RoomAllocationSerializer,
    ItinerarySerializer,
    ItineraryActivitySerializer
)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import logging

logger = logging.getLogger(__name__)

class TravelerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing travelers.
    """
    queryset = Traveler.objects.all()
    serializer_class = TravelerSerializer

class ServiceVoucherViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing service vouchers.
    Includes room allocations and itinerary items.
    """
    queryset = ServiceVoucher.objects.all()
    serializer_class = ServiceVoucherSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create a service voucher with related data."""
        logger.info("Creating new service voucher with data: %s", request.data)
        
        try:
            # 1. Create or get traveler
            traveler_data = request.data.get('traveler')
            if not traveler_data:
                logger.error("No traveler data provided")
                return Response(
                    {"error": "Traveler data is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            traveler_serializer = TravelerSerializer(data=traveler_data)
            if not traveler_serializer.is_valid():
                logger.error("Invalid traveler data: %s", traveler_serializer.errors)
                return Response(
                    {"error": "Invalid traveler data", "details": traveler_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            traveler = traveler_serializer.save()

            # 2. Create service voucher
            voucher_data = {
                'traveler': traveler.id,
                'reservation_number': request.data.get('reservation_number'),
                'hotel_confirmation_number': request.data.get('hotel_confirmation_number'),
                'travel_start_date': request.data.get('travel_start_date'),
                'travel_end_date': request.data.get('travel_end_date'),
                'hotel_name': request.data.get('hotel_name'),
                'transfer_type': request.data.get('transfer_type'),
                'meal_plan': request.data.get('meal_plan'),
                'inclusions': request.data.get('inclusions'),
                'arrival_details': request.data.get('arrival_details'),
                'departure_details': request.data.get('departure_details'),
                'meeting_point': request.data.get('meeting_point'),
            }

            voucher_serializer = self.get_serializer(data=voucher_data)
            if not voucher_serializer.is_valid():
                logger.error("Invalid voucher data: %s", voucher_serializer.errors)
                return Response(
                    {"error": "Invalid voucher data", "details": voucher_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            voucher = voucher_serializer.save()

            # 3. Create room allocations
            room_allocations = request.data.get('room_allocations', [])
            for room_data in room_allocations:
                room_data['service_voucher'] = voucher.id
                room_serializer = RoomAllocationSerializer(data=room_data)
                if not room_serializer.is_valid():
                    logger.error("Invalid room allocation data: %s", room_serializer.errors)
                    raise serializers.ValidationError(room_serializer.errors)
                room_serializer.save()

            # 4. Create itinerary items and activities
            itinerary_items = request.data.get('itinerary_items', [])
            for item_data in itinerary_items:
                item_data['service_voucher'] = voucher.id
                activities = item_data.pop('activities', [])
                
                itinerary_serializer = ItinerarySerializer(data=item_data)
                if not itinerary_serializer.is_valid():
                    logger.error("Invalid itinerary data: %s", itinerary_serializer.errors)
                    raise serializers.ValidationError(itinerary_serializer.errors)
                itinerary = itinerary_serializer.save()

                for activity_data in activities:
                    activity_data['itinerary'] = itinerary.id
                    activity_serializer = ItineraryActivitySerializer(data=activity_data)
                    if not activity_serializer.is_valid():
                        logger.error("Invalid activity data: %s", activity_serializer.errors)
                        raise serializers.ValidationError(activity_serializer.errors)
                    activity_serializer.save()

            # 5. Return the complete voucher data
            voucher_data = self.get_serializer(voucher).data
            logger.info("Successfully created service voucher with ID: %s", voucher.id)
            return Response(voucher_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Error creating service voucher: %s", str(e))
            return Response(
                {"error": "Failed to create service voucher", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(
        method='post',
        request_body=RoomAllocationSerializer,
        responses={201: RoomAllocationSerializer}
    )
    @action(detail=True, methods=['post'])
    def add_room(self, request, pk=None):
        """Add a room allocation to the service voucher."""
        voucher = self.get_object()
        serializer = RoomAllocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(service_voucher=voucher)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a service voucher along with its itinerary activities."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Fetch itinerary items with activities
        itinerary_items = Itinerary.objects.filter(service_voucher=instance).prefetch_related('activities')
        itinerary_serializer = ItinerarySerializer(itinerary_items, many=True)

        return Response({
            'service_voucher': serializer.data,
            'itinerary_items': itinerary_serializer.data
        })

class ItineraryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing itinerary items.
    """
    queryset = Itinerary.objects.all().prefetch_related('activities')
    serializer_class = ItinerarySerializer

class ItineraryActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing itinerary activities.
    """
    queryset = ItineraryActivity.objects.all()
    serializer_class = ItineraryActivitySerializer
