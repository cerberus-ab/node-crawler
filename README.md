# The simplest crawler on node.js
Crawls a website with starting from a passed URL and provides information about fetched pages and their internal linking map. It uses native node.js http/https clients for sending requests and [JSDOM](https://github.com/jsdom/jsdom) for parsing and extracting new links from responded content.
 
The project is being developed only as a prototype and a testing tool. For now it doesn't respect *robots.txt* file or *nofollow* link's attribute, doesn't pay attention to *sitemap.xml* and isn't smart and scalable enough for production at all. So use it (if you want) only on your websites and get the fun.

# Before start
Make sure you have [node.js](https://nodejs.org/en/download/) v6 or later.  
After cloning the repository install dependencies using npm:
```bash
npm i
```
