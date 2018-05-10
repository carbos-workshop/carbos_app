import base64
import json
from difflib import SequenceMatcher


def my_encoder(my_array):
    barr = bytes(str(my_array),'utf-8')
    encoded = base64.b64encode(barr)
    return encoded

def my_decoder(encoded_data):
    decoded = base64.b64decode(encoded_data)
    text = decoded.decode('utf-8')
    original_text = ','.join(text.split(','))
    return original_text

def array_similarity(encoded_arr_1, encoded_arr_2):
    sim = SequenceMatcher(None, encoded_arr_1, encoded_arr_2).ratio()
    return sim

arr1 = [[[1,2,5],[10,2,7]]]
enc1 = my_encoder(arr1)

arr2 = [[[1,2,5],[10,3,8]]]
enc2 = my_encoder(arr2)

enc_sim = array_similarity(enc1, enc2)

dec1 = my_decoder(enc1)
dec2 = my_decoder(enc2)
