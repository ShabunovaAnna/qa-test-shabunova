// const name = 'Андрей'
// let name = 'Артем'
// const ade = 16
// const sum = age + 12
//
// const booleanValue = 9 < 6 + 4
// console.log (booleanValue)
// const pet = 'dfghj'
// if (pet === 'собака'){
//     console.log('Погладить')
// }
// else if (pet === 'кошка'){
// console.log('покормить')
// }
// else {console.log('Нужно животное')
// }
// const teams = {
//     'Россия': {
//         footbal: {
//             Спартак: 1,
//             Динамо: 2
//         }
//     },
//     'Беларусь': 'Шахтер'
// }
//
// console.log(teams)
// const pet1 = 'собака'
// const pet2 = 'кошка'
// const pet3 = 'енот'
//
// const zoo = [
//     pet1,
//     pet2,
//     pet1,
//     pet3,
//     pet2,
//     pet1,
//     pet3,
//     pet1,
//     pet3
// ]

// zoo.forEach(
//     (e) => {
//         if (e.length <= 4) {
//     console.log('Маленькое животное: '+e)}
//         else {console.log('Большое животное: '+e)}
//     }
// )

// const newZoo = zoo.map (
//      (e) => {
//          let newName;
//
//          if (e.length <= 4) {
//              newName = ('Маленькое животное: '+e)
//          }
//          else {
//              newName = ('Большое животное: '+e)}
//          return newName
//      }
//  )
// console.log(newZoo)

// setTimeout - выводится значение в функции и через тайаут следующее значение

// setTimeout ( () => {
//         console.log ('первый')
//     }, 2000
// )
// console.log ('второй')

// async function - асинхронная функция
// await - только в async functions, говорит пока не отработает функция, дальше не идём, ничё не выводим, ждём

// (async function () {
// await new Promise ( e => setTimeout ( () => {
//     console.log ('первый')
//     e()
//     }, 2000
// ))
// console.log ('второй')
// })()