// Import the shared page metadata component.
import Head from 'next/head';
// Import the client-side navigation component.
import Link from 'next/link';
// Import the shared site layout and its title.
import Layout, { siteTitle } from '../components/layout';
// Import the data function that reads the WordPress custom REST API endpoint.
import { getSortedList } from '../lib/data';
// Import reusable typography styles.
import utilStyles from '../styles/utils.module.css';
// Import page-specific homepage styles.
import styles from '../styles/Home.module.css';

// Run at build time: fetch the sorted post list from WordPress via GOT.
export async function getStaticProps() {
  const allData = await getSortedList();
  return {
    props: {
      allData,
    },
  };
}

// Render the homepage content.
export default function Home({ allData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${styles.intro}`}>
        <p>[Hello, I'm Tad MacPherson, wishing I was in Maui right now!]</p>
        <p>
          The posts below are delivered as JSON by a custom REST API endpoint
          in my{' '}
          <a href="https://dev-full-stack-project-awesome.pantheonsite.io/wp-json/twentytwentyfive-child/v1/latest-posts/">
            WordPress child theme
          </a>
          .
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>WordPress Posts</h2>
        <ul className={utilStyles.list}>
          {allData.map(({ id, name, date, author, excerpt }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/${id}`}>{name}</Link>
              <br />
              <small className={utilStyles.lightText}>
                {author} · {date}
              </small>
              <p>{excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
