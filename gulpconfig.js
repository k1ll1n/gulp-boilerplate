let paths = {
    html: {
        input: 'src/app/pages/*.pug',
        output: 'build/'
    },
    styles: {
        input: 'src/app/css/main.styl',
        output: 'build/css/'
    },
    js: {
        input: 'src/app/js/*.js',
        output: 'build/js/',
        vendor: {
            input: 'src/app/js/vendor/*.js',
            output: 'build/js/vendor/',
        }
    },
    images: {
        input: 'src/app/img/**/*.{jpeg,jpg,png,tiff,gif,bmp,svg,webp}',
        output: 'build/img/'
    },
    fonts: {
        input: 'src/app/fonts/*.{eot,ttf,woff,woff2}',
        output: 'build/css/fonts/'
    },
}
let plugins = {
    gulp: require('gulp'),
    pug: require('pug'),
    gulpPug: require('gulp-pug'),
    stylus: require('stylus'),
    gulpStylus: require('gulp-stylus'),
    gulpPostCss: require('gulp-postcss'),
    cssPrefixer: require('autoprefixer'),
    cssMinify: require('cssnano'),
    rollup: require('gulp-rollup'),
    terser: require('rollup-plugin-terser'),
    imagemin: require('gulp-imagemin'),
    browserSync: require('browser-sync'),
}

let webServer = {
    server: {
        baseDir: './build'
    },
    tunnel: false,
    host: 'localhost',
    port: 8000,
    logPrefix: 'by_k1ll1n'
}

module.exports = { paths, plugins, webServer }