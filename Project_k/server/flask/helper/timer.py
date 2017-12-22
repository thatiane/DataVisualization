import threading

def set_interval(func, sec):
    """Automatic function caller.

    Keyword arguments:
    func -- the function to call repeatedly
    sec -- time interval to call func
    """
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t
