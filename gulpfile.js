const { paths, plugins, webServer } = require('./gulpconfig')
const {src, dest, watch, task, series} = plugins.gulp
const reload = plugins.browserSync.reload
const env = process.env.GULP_ENV || 'development'

function buildHtml() {
    const html = paths.html
    return src(html.input)
        .pipe(plugins.gulpPug({
            pretty: true,
        }))
        .pipe(dest(html.output))
        .pipe(reload({stream: true}))
}

function buildStyles() {
    const styles = paths.styles
    return src(styles.input)
        .pipe(plugins.gulpStylus())
        .pipe(plugins.gulpPostCss([
            plugins.cssPrefixer({
                cascade: true,
                remove: true
            })
        ]))
        .pipe(dest(styles.output))
        .pipe(plugins.gulpPostCss([
            plugins.cssMinify({
                discardComments: {
                    removeAll: true
                }
            })
        ]))
        .pipe(dest(styles.output))
        .pipe(reload({stream: true}))
}

function buildJs() {
    const js = paths.js
    return src(js.input)
        .pipe(plugins.rollup({
            input: 'src/app/js/app.js',
            output: {
                format: 'iife',
            },
            plugins: [
                plugins.terser.terser()
            ]
        }))
        .pipe(dest('build/js/'))
        .pipe(reload({stream: true}))
}

function collectImages() {
    const im = plugins.imagemin
    return src(paths.images.input)
        .pipe(im([
                im.gifsicle({interlaced: true}),
                im.mozjpeg({progressive: true}),
                im.optipng({optimizationLevel: 1}),
                im.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ],
            {
                verbose: true
            }
        ))
        .pipe(dest(paths.images.output))
        .pipe(reload({stream: true}))
}

function collectFonts() {
    return src(paths.fonts.input)
        .pipe(dest(paths.fonts.output))
        .pipe(reload({stream: true}))
}

function collectVendorJs() {
    return src(paths.js.vendor.input)
        .pipe(dest(paths.js.vendor.output))
        .pipe(reload({stream: true}))
}

function watchFiles() {
    watch([paths.html.input, 'src/app/layout/main.pug'], buildHtml)
    watch(['src/app/css/**/*.styl'], buildStyles)
    watch([paths.js.input, 'src/app/js/vendor/*.js'], buildJs)
    watch([paths.images.input], collectImages)
    watch(paths.fonts.input, collectFonts)
}

task('webserver', done => {
    plugins.browserSync(webServer)
    done()
})

const devBuild = series(buildStyles, /*mergeVendorStyles,*/ buildJs, collectVendorJs, collectImages, collectFonts, buildHtml)
const prodBuild = series(buildStyles, /*mergeVendorStyles,*/ buildJs, collectVendorJs, collectImages, collectFonts, /*collectOthers,*/ buildHtml)

const mode = env === 'development' ? devBuild : prodBuild
const def = env === 'development' ? series(mode, 'webserver', watchFiles) : mode

exports.html = buildHtml
exports.css = buildStyles
exports.js = buildJs
exports.vendorJs = collectVendorJs
exports.images = collectImages
exports.fonts = collectFonts

exports.default = def