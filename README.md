# The simplest crawler on node.js
Crawls a website with starting from a passed URL and provides information about fetched pages and their internal linking map. It uses native node.js http/https clients for sending requests and [JSDOM](https://github.com/jsdom/jsdom) for parsing responses' body.
 
The project is being developed only as a prototype and a testing tool. For now it doesn't respect *robots.txt* file or *rel=nofollow* link's attribute, doesn't pay attention to *sitemap.xml* and isn't smart and scalable enough for production at all. So use it (if you want) only on your websites and get the fun.

# Before start
Make sure you have [node.js](https://nodejs.org/en/download/) v10 or later.  
After cloning the repository install dependencies using npm:
```
npm i
```

# Using
Synopsis:
```
node crawl-cli.js --start="<URL>" [--output="<filename>"] [--limit=<int>]
```

Arguments:
- *start*, Required - The starting URL should be absolute and contain a protocol (http/https).
- *output*, Optional - Specifies the output file for the JSON-result, By default: "result.json".
- *limit*, Optional - The max number of fetching pages, By default: 100.

# Example
For the instance let's crawl an awesome website:
```
$ node crawl-cli.js --start="https://agilenihilist.org" --limit=6
[2019-02-24T09:01:35.102Z] Start crawl "https://agilenihilist.org" with limit 6
[2019-02-24T09:01:35.105Z] Request (#1) "https://agilenihilist.org/"
[2019-02-24T09:01:35.269Z] Fetched (#1) "https://agilenihilist.org/" with code 301
[2019-02-24T09:01:35.272Z] Request (#2) "https://www.agilenihilist.org/"
[2019-02-24T09:01:35.559Z] Fetched (#2) "https://www.agilenihilist.org/" with code 200
[2019-02-24T09:01:35.622Z] Request (#3) "https://www.agilenihilist.org/cards/1"
[2019-02-24T09:01:35.704Z] Fetched (#3) "https://www.agilenihilist.org/cards/1" with code 200
[2019-02-24T09:01:35.736Z] Request (#4) "https://www.agilenihilist.org/cards/all?tag=agile_team"
[2019-02-24T09:01:35.737Z] Request (#5) "https://www.agilenihilist.org/cards/all?tag=processes"
[2019-02-24T09:01:35.738Z] Request (#6) "https://www.agilenihilist.org/cards/2"
[2019-02-24T09:01:35.791Z] Fetched (#6) "https://www.agilenihilist.org/cards/2" with code 200
[2019-02-24T09:01:35.812Z] Fetched (#4) "https://www.agilenihilist.org/cards/all?tag=agile_team" with code 200
[2019-02-24T09:01:35.820Z] Fetched (#5) "https://www.agilenihilist.org/cards/all?tag=processes" with code 200
[2019-02-24T09:01:35.830Z] Finish crawl "https://agilenihilist.org" on count 6
[2019-02-24T09:01:35.830Z] Save the result in "result.json"
```

The stdout log contains events about starting and finishing the crawl, sending requests and fetching responses.

And the result.json file looks like:
```json
{
  "pages": [
    { "id": 1, "url": "https://agilenihilist.org/", "code": 301 },
    { "id": 2, "url": "https://www.agilenihilist.org/", "code": 200 },
    { "id": 3, "url": "https://www.agilenihilist.org/cards/1", "code": 200 },
    { "id": 4, "url": "https://www.agilenihilist.org/cards/all?tag=agile_team", "code": 200 },
    { "id": 5, "url": "https://www.agilenihilist.org/cards/all?tag=processes", "code": 200 },
    { "id": 6, "url": "https://www.agilenihilist.org/cards/2", "code": 200 }
  ],
  "links": [
    { "from": 1, "to": 2 },
    { "from": 2, "to": 3 },
    { "from": 3, "to": 2 },
    { "from": 3, "to": 4 },
    { "from": 3, "to": 5 },
    { "from": 3, "to": 6 },
    { "from": 4, "to": 2 },
    { "from": 4, "to": 3 },
    { "from": 5, "to": 2 },
    { "from": 5, "to": 3 },
    { "from": 6, "to": 2 },
    { "from": 6, "to": 3 },
    { "from": 6, "to": 3 }
  ],
  "count": 6,
  "fin": false
}
```

As you can see the result consists of:
- *pages* `{Array<object>}` - The list of all fetched pages: unique id, URL and HTTP Status Code.
- *links* `{Array<object>}` - The list of all pages' references: from id (source) and to id (target).
- *count* `{number}` - Total number of fetched pages during the crawl.
- *fin* `{boolean}` - The flag is TRUE if the crawl has finished before the limit reached: it means that all pages of the website have been fetched during the crawl.
