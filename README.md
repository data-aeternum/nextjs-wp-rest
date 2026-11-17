# nextjs-wp-rest — CS55.13 Assignment 12

Next phase of my Week 4 Next.js blog ([nextjs-blog](https://github.com/data-aeternum/nextjs-blog)).
The home page and dynamic route now render posts delivered as JSON by a custom
REST API endpoint registered in a WordPress child theme on Pantheon.

- WordPress site: https://dev-full-stack-project-awesome.pantheonsite.io/
- Custom endpoint: https://dev-full-stack-project-awesome.pantheonsite.io/wp-json/twentytwentyfive-child/v1/latest-posts/
  (append a category ID, e.g. `/latest-posts/3`, to filter by category)
- Child theme source: `wordpress/twentytwentyfive-child/` (`style.css` + `functions.php`)
- Data layer: `lib/data.js` uses the Node `got` module (`getAllIds`, `getSortedList`, `getData`)
  instead of reading a local JSON file with `fs`
- Pages: `pages/index.js` (post list) and `pages/[id].js` (one post per dynamic route)

```bash
npm install
npm run dev
```
