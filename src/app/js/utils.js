function query(selector) {
    return document.querySelector(selector)
}

function queryAll(selector) {
    return document.querySelectorAll(selector)
}

export let q = query
export let qq = queryAll

export function documentReady(callback) {
    document.addEventListener('DOMContentLoaded', callback)
}

export function windowResize(callback) {
    window.addEventListener('resize', callback);
}

export function addCss(... cssLibs) {
    cssLibs.forEach(css => {
        const style = document.createElement('style')
        style.textContent = css
        q('head').appendChild(style)
    })
}