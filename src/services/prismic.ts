// import * as prismicClient from '@prismicio/client';

// export function createClient() {
//   const prismic = prismicClient.createClient(process.env.PRISMIC_API_ENDPOINT, {
//     // accessToken: process.env.PRISMIC_API_ACCESS_TOKEN
//   });

//   return prismic;
// }

import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT, {
    req,
    // accessToken: process.env.PRISMIC_API_ACCESS_TOKEN,
  });

  return prismic;
}

