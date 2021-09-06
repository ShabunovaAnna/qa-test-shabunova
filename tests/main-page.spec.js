const puppeteer = require('puppeteer') // с помощью него можно писать роботы, управление в браузере

const BASE_URL = 'https://qa.prod.eurostavka.ru/' // стартовый адрес, к которому обращаемся

describe('Главная страница', () => {

    let browser
    let page

    beforeAll(async () => { // ниже в функции прописываем, что перед всеми тестами ждём, пока запустится браузер
        browser = await puppeteer.launch({
            headless: false // headless - это такой режим работы браузера хром. он потребляет меньше памяти и работает по-быстрее. И она там убирает всякие пользовательские интерфейсы
        })
        page = await browser.newPage() // а после запуска браузера ждём, когда откроется новая пустая страница (пока без url)
    })
    beforeEach(async () => { // перед каждым тестом ждём переход на стартовый адрес, указанный выше
        await page.goto(BASE_URL)
    })
    afterAll(async () => { // после всех тестов закрываем окно браузера
        // await browser.close()
    })

    describe('Главная страница - Матчи дня', () => {
        it('Название виджета должно быть равно "Матчи дня"', async () => {
            expect.assertions(1) // какое количество ожидаемых результатов должно быть
            const blockTitle = await page.$eval('[data-element="top-matches-slider-wrapper"] div div span', el => el.innerText) //$eval - говорит выполни в консоли браузера следующую операцию, далее вставляется селектор и какой элемент нужен
            expect(blockTitle).toEqual('Матчи дня') // expect - ожидаемый результат, toEqual - чему равен
        })

        it('В виджете "Матчи дня" при нажатии на кнопку "Все матчи" выполняется переход на страницу топ-матчей', async () => {
            expect.assertions(1)
            await Promise.all([ // Promise.all - чтобы не писать несколько await, можно объединить в массив. Последовательность функций здесь не имеет значения
                page.waitForNavigation(), // waitForNavigation - это метод который заставляет код ждать момента, когда произойдет навигация. Если навигация не произойдет в течение работы теста ( 5 секунд по умолчанию на каждый), то тест упаде
                page.click('[data-element="all-matches-button"]') //нажать на кнопку, указываем селектор
            ])
            expect(page.url()).toEqual('https://qa.prod.eurostavka.ru/matches/top') //проверка url, вариант записи ожидаемого URL '${BASE_URL}/matches/top'
        })
        it('В каждой карточке есть название страны', async () => {
            expect.assertions(1)
            const countryTitlesExist = await page.evaluate(() => { //говорим, что ЭТО нужно сделать в браузере
                const elements = document.querySelectorAll('[data-element="top-matches-slider-championship-country"]') // говорим по селектору найти в браузере элементы
                const elementsArray = Array.from(elements) // преобразовываем массив браузера из найденных элементов в понятный нам формат, по сути создаем массив
                const result = elementsArray.every(element => element.innerText.length > 0) // можно делать через map, но тогда в 2 шага, то есть сначала преобразовываем переменную через map, а потом через every сравниваем. every не создает новый массив, а что-то делает с элементами текущего
                return result
            })
            expect(countryTitlesExist).toEqual(true)
        })

        // Перебирающие методы с массивами:
        // .forEach - для перебора массива. Просто выводим элементы, не преобразовываем
        // .map - для трансформации массива в массив; модификация элементов
        // .every - для проверки массива. Не модифицируется элемент, а проверяется. Проходят ли ВСЕ элементы проверку
        // .some - для проверки массива. Не модифицируется элемент, а проверяется. Проходит ли ХОТЯ БЫ N ЧИСЛО элементов проверку
        // .filter
        // .reduce / .reduceRight

        it('В каждой карточке есть название чемпионата', async () => {
            expect.assertions(1)
            const champTitlesExist = await page.evaluate(() => {
                const champ = document.querySelectorAll('[data-element="top-matches-slider-championship-title"]')
                const champArray = Array.from(champ)
                const result = champArray.every(element => element.innerText.length > 0)
                return result
            })
            expect(champTitlesExist).toEqual(true)
        })
        it('В каждой карточке отображаются оппоненты и разделены дефисом', async () => {
            expect.assertions(1)
            const titles = await page.evaluate(() => { //
                const titlesFromBlocks = document.querySelectorAll('[data-element="top-matches-slider-slide"] a div div h4')
                const titlesFromBlocksArray = Array.from(titlesFromBlocks)
                const result = titlesFromBlocksArray.map(element => element.innerText)
                return result;
            })
            const isEveryTitleCorrect = titles.every(title => {
                const teams = title.split(' - ') // метод split используется для разделения строки на массив подстрок, метод split возвращает новый массив, метод split не изменяет исходную строку.
                const isTeamsCountToEqual2 = teams.length === 2
                const isEveryTeamHasLengthMoreThan0 = teams.every(team => {
                        return team.length > 0;
                    }
                )
                return isTeamsCountToEqual2 && isEveryTeamHasLengthMoreThan0; // && - оператор И, В традиционном программировании И возвращает true, если оба аргумента истинны, а иначе – false
            })
            expect(isEveryTitleCorrect).toEqual(true)
        })
        it('В блоке "Матчи дня" каждый кэф имеет вид (буквы) и значение (цифры) кэфа', async () => {
            expect.assertions(1)
            const elements = await page.evaluate(() => {
                const result = [] // создали массив, который будем заполнять
                const bets = document.querySelectorAll('[data-element="bet"]')
                const betsArray = Array.from(bets)
                betsArray.forEach((bet) => { // в амссиве betsArray обращаемся ко всем элементам bet
                    const label = bet.querySelector('span:nth-child(1)').innerText // nth-child - какой по очередности span нужно взять
                    const coefficient = Number(bet.querySelector('span:nth-child(2)').innerText) // Number - преобразует в число, возможно потом нужно будет делать операции с ним
                    const betResult = [label, coefficient]
                    result.push(betResult) // закидываем полученные значения в ранее созданный массив
                })
                return result
            })
            const checkEveryBetIsCorrect = elements.every(data => {
                const label = data[0] // переменная задана для наглядности, можно сразу data[0] вписывать в isLabelCorrect
                const coefficient = data[1] // то же самое, что с предыдущей переменной
                const isLabelCorrect = label.length > 0
                const isCoeffCorrect = !isNaN(coefficient) // NaN - не числовое значение, проверяем, что не равно не числу, то есть равно числу
                return isLabelCorrect && isCoeffCorrect
            })
            expect(checkEveryBetIsCorrect).toEqual(true)
        })
        it('В блоке "Матчи дня" в каждой карточке отображается дата игры', async () => {

            expect.assertions(2)
            const gameDate = await page.evaluate(() => {
                const dateFromBlocks = document.querySelectorAll('[data-element="top-matches-slider-match-date"]')
                const dateFromBlocksArray = Array.from(dateFromBlocks)
                const dateFromBlocksText = dateFromBlocksArray.map(e => e.innerText) // такая же запись это и след строки будет: const dateFromBlocksText = dateFromBlocksArray.map ( e => {return e.innerText}) return dateFromBlocksText
                return dateFromBlocksText
            })

           const arrayLength = gameDate.length


           expect(arrayLength).toBeGreaterThan(0)
            // вариант записи:
            // expect(gameDate.length > 0).toEqual(true)
            // либо expect(gameDate.length > 0).toBeTruthy()
            // либо можно задать переменную со сравнением и потом обычный ожидаемый результат

            const isEveryDateTimeCorrect = gameDate.every(element => {
              //  const isLengthMoreThan0 = element.length > 0
                const elementStructure = element.split(' ')
                if (elementStructure.length === 1) {
                    if (elementStructure[0].length > 0) {
                        return true
                    } else {
                        return false
                    }

                }
                if (elementStructure.length > 1) {
                    const isDateCorrect = elementStructure[0] <= 31 //true/false
                    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
                    const isMonthCorrect = months.includes(elementStructure[1]) // true/false
                    const timeArray = elementStructure[2].split(':')
                 //   console.log(timeArray)
                    const isTimeCorrect =  timeArray[0] < 24 && timeArray[1] < 60
                    const isAllCorrect = isDateCorrect && isMonthCorrect && isTimeCorrect
                    return isAllCorrect
                } else {
                    return false
                }

            })
            expect(isEveryDateTimeCorrect).toEqual(true)
        })
        it('Не залогиненный пользователь кликает по кэфу в блоке "Матчи дня" - открывается купон', async () => {
            expect.assertions(1)
            await page.evaluate(() => {
                document.querySelector('[data-element="bet"]').click() // click - говорим нажать на выбранный селектор
            })
            await page.waitForSelector('[data-element="coupon"]', {visible: true})
            // снова пишем await, потому что первая функция закончилась, а сейчас нужо снова выполнять действия в браузере
            // waitForSelector - говорим, что нужно дождаться пока элемент появится в разметке
            // - а также станет визуально отображаться
            expect(true).toEqual(true)
        })
        it('При нажатии на кнопку "Все новости" происходит смена URL', async () => {
            expect.assertions(1)
//             await Promise.all([
//                 page.waitForNavigation(),
//             ])
            await Promise.all(  [ //Promise.all позволяет коду продолжиться только после того, как выполнятся оба события независимо от их последовательности
                page.waitForNavigation(), //метод который заставляет код ждать момента, когда произойдет навигация.
                page.click('[data-element="fast-news-show-more-btn"] button')
            ])
            await page.waitForSelector('[data-element="fast-news-show-more-btn"]', {visible: true})
            await page.click('[data-element="fast-news-show-more-btn"] a')
            expect(page.url()).toEqual('https://eurostavka.ru/news')
        })
    })


})