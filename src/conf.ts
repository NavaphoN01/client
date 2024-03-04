const isProd = process.env.NODE_ENV === 'production';

const conf = {
    isProd,
    apiPrefix: isProd? 'https://godzilla-01.as.r.appspot.com' : 'https://godzilla-01.as.r.appspot.com'
}

export default conf;

