# Generated by Django 5.0 on 2024-12-06 08:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceVoucher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reservation_number', models.CharField(max_length=50, unique=True)),
                ('hotel_confirmation_number', models.CharField(max_length=50)),
                ('travel_start_date', models.DateField()),
                ('travel_end_date', models.DateField(blank=True, null=True)),
                ('hotel_name', models.CharField(max_length=200)),
                ('transfer_type', models.CharField(choices=[('PRIVATE', 'Private Transfer'), ('SHARED', 'Shared Transfer'), ('GROUP', 'Group Transfer')], max_length=20)),
                ('meal_plan', models.CharField(choices=[('BB', 'Bed and Breakfast'), ('HB', 'Half Board'), ('FB', 'Full Board'), ('AI', 'All Inclusive')], max_length=10)),
                ('inclusions', models.TextField(blank=True)),
                ('arrival_details', models.TextField(blank=True)),
                ('departure_details', models.TextField(blank=True)),
                ('meeting_point', models.CharField(blank=True, max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Traveler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('num_adults', models.IntegerField(default=1)),
                ('num_infants', models.IntegerField(default=0)),
                ('contact_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('contact_phone', models.CharField(blank=True, max_length=20, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Itinerary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.IntegerField()),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('description', models.TextField(blank=True)),
                ('service_voucher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itinerary_items', to='operations.servicevoucher')),
            ],
        ),
        migrations.AddField(
            model_name='servicevoucher',
            name='traveler',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='operations.traveler'),
        ),
        migrations.CreateModel(
            name='RoomAllocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_type', models.CharField(choices=[('SGL', 'Single'), ('DBL', 'Double'), ('TWN', 'Twin'), ('TPL', 'Triple')], max_length=3)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('service_voucher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='room_allocations', to='operations.servicevoucher')),
            ],
            options={
                'unique_together': {('service_voucher', 'room_type')},
            },
        ),
    ]