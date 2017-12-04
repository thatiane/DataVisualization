from data import *
import datetime

saved_today = False
old_day = 1

while True:
    now = datetime.datetime.now()
    if now.hour == 4:
        if not saved_today:
            save_data()
            saved_today = True
        else:
            if old_day != now.day:
                old_day = now.day
                saved_today = False