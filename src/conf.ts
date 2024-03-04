const isProd = process.env.NODE_ENV === 'production';

const conf = {
    isProd,
    apiPrefix: isProd? 'http://localhost:1337' : 'https://test-deploy-414415.as.r.appspot.com/'
}

export default conf;

