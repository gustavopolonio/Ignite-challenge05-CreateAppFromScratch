import { GetStaticPaths, GetStaticProps } from 'next';
import { createClient } from '../../services/prismic';

import { FiCalendar } from 'react-icons/fi'
import { FiUser } from 'react-icons/fi'
import { FiClock } from 'react-icons/fi'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {

  return (
    <main className={styles.container}>
      <img src="/mainBanner.png" alt="main banner" />

      <article className={styles.articleContent}>
        <h1>Criando um app CRA do zero</h1>

        <div className={styles.postDetails}>
          <time>
            <FiCalendar />
            15 Mar 2022
          </time>
          <div>
            <FiUser />
            Gustavo Polonio
          </div>
          <div>
            <FiClock />
            4 min
          </div>
        </div>

        <div className={styles.textArea}>
          <h2>Proin et varius</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.

            Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit tellus. Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.

            Ut venenatis mauris vel libero pretium, et pretium ligula faucibus. Morbi nibh felis, elementum a posuere et, vulputate et erat. Nam venenatis.
          </p>

          <h2>Cras laoreet mi</h2>
          <p>
            Nulla auctor sit amet quam vitae commodo. Sed risus justo, vulputate quis neque eget, dictum sodales sem. In eget felis finibus, mattis magna a, efficitur ex. Curabitur vitae justo consequat sapien gravida auctor a non risus. Sed malesuada mauris nec orci congue, interdum efficitur urna dignissim. Vivamus cursus elit sem, vel facilisis nulla pretium consectetur. Nunc congue.
          </p>
        </div>
      </article>
    </main>
  )
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params
  // console.log('slug', typeof(slug))

  const prismic = createClient();
  const response = await prismic.getByUID('Posts', slug.toString())

  console.log('response', response)

  return {
    props: {}
  }
};