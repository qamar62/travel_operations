from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from operations.views import TravelerViewSet, ServiceVoucherViewSet, ItineraryViewSet, ItineraryActivityViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Schema view for Swagger documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Travel Operations API",
        default_version='v1',
        description="API documentation for Travel Operations system",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="it@ant.ae"),
        license=openapi.License(name="by QAM"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'travelers', TravelerViewSet)
router.register(r'service-vouchers', ServiceVoucherViewSet)
router.register(r'itinerary', ItineraryViewSet, basename='itinerary')
router.register(r'itinerary-activities', ItineraryActivityViewSet, basename='itinerary-activity')  # Added this line

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Swagger documentation URLs
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger.yaml', schema_view.without_ui(cache_timeout=0), name='schema-yaml'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
