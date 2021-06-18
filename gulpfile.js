const { paths, plugins, webServer } = require('./gulpconfig')
const {src, dest, watch, task, series} = plugins.gulp
const reload = plugins.browserSync.reload
const env = process.env.GULP_ENV || 'development'

function buildHtml() {
    const html = paths.html
    return src(html.input)
        .pipe(plugins.gulpPug({
            pretty: true,
            locals: {
                env: process.env
            }
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

function collectVendorCss() {
    return src(paths.styles.vendor.input)
        .pipe(dest(paths.styles.vendor.output))
        .pipe(plugins.gulpPostCss([
            plugins.cssMinify({
                discardComments: {
                    removeAll: true
                }
            })
        ]))
        .pipe(dest(paths.styles.vendor.output))
        .pipe(reload({stream: true}))
}

let cache;
task('buildJs', () => {
    const options = {
        input: 'src/app/js/app.js',
        plugins: [
            plugins.terser.terser(),
            plugins.commonjs({
                include: [ "node_modules/**" ],
                ignoreGlobal: false,
                sourceMap: false
            }),

            plugins.nodeResolve({
                jsnext: true,
                main: false,
                browser: true
            }),
            plugins.css()
        ],
        output: {
            file: 'build/js/app.js',
            format: 'iife',
            name: 'app',
            sourcemap: false
        }};

    return plugins.rollupStream(options)
        .on('bundle', (bundle) => {
            cache = bundle;
        })
        .pipe(plugins.source('app.js'))
        .pipe(plugins.buffer())
        .pipe(dest('build/js/'))
        .pipe(reload({stream: true}))
});

function collectVendorJs() {
    return src(paths.js.vendor.input)
        .pipe(dest(paths.js.vendor.output))
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

function croppingImages() {
    const variants = (file, done) => {
        const sizes = [1980, 1440, 1280, 1024, 768, 540, 320]
        const files = []
        sizes.forEach(size => {
            const tmpFile = file.clone()
            tmpFile.scale = {maxWidth: size, format: 'jpg'}
            files.push(tmpFile)
        })

        done(null, files)
    }
    return src('src/app/img/**/*.{jpeg,jpg}')
        .pipe(plugins.flatMap.default(variants))
        .pipe(plugins.scaleImages())
        .pipe(dest('build/img/adaptive/'))
        .pipe(reload({stream: true}))
}

function collectFonts() {
    return src(paths.fonts.input)
        .pipe(dest(paths.fonts.output))
        .pipe(reload({stream: true}))
}

function watchFiles() {
    watch(paths.html.watch, buildHtml)
    watch(paths.styles.watch, buildStyles)
    watch(paths.js.watch, series('buildJs'))
    watch([paths.images.input], collectImages)
    watch(paths.fonts.input, collectFonts)
}

task('webserver', done => {
    plugins.browserSync(webServer)
    done()
})

const devBuild = series(buildStyles, collectVendorCss, 'buildJs', collectVendorJs, collectImages, croppingImages, collectFonts, buildHtml)
const prodBuild = series(buildStyles, collectVendorCss, 'buildJs', collectVendorJs, collectImages, croppingImages, collectFonts, /*collectOthers,*/ buildHtml)

const mode = env === 'development' ? devBuild : prodBuild
const def = env === 'development' ? series(mode, 'webserver', watchFiles) : mode

exports.html = buildHtml
exports.css = buildStyles
exports.vendorCss = collectVendorCss
exports.croppingImages = croppingImages
exports.vendorJs = collectVendorJs
exports.images = collectImages
exports.fonts = collectFonts

exports.default = def