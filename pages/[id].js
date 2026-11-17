import Head from 'next/head';
import Layout from '../components/layout';
import { getAllIds, getData } from '../lib/data';
import utilStyles from '../styles/utils.module.css';

export async function getStaticProps({ params }) {
  const itemData = await getData(params.id);
  return {
    props: {
      itemData,
    },
  };
}

export async function getStaticPaths() {
  const paths = await getAllIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Entry({ itemData }) {
  return (
    <Layout>
      <Head>
        <title>{itemData.post_title}</title>
      </Head>
      <article>
        <h2>{itemData.post_title}</h2>
        <p className={utilStyles.lightText}>
          {itemData.author_name} · {itemData.post_date}
          {itemData.categories && itemData.categories.length > 0 && (
            <> · {itemData.categories.join(', ')}</>
          )}
        </p>
        <div dangerouslySetInnerHTML={{ __html: itemData.post_content }} />
        <p>
          <a href={itemData.permalink} target="_blank" rel="noreferrer">
            View on WordPress
          </a>
        </p>
      </article>
    </Layout>
  );
}
