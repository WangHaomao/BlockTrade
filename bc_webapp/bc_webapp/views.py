import sys
from django.shortcuts import render, HttpResponse


def index(request):
    return render(request, 'index.html')

def release(request):
    return render(request, 'pages/release.html')
