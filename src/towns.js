/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise( async (resolve, reject) => {
        try {
            let response = await fetch(url);
            let towns = await response.json();  

            loadingBlock.style = 'display: none;';
            filterBlock.style = 'display: initial;';

            resolve(towns.sort((a, b) => a.name > b.name ? 1 : -1));
        } catch (error) {
            reject();
        }
    });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    let fullStr = full.toLowerCase(),
        chunkStr = chunk.toLowerCase();

    return fullStr.indexOf(chunkStr) !== -1 ? true : false;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let citiesArr = []; // полученный массив городов

// ----------------------
// Ошибка загрузки данных
// ----------------------
let retryButton = document.createElement('button'); // кнопка "Повторить"

retryButton.innerText = 'Повторить';

retryButton.addEventListener('click', e => {
    homeworkContainer.removeChild(retryButton);
    loadTowns()
        .then((cities) => citiesArr = cities)
        .catch(() => retryRequest());
});

function retryRequest() {
    loadingBlock.innerText = 'Не удалось загрузить города';
    homeworkContainer.append(retryButton);
}

loadTowns()
    .then((cities) => citiesArr = cities)
    .catch(() => retryRequest());

filterResult.style = `
    display: none;
    width: 50%;
    background-color: white;
    border: 1px solid black;
`;

// ----------------------------------------------
// это обработчик нажатия кливиш в текстовом поле
// ----------------------------------------------
filterInput.addEventListener('keyup', function() {
    // очистим содержимое filterResult
    filterResult.innerHTML = '';

    // если в строке нет ничего, спрячем filterResult
    if (filterInput.value.length === 0) {
        filterResult.style.display = 'none';
    } else {

        let citiesSimilar = citiesArr.filter(item => isMatching(item.name, filterInput.value));

        // если есть совпадения
        if (citiesSimilar.length > 0) {
            // покажем список сматченных городов
            filterResult.style.display = 'block';
            citiesSimilar.forEach( item => {
                let p = document.createElement('p');

                p.style = `
                    margin-top: 0.2em;
                    margin-bottom: 0.2em;
                `;
                p.innerText = item.name;

                filterResult.append(p);
            });
        } else {
          // иначе спрячем filterResult
          filterResult.style.display = 'none';
        }
    }
});

export {
    loadTowns,
    isMatching
};
