// lib/data.js
// Retrieves post data from the custom WordPress REST API endpoint
// (registered in the Twenty Twenty-Five child theme's functions.php)
// using the Node GOT module instead of reading a local JSON file with FS.

import got from 'got';

const dataURL =
  'https://dev-full-stack-project-awesome.pantheonsite.io/wp-json/twentytwentyfive-child/v1/latest-posts/';

// Fetch the JSON array of posts from WordPress.
async function fetchPosts() {
  const jsonString = await got(dataURL);
  return JSON.parse(jsonString.body);
}

// Used by getStaticPaths in pages/[id].js
export async function getAllIds() {
  const jsonObj = await fetchPosts();
  return jsonObj.map((item) => {
    return {
      params: {
        id: item.ID.toString(),
      },
    };
  });
}

// Used by getStaticProps in pages/index.js
export async function getSortedList() {
  const jsonObj = await fetchPosts();

  jsonObj.sort(function (a, b) {
    return a.post_title.localeCompare(b.post_title);
  });

  return jsonObj.map((item) => {
    return {
      id: item.ID.toString(),
      name: item.post_title,
      date: item.post_date,
      author: item.author_name,
      excerpt: item.excerpt,
    };
  });
}

// Used by getStaticProps in pages/[id].js
export async function getData(idRequested) {
  const jsonObj = await fetchPosts();

  const objMatch = jsonObj.filter((obj) => {
    return obj.ID.toString() === idRequested;
  });

  let objReturned;
  if (objMatch.length > 0) {
    objReturned = objMatch[0];
  } else {
    objReturned = {};
  }

  return objReturned;
}
