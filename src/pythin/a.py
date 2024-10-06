import requests
import json

# Define the headers from the curl command
headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en-IN;q=0.9,en;q=0.8,hi;q=0.7",
    "cache-control": "max-age=0",
    "cookie": "_gid=GA1.2.580219748.1728209685; _gcl_au=1.1.1200700559.1728209685; _clck=1e0rcx2|2|fps|0|1740; _ga_JHGG879Z0K=GS1.1.1728215688.1.1.1728215793.60.0.1872549428; cto_bundle=eaEB3V95aSUyQnN3SkE4d25mbFhhbVhPMzR1bWpFbHZhOHQ1OCUyRkRXMU1vT3NIMjV2JTJCMUhWcVhYRDlYQUJlR2wlMkJNQTNxSENjNEhSbGlsR2VkcnlMclhiWVk3TlRnNFFhdCUyQmZkUnV4SlNHQ3RZTk8lMkJEODBUelBvMEklMkJTN0huJTJCZ1h1ciUyQmRCT1hXViUyRlliaTJqem1DbmlqOGNwUmIwUSUzRCUzRA; _ga_LS1G87DVEV=GS1.1.1728215707.4.1.1728217610.58.0.0; _ga=GA1.1.1323852018.1724430928; _ga_8DWMKZHX87=GS1.1.1728216711.4.1.1728217610.0.0.0; _clsk=2b2xe3|1728217611832|6|1|u.clarity.ms/collect",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
}

# Function to get storeID using store number
def get_store_id(store_number):
    url = f"https://api.dotpe.in/api/merchant/external/cstore/{store_number}?referer=social&serviceSubtype=fine"
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            try:
                response_data = response.json()
                store_id = response_data.get('store', {}).get('storeID', None)
                return store_id
            except json.JSONDecodeError:
                print(f"Error decoding JSON for store number {store_number}: {response.text}")
                return None
        else:
            print(f"Error: Received status code {response.status_code} for store number {store_number}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving store ID for store number {store_number}: {e}")
        return None

# Function to get ongoing items using storeID
def get_ongoing_items(store_id):
    url = f"https://api.dotpe.in/api/morder/suggestion/ongoing/items?storeID={store_id}"
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            try:
                ongoing_items = response.json()
                return ongoing_items
            except json.JSONDecodeError:
                print(f"Error decoding ongoing items JSON for store ID {store_id}: {response.text}")
                return None
        else:
            print(f"Error: Received status code {response.status_code} for store ID {store_id}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving ongoing items for store ID {store_id}: {e}")
        return None

# Function to iterate over store numbers and collect ongoing items
def fetch_items_for_stores(start_store_number, end_store_number):
    store_items_data = {}

    for store_number in range(start_store_number, end_store_number + 1):
        print(f"Processing store number: {store_number}")
        store_id = get_store_id(store_number)
        if store_id:
            ongoing_items = get_ongoing_items(store_id)
            if ongoing_items:
                store_items_data[store_number] = ongoing_items
            else:
                print(f"No ongoing items for store ID {store_id}")
        else:
            print(f"Store ID not found for store number {store_number}")

    # Save the result in a JSON file
    with open('store_ongoing_items.json', 'w') as json_file:
        json.dump(store_items_data, json_file, indent=4)

# Define the range of store numbers you want to iterate over
start_store_number = 0
end_store_number = 66  # Adjust this number as needed for testing

# Fetch and save the items
fetch_items_for_stores(start_store_number, end_store_number)