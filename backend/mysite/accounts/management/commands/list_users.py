from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'List all registered users'

    def handle(self, *args, **options):
        users = User.objects.all()
        if not users:
            self.stdout.write(self.style.WARNING('No users found'))
            return

        self.stdout.write(self.style.SUCCESS(f'Found {users.count()} users:'))
        for user in users:
            self.stdout.write(f'\nUser ID: {user.id}')
            self.stdout.write(f'Email: {user.email}')
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'User Type: {user.user_type}')
            self.stdout.write(f'Phone: {user.phone_number or "Not provided"}')
            self.stdout.write(f'Address: {user.address or "Not provided"}')
            self.stdout.write(f'Date Joined: {user.date_joined}')
            self.stdout.write('-' * 50)
