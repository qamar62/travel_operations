from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Traveler, ServiceVoucher, RoomAllocation, Itinerary, ItineraryActivity, HotelVoucher
from .serializers import (
    TravelerSerializer, 
    ServiceVoucherSerializer,
    RoomAllocationSerializer,
    ItinerarySerializer,
    ItineraryActivitySerializer,
    HotelVoucherSerializer
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
    queryset = ServiceVoucher.objects.all().order_by('-id')  # Order by id descending
    serializer_class = ServiceVoucherSerializer
    ordering = ['-id']  # Add default ordering

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """Update a service voucher with related data."""
        logger.info("Updating service voucher with ID: %s", kwargs.get('pk'))
        logger.debug("Update data received: %s", request.data)
        
        try:
            instance = self.get_object()
            
            # 1. Update or create traveler
            traveler_data = request.data.get('traveler')
            if not traveler_data:
                logger.error("No traveler data provided in update")
                return Response(
                    {"error": "Traveler data is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update existing traveler
            traveler_serializer = TravelerSerializer(
                instance.traveler,
                data=traveler_data,
                partial=True
            )
            if not traveler_serializer.is_valid():
                logger.error("Invalid traveler data in update: %s", traveler_serializer.errors)
                return Response(
                    {"error": "Invalid traveler data", "details": traveler_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            traveler = traveler_serializer.save()

            # 2. Update voucher data
            request_data = request.data.copy()
            request_data['traveler_id'] = traveler.id
            
            # Update service voucher
            voucher_serializer = self.get_serializer(instance, data=request_data, partial=True)
            if not voucher_serializer.is_valid():
                logger.error("Invalid voucher data in update: %s", voucher_serializer.errors)
                return Response(
                    {"error": "Invalid voucher data", "details": voucher_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            voucher = voucher_serializer.save()

            # 3. Update room allocations
            if 'room_allocations' in request_data:
                # Delete existing room allocations
                instance.room_allocations.all().delete()
                
                # Create new room allocations
                room_allocations = request_data.get('room_allocations', [])
                for room_data in room_allocations:
                    room_data['service_voucher'] = voucher.id
                    room_serializer = RoomAllocationSerializer(data=room_data)
                    if not room_serializer.is_valid():
                        logger.error("Invalid room allocation data in update: %s", room_serializer.errors)
                        return Response(
                            {"error": "Invalid room allocation data", "details": room_serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    room_serializer.save()

            # 4. Update itinerary items and activities
            if 'itinerary_items' in request_data:
                # Delete existing itinerary items (this will cascade delete activities)
                instance.itinerary_items.all().delete()
                
                # Create new itinerary items and activities
                itinerary_items = request_data.get('itinerary_items', [])
                for item_data in itinerary_items:
                    item_data['service_voucher'] = voucher.id
                    activities = item_data.pop('activities', [])
                    
                    itinerary_serializer = ItinerarySerializer(data=item_data)
                    if not itinerary_serializer.is_valid():
                        logger.error("Invalid itinerary data in update: %s", itinerary_serializer.errors)
                        return Response(
                            {"error": "Invalid itinerary data", "details": itinerary_serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    itinerary = itinerary_serializer.save()
                    
                    # Create activities for this itinerary item
                    for activity_data in activities:
                        activity_data['itinerary'] = itinerary.id
                        activity_serializer = ItineraryActivitySerializer(data=activity_data)
                        if not activity_serializer.is_valid():
                            logger.error("Invalid activity data in update: %s", activity_serializer.errors)
                            return Response(
                                {"error": "Invalid activity data", "details": activity_serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        activity_serializer.save()

            logger.info("Successfully updated service voucher ID: %s", voucher.id)
            return Response(voucher_serializer.data)

        except Exception as e:
            logger.exception("Error updating service voucher: %s", str(e))
            return Response(
                {"error": "Failed to update service voucher", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

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

            # First create/update the traveler
            traveler_serializer = TravelerSerializer(data=traveler_data)
            if not traveler_serializer.is_valid():
                logger.error("Invalid traveler data: %s", traveler_serializer.errors)
                return Response(
                    {"error": "Invalid traveler data", "details": traveler_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            traveler = traveler_serializer.save()

            # 2. Prepare voucher data with traveler_id
            request_data = request.data.copy()  # Make a mutable copy
            request_data['traveler_id'] = traveler.id  # Add traveler_id
            
            # Create service voucher using the serializer
            voucher_serializer = self.get_serializer(data=request_data)
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
                room_allocation_data = room_data.copy()  # Create a copy to avoid modifying original
                room_allocation_data['service_voucher'] = voucher.id  # Use service_voucher instead of service_voucher_id
                room_serializer = RoomAllocationSerializer(data=room_allocation_data)
                if not room_serializer.is_valid():
                    logger.error("Invalid room allocation data: %s", room_serializer.errors)
                    return Response(
                        {"error": "Invalid room allocation data", "details": room_serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                room_serializer.save()

            # 4. Create itinerary items and activities
            itinerary_items = request.data.get('itinerary_items', [])
            for item_data in itinerary_items:
                itinerary_data = item_data.copy()  # Create a copy
                itinerary_data['service_voucher'] = voucher.id  # Use service_voucher_id
                activities = itinerary_data.pop('activities', [])
                
                itinerary_serializer = ItinerarySerializer(data=itinerary_data)
                if not itinerary_serializer.is_valid():
                    logger.error("Invalid itinerary data: %s", itinerary_serializer.errors)
                    return Response(
                        {"error": "Invalid itinerary data", "details": itinerary_serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                itinerary = itinerary_serializer.save()
                
                # Create activities for this itinerary item
                for activity_data in activities:
                    activity_data['itinerary'] = itinerary.id
                    activity_serializer = ItineraryActivitySerializer(data=activity_data)
                    if not activity_serializer.is_valid():
                        logger.error("Invalid activity data: %s", activity_serializer.errors)
                        return Response(
                            {"error": "Invalid activity data", "details": activity_serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    activity_serializer.save()

            logger.info("Successfully created service voucher with ID: %s", voucher.id)
            return Response(voucher_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Error creating service voucher: %s", str(e))
            return Response(
                {"error": "Failed to create service voucher", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class HotelVoucherViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing hotel vouchers.
    """
    queryset = HotelVoucher.objects.all().order_by('-id')
    serializer_class = HotelVoucherSerializer
    ordering = ['-id']

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
