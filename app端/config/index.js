const isDev = true

const config = {
    dev: {
        baseUrl: 'http://localhost:8000'
    },
    prod: {
        baseUrl: 'https://your-production-domain.com'
    },
    lan: {
        baseUrl: 'http://10.216.80.152:8000'
    }
}

export default {
    baseUrl: isDev ? config.lan.baseUrl : config.prod.baseUrl,

    setBaseUrl(url) {
        this.baseUrl = url
    }
}
