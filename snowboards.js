//import jsdom from "jsdom";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function getItem(url) {
    const document = (await JSDOM.fromURL(url)).window.document;

    const id = Number(url.split("/")[5].split("-").pop());
    
    let title
    try {
        title = document.querySelector("#variantName").innerHTML
    } catch (error) {
        console.log('Не смог распарсить ' + title)
    }

    let season
        try {
            season = document.querySelector("#variantName").innerHTML.replace('Snowboard', '').trim().split(' ').pop().trim()
        } catch (error) {
            console.log('Не смог распарсить ' + season)
        }


    let brand 
    try {
        brand = document.querySelector(".c-details-box__name span").innerHTML
    } catch (error) {
        console.log('Не смог распарсить '+ brand)
    }
    
    let color
    try {
        color = document.querySelector('.c-family-selector').innerText.split(',').pop().trim()
    } catch (error) {
        console.log('Не смог распарсить ' + color)
    }

    let shape, profile_type, articul, board_lenght, sidecut_radius, contact_length, nose_width, middle_width, tail_width, core_material,
        rider_weight, riding_style, riding_level, rigidity, flex, gender, country, binding, sliding_surface_type, fasteners_distance, eco
    
    async function getAttributes() {

        try {
            shape = document.querySelector('.c-attributes-features__fp-item img').src.split('/')[5].split('.')[0].replace('snowboard-', '')
        } catch (error) {
            console.log('Не смог распарсить ' + shape)
        }
       
        try {
            profile_type = document.querySelector('.c-attributes-features__fp-attributes').children[1].querySelector('img').src.split('/')[5].split('.')[0].split('-').slice(1).join(' ')
        } catch (error) {
            console.log('Не смог распарсить ' + profile_type)
        }

        let params
        try {
            params = document.querySelectorAll('.c-attributes-features__item')
            params.forEach(element => {
                let e = element.innerText.split(':')
                let param = e[0]
                let value = e[1].trim()
                if (param == "Artikelnr.") { articul = value } else articul = ''
                if (param == "Belag") { sliding_surface_type = value } else sliding_surface_type = ''
                if (param == "Länge (cm)") { board_lenght = value } else board_lenght = ''
                if (param == "Kurvenradius") { sidecut_radius = value } else sidecut_radius = ''
                if (param == "Effektive Kantenlänge") { contact_length = value } else contact_length = ''
                if (param == "Nose-Breite") { nose_width = value } else nose_width = ''
                if (param == "Mittelbreite") { middle_width = value } else middle_width = ''
                if (param == "Tail-Breite") { tail_width = value } else tail_width = ''
                if (param == "Kern") { core_material = value } else core_material = ''
                if (param == "Ridergewicht") { rider_weight = value } else rider_weight = ''
                if (param == "Riding Style") { riding_style = value } else riding_style = ''
                if (param == "Riding Level") { riding_level = value } else riding_level = ''
                if (param == "Stiffness") { rigidity = value } else rigidity = ''
                if (param == "Flex") { flex = value } else flex = ''
                if (param == "Für") { gender = value } else gender = ''
                if (param == "Produktionsland") { country = value } else country = ''
                if (param == "Einstiegsart") { binding = value } else binding = ''
                if (param == "Stance") { fasteners_distance = value } else fasteners_distance = ''
                if (param == "Öko") { eco = value } else eco = ''
            });
        } catch (error) {
            console.log('Не смог распарсить ' + params)
        }  
    }

    await getAttributes();
    
    return {
        id,
        title,
        season,
        brand,
        color,
        shape,
        profile_type,
        articul,
        sliding_surface_type,
        board_lenght,
        sidecut_radius,
        contact_length,
        nose_width,
        middle_width,
        tail_width,
        core_material,
        rider_weight,
        riding_style,
        riding_level,
        country,
        rigidity,
        flex,
        gender,
        binding,
        fasteners_distance,
        eco
    }
}


async function getCountPage() {

    const html = await JSDOM.fromURL("https://www.blue-tomato.com/de-DE/products/categories/Snowboard+Shop-00000000--Snowboards-00000001")

    const pages_max = html.window.document.querySelector('.pagerText').innerText.split('/').pop()
    console.log(pages_max)
    
    return Number(pages_max);
}



async function getData(numPage = 1) {

    let result = []
    
    const html = await JSDOM.fromURL("https://www.blue-tomato.com/de-DE/products/categories/Snowboard+Shop-00000000--Snowboards-00000001/?page=" + numPage)

    const itemsHTML = html.window.document.querySelectorAll(".productcell ");

        for (let i = 0; i < itemsHTML.length; i++) {
            const item = itemsHTML[i]
            const link = item.querySelector('.productdesc a').href
            console.log(link)
            
            const image = item.querySelector('.productimage img').src

            let is_sale = false
            const saleHTML = item.querySelector(".sale");
            if (saleHTML) { 
                is_sale = true }
            
            let is_new = false
            const newHTML = item.querySelector(".new")
            if (newHTML) { 
                is_new = true }
    
            let price_value
            let price_currency
    
            const priceHTML = item.querySelector(".price")
            if (priceHTML) {
                const price = priceHTML.innerHTML.trim().split('&nbsp;')
                price_value = Number.parseInt(price[1])
                price_currency = price[0]
            }

            const { id, title, season, brand, color, shape, articul, profile_type, sliding_surface_type, board_lenght, sidecut_radius, middle_width, nose_width, tail_width, contact_length, core_material, rider_weight, riding_style, riding_level, country, rigidity, flex, gender, binding, fasteners_distance, eco } = await getItem(link);

            result.push({ site: 'www.blue-tomato.com', image, link, is_new, is_sale, price_value, price_currency, id, title, season, brand, color, shape, articul, profile_type, sliding_surface_type, board_lenght, sidecut_radius, middle_width, nose_width, tail_width, contact_length, core_material, rider_weight, riding_style, riding_level, country, rigidity, flex, gender, binding, fasteners_distance, eco })
        }

    return result;
}

async function main(flag = false, callback) {
    console.log('Start')
    if (flag) {
        const countPage = await getCountPage();
        for(let i = 0; i < countPage; i++) {
            console.log('page #' + (i + 1))
            const result = (await getData(i + 1).catch(e => []));
            callback(result)
            if(i % 5 == 0){
                await new Promise((resolve) => setTimeout(() => resolve(), 1000 * 100))
           }
        }
    } else {
        callback(await getData());
    }
    console.log('Done')
}

module.exports = main
