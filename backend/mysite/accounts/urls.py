from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, BusinessLoginView, CustomerLoginView, UserProfileView, DeleteAccountView, update_reporting_frequency

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/business/', BusinessLoginView.as_view(), name='business-login'),
    path('login/customer/', CustomerLoginView.as_view(), name='customer-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('update-reporting-frequency/', update_reporting_frequency,
         name='update-reporting-frequency'),
]
