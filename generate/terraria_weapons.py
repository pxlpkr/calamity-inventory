import json

import requests
from bs4 import BeautifulSoup
import time

# --- CONFIGURATION ---
WIKI_DOMAIN = "terraria.wiki.gg"
CATEGORY_NAME = "Summon_weapons"
# ---------------------

BASE_URL = f"https://{WIKI_DOMAIN}/api.php"
HEADERS = {
    'User-Agent': 'TestScraperM17/1.0'
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)

def get_rarity_string(rarity):
    return {
        "-1": "Gray",
        "0": "White",
        "1": "Blue",
        "2": "Green",
        "3": "Orange",
        "4": "Light Red",
        "5": "Pink",
        "6": "Light Purple",
        "7": "Lime",
        "8": "Yellow",
        "9": "Cyan",
        "10": "Red",
        "11": "Purple",
        "12": "Turquoise",
        "13": "Pure Green",
        "14": "Dark Blue",
        "15": "Violet",
        "16": "Hot Pink",
        "17": "Calamity Red",
        "rainbow": "Rainbow",
        "Master": "Fiery Red",
        "null": "null"
    }[rarity]

def get_category_members(category):
    """Fetches all page titles in a specific category using the API."""
    all_titles = []
    list_params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": f"Category:{category}",
        "cmlimit": "max",
        "format": "json"
    }

    print(f"Fetching titles from Category:{category}...")
    res = SESSION.get(BASE_URL, params=list_params).json()
    members = res.get("query", {}).get("categorymembers", [])
    all_titles = [m["title"] for m in members]

    if not all_titles:
        print("No items found in category. Check the name/capitalization!")
        return []

    # 2. Filter out redirects in batches (API allows 50 titles at once)
    final_pages = []
    # Break titles into chunks of 50
    for i in range(0, len(all_titles), 50):
        chunk = all_titles[i:i + 50]

        info_params = {
            "action": "query",
            "titles": "|".join(chunk), # Pipe-separated list
            "prop": "info",
            "format": "json"
        }

        info_res = SESSION.get(BASE_URL, params=info_params).json()
        pages_data = info_res.get("query", {}).get("pages", {})

        for page_id, page_info in pages_data.items():
            # Skip if it's a redirect or if the page is 'missing'
            if "redirect" not in page_info and int(page_id) > 0:
                final_pages.append(page_info["title"])
            else:
                reason = "Redirect" if "redirect" in page_info else "Missing"
                print(f"Skipping {page_info.get('title', 'Unknown')}: {reason}")

    return final_pages

def extract_tooltip_text(td_element):
    """Replaces <br> tags with '. ' and cleans up the text."""
    if not td_element:
        return ""

    # Find every <br> and replace it with a string
    for br in td_element.find_all("br"):
        br.replace_with(". ")

    # Now get the text and clean up extra whitespace/newlines
    clean_text = td_element.get_text(separator=" ", strip=True)

    # Optional: Fix double spaces or " . " if the HTML had spaces around the <br>
    clean_text = clean_text.replace(" .", ".").replace("  ", " ")

    return clean_text

def get_info_via_api(page_title):
    """Fetches page HTML via API and parses the 'stat' table."""
    params = {
        "action": "parse",
        "page": page_title,
        "prop": "text",
        "format": "json",
        "redirects": True  # Follow redirects if page was moved
    }

    # Retry logic for 429s
    for attempt in range(5):
        response = SESSION.get(BASE_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            if "parse" not in data:
                return ["Page content not found"], "null"

            # The HTML is tucked inside ['parse']['text']['*']
            raw_html = data["parse"]["text"]["*"]
            soup = BeautifulSoup(raw_html, 'lxml')

            # Look for the 'stat' table you mentioned
            table = soup.find("table", class_="stat")
            if not table:
                return ["Table 'stat' not found"], "null"

            # Search rows for 'Tooltip'
            out_tooltip = []
            out_rarity = "null"
            for row in table.find_all("tr"):
                header = row.find(["th", "td"], class_="label")
                if not header:
                    header = row.find("th")

                if header and "rarity" == header.text.lower():
                    value_cell = row.find("td")
                    if value_cell:
                        out_rarity = value_cell.find_all("img")[0].get("alt")
                        continue

                    out_rarity = "null"

                if header and header.text.lower() in ["type", "rarity", "sell", "research", "buy / sell", "buy"]:
                    continue

                if header:
                    value_cell = row.find("td")
                    if value_cell:
                        for br in value_cell.find_all("br"):
                            br.replace_with(". ")
                        if header.text.lower() == "tooltip":
                            out_tooltip.append("")
                            out_tooltip.append(f"{value_cell.get_text()}")
                        else:
                            out_tooltip.append(f"{header.text.title()}: {value_cell.get_text()}")
                        continue

            return out_tooltip, out_rarity

        elif response.status_code == 429:
            wait_time = (attempt + 1) * 5  # Increase wait: 5s, 10s, 15s...
            print(f"Rate limited on '{page_title}'. Waiting {wait_time}s...")
            time.sleep(wait_time)
        else:
            return [f"Error: {response.status_code}"], "null"

    return ["Failed after multiple retries"], "null"

# --- EXECUTION ---
titles = get_category_members(CATEGORY_NAME)
print(f"Found {len(titles)} items. Starting extraction...")

results = []
limit = 0
try:
    for title in titles:
        limit += 1
        if limit <= 0:
            continue
        if "Category:" in title:
            continue

        print(f"Fetching: {title}")
        result = {}
        result["name"] = title
        result["description"], result["rarity"] = get_info_via_api(title)
        result["rarity"] = result["rarity"].split(" (Rarity")[0]
        result["difficulty"] = "Normal"
        result["bosses"] = []
        result["filters"] = []
        result["class"] = "Summoner"
        result["type"] = "Weapon"
        result["format"] = "terraria"
        results.append(result)
        time.sleep(1)  # A polite 1-second gap
        if limit == 20000:
            break
except Exception as e:
    print(f"Error: {e}")

# Final Summary
with open("../raw/terraria_weapons_summoner.json", "w+") as f:
    f.write(json.dumps(results))
# print("\n" + "="*30)
# for item in results:
#     print(f"{item}")