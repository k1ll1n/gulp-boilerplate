let paths = {
    html: {
        input: 'src/app/pages/*.pug',
        output: 'build/',
        watch: ['src/app/pages/*.pug', 'src/app/layout/**/*.pug']
    },
    styles: {
        input: ['src/app/css/main.styl', 'src/app/css/main_screen.styl'],
        output: 'build/css/',
        vendor: {
            input: 'src/app/css/vendor/*.css',
            output: 'build/css/vendor/',
        },
        watch: ['src/app/css/**/*.styl', 'src/app/css/main.styl', 'src/app/css/main_screen.styl']
    },
    js: {
        input: 'src/app/js/*.js',
        output: 'build/js/',
        vendor: {
            input: 'src/app/js/vendor/*.js',
            output: 'build/js/vendor/',
        },
        watch: ['src/app/js/*.js', 'src/app/js/vendor/*.js']
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
    gulpRollup: require('gulp-rollup'),
    terser: require('rollup-plugin-terser'),
    imagemin: require('gulp-imagemin'),
    browserSync: require('browser-sync'),
    rollupStream: require('@rollup/stream'),
    buffer: require('vinyl-buffer'),
    source: require('vinyl-source-stream'),
    commonjs: require('@rollup/plugin-commonjs'),
    nodeResolve: require('@rollup/plugin-node-resolve').nodeResolve,
    scaleImages: require('gulp-scale-images'),
    flatMap: require('flat-map'),
    css: require('rollup-plugin-import-css')
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