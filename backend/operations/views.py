from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Traveler, ServiceVoucher, RoomAllocation, Itinerary
from .serializers import (
    TravelerSerializer, 
    ServiceVoucherSerializer,
    RoomAllocationSerializer,
    ItinerarySerializer
)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

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

class ItineraryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing itinerary items.
    """
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
