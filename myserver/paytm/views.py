from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from time import time
import requests
from .Checksum import generate_checksum, verify_checksum
from django.views.decorators.clickjacking import xframe_options_exempt

@xframe_options_exempt
def initiate_payment(request):
    if request.method == "GET":
        return render(request, 'payments/pay.html')
    merchant_key = "Jln%VflrgwHlfGVE"
    qpar = '?user='+request.GET.get('user')+'&&book='+request.GET.get('book')
    print(qpar)
    params = (
        ('MID', 'saNqdi34425401921105'),
        ('ORDER_ID', 'ORD_'+str(int(time()))),
        ('CUST_ID', request.GET.get('user')),
        ('TXN_AMOUNT', '10.00'),
        ('CHANNEL_ID', 'WEB'),
        ('WEBSITE', 'WEBSTAGING'),
        # ('EMAIL', request.user.email),
        # ('MOBILE_N0', '9911223388'),
        ('INDUSTRY_TYPE_ID', 'Retail'),
        ('CALLBACK_URL', 'http://127.0.0.1:8000/paytm/callback/'+qpar),
        # ('PAYMENT_MODE_ONLY', 'NO'),
    )

    paytm_params = dict(params)
    checksum = generate_checksum(paytm_params, merchant_key)

    paytm_params['CHECKSUMHASH'] = checksum
    return render(request, 'payments/redirect.html', context=paytm_params)

@xframe_options_exempt
@csrf_exempt
def callback(request):
    if request.method == 'POST':
        qpar = '?user='+request.GET.get('user')+'&&book='+request.GET.get('book')

        response = requests.get('http://localhost:8000/api/user/mail/?'+qpar)
        
        return render(request, 'payment/callback.html')




