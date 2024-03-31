from django.urls import path
from .views import revenue_questions, grossmargin_questions, sga_questions, capex_questions # ensure this import is correct

urlpatterns = [
    path('revenue/', revenue_questions, name='revenue_questions'),
    path('grossmargin/', grossmargin_questions, name='grossmargin_questions'),
    path('sga/', sga_questions, name='sga_questions'),
    path('capex/', capex_questions, name='capex_questions'),
    # Other paths...
]
