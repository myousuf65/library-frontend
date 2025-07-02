import requests


url = "http://localhost:8080/transaction/overdue"
response = requests.get(url)
print(response.text)
