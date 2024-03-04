const isProd = process.env.NODE_ENV === 'production';

const conf = {
    isProd,
    apiPrefix: isProd? 'https://test-deploy-414415.as.r.appspot.com/' : 'http://localhost:1337'
}

export default conf;

