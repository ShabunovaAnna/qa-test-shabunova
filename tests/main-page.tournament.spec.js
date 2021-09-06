const puppeteer = require('puppeteer')

const BASE_URL = 'https://qa.prod.eurostavka.ru/'

describe('Главная страница', () => {

    let browser
    let page

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false
        })
        page = await browser.newPage()
    })
    beforeEach(async () => {
        await page.goto(BASE_URL)
    })
    afterAll(async () => {
        await browser.close()
    })

    describe('Главная страница - Основной конкурс', () => {
        it('В блоке отображается заголовок конкурса', async () => {
            expect.assertions(1)
            const blockTitle = await page.$eval('[data-element="main-page-tournament-title"]', el => el.innerText)
            //Вариант записи:
            // const blockTitle = await page.evaluate(() => {
            //     const title = document.querySelector('[data-element="main-page-tournament-title"]')
            //     const titleText = title.innerText
            //     const titleTextMoreThan0 = titleText.length > 0
            //     return titleTextMoreThan0
            // })
            expect(blockTitle.length > 0).toEqual(true)
        })

        // it('По клику на банер осуществляется переход на страницу конкурса', async () => {
        //     expect.assertions(1)
        //     await Promise.all([
        //         page.waitForNavigation()
        //         page.click('[href="/tournaments/avgust-1-nedelya"]')
        //     ])
        //     expect(page.url()).toEqual('https://qa.prod.eurostavka.ru/tournaments/avgust-1-nedelya')


    })

    it('Корректно отображается период конкурса', async () => {
        expect.assertions(2)
        const blockTitle = await page.$eval('[data-element="main-page-tournament-period"] span:nth-child(2)', el => el.innerText)
        expect(blockTitle).toEqual('Период:')

        const tournamentPeriod = await page.$eval('[data-element="main-page-tournament-period"] span:nth-child(3)', el => el.innerText)
        const tournamentPeriodArray = tournamentPeriod.split(' - ')
        const begginAndEndTournament = tournamentPeriodArray.length === 2
        const tournamentDateAndMonthArray = tournamentPeriodArray.map(e => e.split(' '))
        const isTournamentDateCorrect = tournamentDateAndMonthArray.every(el => {
            const date = el[0] < 32
            return date
        })
        const isTournamentMonthCorrect = tournamentDateAndMonthArray.every(el => {
            const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
            const isMonthCorrect = months.includes(el[1])
            return isMonthCorrect
        })
        expect(isTournamentDateCorrect && isTournamentMonthCorrect && begginAndEndTournament).toEqual(true)
    })

    it('Корректно отображается банк конкурса', async () => {
        expect.assertions(2)
        const blockTitle = await page.$eval('[data-element="main-page-tournament-bank"] span:nth-child(2)', el => el.innerText)
        expect(blockTitle).toEqual('Банк:')

        const blockValue = await page.$eval('[data-element="main-page-tournament-bank"] span:nth-child(3)', el => el.innerText)
        expect(blockValue.length > 0).toEqual(true)
    })

    it('Корректно отображается время до начала/окончания конкурса', async () => {
        expect.assertions(2)
        const blockTitleArray = ['До конца:', 'До начала:', 'Завершен:']
        const blockTitle = await page.$eval('[data-element="main-page-tournament-finish-date"] span:nth-child(2)', el => el.innerText)
        const isTitleCorrect = blockTitleArray.includes(blockTitle)
        expect(isTitleCorrect).toEqual(true)


        const time = await page.$eval('[data-element="main-page-tournament-finish-date"] span:nth-child(3)', el => el.innerText)
        const timeArray = time.split(' ')
        const isTimeNumberCorrect = !isNaN(timeArray[0])
        const isTimeWordCorrect = timeArray[1].length > 0
        expect(isTimeNumberCorrect && isTimeWordCorrect).toEqual(true)


        // const time = await page.evaluate(() => {
        //     // const blockTitleArray = ['До конца:', 'До начала:', 'Завершен:']
        //     const blockTitle = document.querySelector('[data-element="main-page-tournament-finish-date"] span:nth-child(2)').innerText
        //     // const isTitleCorrect = blockTitleArray.includes(blockTitle)
        //     // expect(isTitleCorrect).toEqual(true)
        //     const timeText = document.querySelector('[data-element="main-page-tournament-finish-date"] span:nth-child(3)').innerText
        //     const timeArray = timeText.split(' ')
        //     //const isTimeNumberCorrect = !isNaN(timeArray[0])
        //     const timeWordArray = ['дня', 'дней', 'месяц', 'месяцев', 'месяца']
        //     //const isTimeWordCorrect = timeWordArray.includes(timeArray[1])
        //     //const isTimeNumberAndWordCorrect = isTimeNumberCorrect && isTimeWordCorrect
        //     //console.log(isTimeNumberAndWordCorrect)
        //
        //     if (blockTitle === 'До конца:') {
        //         if (timeArray[0] = !isNaN){
        //             if (timeWordArray.includes(timeArray[1])){
        //                 return true
        //             }}
        //
        //     } else {
        //         return false
        //     }
        // })
        // expect(time).toEqual(true)

        // if (blockTitle === 'До начала'){
        //
        // }
        //
        // if (blockTitle === 'Завершен:'){
        //
        // }


    })

    it('По клику на кнопку "Все конкурсы" осуществляется переход на страницу всех конкурсов', async () => {
        expect.assertions(1)
        await Promise.all([
            page.waitForNavigation(),
            page.click('[data-element="main-page-tournament-expand-all"]')
        ])
        expect(page.url()).toEqual('https://qa.prod.eurostavka.ru/tournaments')

    })


})