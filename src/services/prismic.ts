import * as prismicClient from '@prismicio/client';

export function createClient() {
  const prismic = prismicClient.createClient(process.env.PRISMIC_API_ENDPOINT, {
    // accessToken: process.env.PRISMIC_API_ACCESS_TOKEN
  });

  return prismic;
}
