from data import *
import datetime

saved_today = False
old_day = 4

while True:
    now = datetime.datetime.now()
    if now.hour == 4:
        if not saved_today:
            save_data()
            saved_today = True
            print("Data saved at {}".format(now))
        else:
            if old_day != now.day:
                old_day = now.day
                saved_today = False
