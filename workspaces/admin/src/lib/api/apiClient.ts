import ky from 'ky';

const createKyInstance = () => {
  const instance = ky.create({
    credentials: 'include',
    prefixUrl: process.env['API_URL'] || '/',
    // 10 seconds timeout
    retry: {
      limit: 2,
      methods: ['get', 'post'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    timeout: 10000,
  });

  return instance;
};

export const apiClient = createKyInstance();
