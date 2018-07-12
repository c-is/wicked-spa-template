import { createClient } from 'contentful';

let client;

export function initClient(spaceId, token) {
  client = createClient({
    space: spaceId,
    accessToken: token,
  });
  return client;
}

export function getClient() {
  return client;
}
