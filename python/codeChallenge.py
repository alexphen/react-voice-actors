import secrets
import requests
import json
import os
from decouple import config

CLIENT_ID = config('MAL_CLIENT_ID')
CLIENT_SECRET = config('MAL_CLIENT_SECRET')
print(CLIENT_ID, CLIENT_SECRET)

# def get_new_code_verifier() -> str :
#     token = secrets.token_urlsafe(100)
#     return token[:128]

# code_verifier = code_challenge = get_new_code_verifier()
# # print(len(code_verifier))
# # print(code_verifier)


# code = "def5020041b203c815011d53a83d081caef399fe210f3ac3a9de8b0eaa3371ccaa059a4454f67442049699b9208262a9732202842a3d1be97767edd225622639f5c6cc7b0cbfe615d4208e5e4a6e8577aa84ea24cb227e5fc06bd7583603c8c724c56c10ce274102f86686ad1c59f9f4c445c60b7f3905cd34f7211bef63d3fb931c6bb1e2294c8874dca39ec84dfe694ee9db9b8003bf6a945a60a101fa30cadb9cb364c9f8fad82a1965549a8df607887078e55aa3a19e2c4f575f992ca54ca68a6e78cadc75367bf1e6bd7dcc709a938d54f7d04cea5c1142380cacc7dd814a9ca91b1105380f446f55fb563962410f119d1c8ede71aedb789965fb09da0feafbf7aac59a29a5550caa9dd9447b827cdb2463cf7753f9c4c2ab0a6adf508339268dab6aae2740b235931dec8b4b32f777f403b0ea87273df9643c96e08ae6082925f7d21e54b5244bc8e87f7abb64ed0890f89061ff2a28a6cdd7fef930667373cc9633a93c37eab5800f05086f41710c08577db1dbbb5a05dc2115fab58868c9d9229574f498e110ffca7cb083b289d8315d6191c21892647d844a151791d32ba24b508cc46da24f19362127b4c7a24ba4160be232bddc3493770ee74dbab27acc5791f73083f69e9b4b0a886ac431a3cfb879f2fa569f62f074bbf1152ed8f1b5bf20d0ace572fd"
# url = f'''https://myanimelist.net/v1/oauth2/token?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&code={code}&code_verifier={code_verifier}&grant_type=authorization_code'''

# def generate_new_token(authorisation_code: str, code_verifier: str) -> dict:
#     global CLIENT_ID, CLIENT_SECRET

#     url = 'https://myanimelist.net/v1/oauth2/token'
#     data = {
#         'client_id': CLIENT_ID,
#         'client_secret': CLIENT_SECRET,
#         'code': authorisation_code,
#         'code_verifier': code_verifier,
#         'grant_type': 'authorization_code'
#     }

#     response = requests.post(url, data)
#     response.raise_for_status()  # Check whether the request contains errors

#     token = response.json()
#     response.close()
#     print('Token generated successfully!')

#     with open('token.json', 'w') as file:
#         json.dump(token, file, indent = 4)
#         print('Token saved in "token.json"')

#     return token


# test = generate_new_token(code, code_verifier)
# print(test)

# res = requests.post(url2)
# res.raise_for_status()
# # result = res.json()
# print(res.json())




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


if __name__ == '__main__':
    code_verifier = code_challenge = get_new_code_verifier()
    print_new_authorisation_url(code_challenge)

    authorisation_code = input('Copy-paste the Authorisation Code: ').strip()
    token = generate_new_token(authorisation_code, code_verifier)

    print_user_info(token['access_token'])
