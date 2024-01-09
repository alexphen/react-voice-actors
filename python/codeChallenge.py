import secrets
import requests
import json
import os
from decouple import config

CLIENT_ID = config('MAL_CLIENT_ID')
CLIENT_SECRET = config('MAL_CLIENT_SECRET')

# 1. Generate a new Code Verifier / Code Challenge.
def get_new_code_verifier() -> str:
    token = secrets.token_urlsafe(100)
    return token[:128]


# 2. Print the URL needed to authorise your application.
def print_new_authorisation_url(code_challenge: str):
    global CLIENT_ID

    url = f'https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={CLIENT_ID}&code_challenge={code_challenge}'
    print(f'Authorise your application by clicking here: {url}\n')


# 3. Once you've authorised your application, you will be redirected to the webpage you've
#    specified in the API panel. The URL will contain a parameter named "code" (the Authorisation
#    Code). You need to feed that code to the application.
def generate_new_token(authorisation_code: str, code_verifier: str) -> dict:
    global CLIENT_ID, CLIENT_SECRET

    url = 'https://myanimelist.net/v1/oauth2/token'
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': authorisation_code,
        'code_verifier': code_verifier,
        'grant_type': 'authorization_code'
    }

    response = requests.post(url, data)
    response.raise_for_status()  # Check whether the request contains errors

    token = response.json()
    response.close()
    print('Token generated successfully!')

    with open('token.json', 'w') as file:
        json.dump(token, file, indent = 4)
        print('Token saved in "token.json"')

    return token


# 4. Test the API by requesting your profile information
def print_user_info(access_token: str):
    url = 'https://api.myanimelist.net/v2/users/@me'
    response = requests.get(url, headers = {
        'Authorization': f'Bearer {access_token}'
        })
    
    response.raise_for_status()
    user = response.json()
    response.close()

    print(f"\n>>> Greetings {user['name']}! <<<")


# if __name__ == '__main__':
    # code_verifier = code_challenge = get_new_code_verifier()
    # print_new_authorisation_url(code_challenge)

    # authorisation_code = input('Copy-paste the Authorisation Code: ').strip()
    # token = generate_new_token(authorisation_code, code_verifier)

    # print_user_info(token['access_token'])


response = requests.get("https://api.myanimelist.net/v2/users/@me/animelist", headers = {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImMwY2YzNmM0NWY0NTQ4OTU1ODAwYjE1ODBlM2VjOTFlMGE1YmMzYmUyN2NjNjI2NjA0Y2U0YTkzNmUwMjVhOTNjZTNhYzUzOGU0N2QzM2ViIn0.eyJhdWQiOiI1ZGJjZDI5YjMxNzhlNmQ2MmVjN2VjZjE3YjRkYWY1NiIsImp0aSI6ImMwY2YzNmM0NWY0NTQ4OTU1ODAwYjE1ODBlM2VjOTFlMGE1YmMzYmUyN2NjNjI2NjA0Y2U0YTkzNmUwMjVhOTNjZTNhYzUzOGU0N2QzM2ViIiwiaWF0IjoxNzA0ODIzNTAwLCJuYmYiOjE3MDQ4MjM1MDAsImV4cCI6MTcwNzUwMTkwMCwic3ViIjoiMTAxNTM1NDgiLCJzY29wZXMiOltdfQ.lacCnMS5zGc3L_h8S1TtnFO4UeJIuSfV2UeOBDgQxe43Byi1ahWzhnr9Aq8tXt-pF2W2tnt_RPc_i37c1_y5MmEZt6zihpUc8vKq-RaaiIRRVgn0eD1u7u_HdaVq4xJjor_Qn6qIS2M1ozIJ3D9Ta_pAkoR1WGX_Vw9qm4rTuM1tKe23qTeSOzifBg2JS0FRG8G99pM2VXlSsVk9peR54ZnD0SfHmJ8xvbnoTRqBeC1iCKa0uflIQV314qBXeHXyfZwIpu6dsZZWzR3htA-Fwn5iXxLW2f-ellvgvETjwW-dQ-F1nw7oy60wgUn2BCuEl6IElQWfPgfhSoB_e0G-Jg'
})
response.raise_for_status()
user = response.json()
print(user)