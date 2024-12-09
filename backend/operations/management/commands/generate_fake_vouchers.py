from django.core.management.base import BaseCommand
from operations.models import ServiceVoucher, Traveler, Itinerary, RoomAllocation, ItineraryActivity
from faker import Faker
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Generate fake service vouchers with related data'

    def handle(self, *args, **kwargs):
        fake = Faker()

        for _ in range(15):
            # Create a fake traveler
            traveler = Traveler.objects.create(
                name=fake.name(),
                num_adults=random.randint(1, 4),
                num_infants=random.randint(0, 2),
                contact_email=fake.email(),
                contact_phone=fake.phone_number()
            )

            # Create a fake service voucher
            start_date = fake.date_this_year()
            end_date = start_date + timedelta(days=random.randint(1, 10))

            voucher = ServiceVoucher.objects.create(
                traveler=traveler,
                reservation_number=fake.unique.bothify(text='???-#####'),
                hotel_confirmation_number=fake.unique.bothify(text='CONF-#####'),
                travel_start_date=start_date,
                travel_end_date=end_date,
                hotel_name=fake.company(),
                transfer_type=random.choice(['PRIVATE', 'SHARED', 'GROUP']),
                meal_plan=random.choice(['BB', 'HB', 'FB', 'AI']),
                inclusions=fake.text(max_nb_chars=200),
                arrival_details=fake.text(max_nb_chars=100),
                departure_details=fake.text(max_nb_chars=100),
                meeting_point=fake.address(),
            )

            # Create fake room allocations
            for room_type in ['SGL', 'DBL', 'TWN', 'TPL']:
                if random.choice([True, False]):  # Randomly decide if this room type is included
                    RoomAllocation.objects.create(
                        service_voucher=voucher,
                        room_type=room_type,
                        quantity=random.randint(1, 3)
                    )

            # Create fake itineraries and activities
            for day in range(1, random.randint(2, 5)):
                itinerary = Itinerary.objects.create(
                    service_voucher=voucher,
                    day=day,
                    date=start_date + timedelta(days=day-1)
                )

                # Create fake itinerary activities
                for _ in range(random.randint(1, 3)):  # Randomly create 1 to 3 activities
                    ItineraryActivity.objects.create(
                        itinerary=itinerary,
                        time=fake.time(),
                        activity_type=random.choice(['TRANSFER', 'TOUR', 'CHECKIN', 'CHECKOUT', 'MEAL', 'FREE', 'OTHER']),
                        description=fake.sentence(nb_words=10),
                        location=fake.city(),
                        notes=fake.text(max_nb_chars=50)
                    )

        self.stdout.write(self.style.SUCCESS('Successfully created 15 fake service vouchers with travelers, room allocations, itineraries, and activities.'))
