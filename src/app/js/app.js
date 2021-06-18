import {q, qq, documentReady, windowResize, addCss} from "./utils";

import 'lazysizes';
//import $ from 'jquery';
import Inputmask from 'inputmask';

import Flickity from 'flickity-imagesloaded'
import flkStyles from 'flickity/dist/flickity.css'
addCss(flkStyles)

documentReady(_ => {
    setAnchors()
    windowResize(_ => {
        setAnchors()
    })

    const elements = qq('.input-phone')
    new Inputmask({'mask': '9 (999) 999-99-99'}).mask(elements)

    var flkty = new Flickity( '.slider', {
        cellAlign: 'left',
        contain: true,
        imagesLoaded: true
    });
})

function setAnchors() {

    qq('.con img').forEach(img => {
        const w = img.clientWidth
        const h = img.clientHeight

        if (h === 0) setTimeout(setAnchors, 10)

        qq('.img-anchor').forEach(anchor => {

            const top = getFloatValue(anchor,'top-position')
            const left = getFloatValue(anchor,'left-position')

            const topPercent = top * (h / 100)
            const leftPercent = left * (w / 100)

            anchor.style.top = `${topPercent}px`
            anchor.style.left = `${leftPercent}px`
        })

        function getFloatValue(el, property) {
            return parseFloat(el.getAttribute(property))
        }
    })
}