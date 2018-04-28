import base64
def my_encoder(my_array):
    barr = bytes(str(my_array),'utf-8')
    encoded = base64.b64encode(barr)
    return encoded

def my_decoder(encoded_data):
    decoded = base64.b64decode(encoded_data)
    text = decoded.decode('utf-8')
    original_array = ','.join(text.split(','))
    return original_array


arr = [[[1,2,5],[10,2,7]]]
enc = my_encoder(arr)
dec = my_decoder(enc)
