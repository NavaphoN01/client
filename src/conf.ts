const isProd = process.env.NODE_ENV === 'production';

const conf = {
    isProd,
    apiPrefix: isProd? 'https://godzilla-02.as.r.appspot.com' : 'https://godzilla-02.as.r.appspot.com'
}

export default conf;

