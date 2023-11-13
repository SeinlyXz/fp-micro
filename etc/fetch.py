import requests
import json
from datetime import datetime, timedelta
from time import sleep

url = "http://localhost:3000/api/users"

def connect():
    try:
        requests.get(url)
    except:
        print("Error connecting to API, Server may down")

def check_time(time_now, time_stamp):
    if time_now > time_stamp:
        return False
    else:
        return True

def fetch():
    if response.status_code == 200:
        data = response.json()
        last = len(data['users']) - 1
        data_user = data['users'][last]
        finger_id = data_user['finger_id']
        time_stamp = data_user['time_stamp']
        # print(finger_id, time_stamp)
        print("Fetching data", end="")
        for j in range(3):
            print(".", end="", flush=True)
            sleep(0.5)
        print("\r", end="")
        print("Data fetched!")

        print("Verifying data", end="")
        for j in range(3):
            print(".", end="", flush=True)
            sleep(0.5)
        if check_time(time_now, time_stamp):
            print("\033[1;32m Success \033[0m")
        else:
            print("\033[1;31;40m Sudah kadaluarsa \033[0m")
    else:
        print("Error fetching data from API, Server may down")

while True:
    a = input("Press enter to fetch data...")
    connect()
    response = requests.get(url)
    # get_time_now = datetime.now() + timedelta(hours=2)
    get_time_now = datetime.now()
    time_now = get_time_now.strftime("%H:%M:%S")
    fetch()