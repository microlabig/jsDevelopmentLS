/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

// --------------------------------------------------------------------------------------------------
// функция считывает все куки и возвращает объект вида {key1:value1, key2:value2, ..., keyN: valueN}
// --------------------------------------------------------------------------------------------------
function getCookie() {
    return document.cookie.split('; ').reduce((prev, curr) => {
        let [name, value] = curr.split('=');

        prev[decodeURIComponent(name)] = decodeURIComponent(value);

        return prev;
    }, {});
}

// -----------------------------------------------
// функция проверки подстроки chunk в строке full
// -----------------------------------------------
function isMatching(full, chunk) {
    let fullStr = full.toLowerCase(),
        chunkStr = chunk.toLowerCase();

    return fullStr.indexOf(chunkStr) !== -1 ? true : false;
}

// ---------------------------------------------------------------------------------------------------
// функция возвращает true - если значение фильтра пусто или есть соответствие какому-либо имени куки
// и false - в противном случае
// ---------------------------------------------------------------------------------------------------
function isFilterNameMatched(cookies, filterValue) {
    if (!filterValue) {
        return true;
    } 
    for (let cookie in cookies) {
        if (isMatching(cookie, filterValue) || isMatching(cookies[cookie], filterValue)) {
            return true;
        }
    }

    return false;
}

// ---------------------------------------------------------------------------
// ф-ия добавления куки с именем cookieName и значением cookieValue в таблицу
// ---------------------------------------------------------------------------
function addCookieInTable(cookieName, cookieValue) {
    let rowTR = document.createElement('tr'),
        cellTH = document.createElement('th'),
        buttonDelete = document.createElement('button');

    buttonDelete.innerText = 'УДАЛИТЬ';

    buttonDelete.addEventListener('click', () => {
        listTable.removeChild(rowTR);                
        document.cookie = `${encodeURIComponent(cookieName)}=''; max-age=-1`;
    }, false);

    rowTR.innerHTML = `
        <th>${cookieName}</th>
        <th>${cookieValue}</th>
    `;

    cellTH.appendChild(buttonDelete);
    rowTR.appendChild(cellTH);

    listTable.appendChild(rowTR);
}

// ------------------------------------------------
// функция добавляющая куки в таблицу (по фильтру)
// ------------------------------------------------
function checkFilterAddCookie() {
    let filterValue = filterNameInput.value,
        cookies = getCookie();

    listTable.innerHTML = ''; // очистим таблицу

    for (let cookie in cookies) {
        if (isMatching(cookie, filterValue) || isMatching(cookies[cookie], filterValue)) {
            addCookieInTable(cookie, cookies[cookie]);
        }
    }
}

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

checkFilterAddCookie(); // отобразим все куки (т.к. поле фильтра пустое)

// ------------------------------------------------
// отобразим куки, равные значению значению фильтра
// ------------------------------------------------
filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    checkFilterAddCookie();
});

// -------------------------------------------------------------
// добавим куки в браузер и таблицу (если удовлетворяет фильтру)
// -------------------------------------------------------------
addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    let cookieName = addNameInput.value,
        cookieValue = addValueInput.value,
        filterValue = filterNameInput.value,
        cookies = getCookie();

    // добавить/обновить куки в браузер
    if (cookieName && cookieValue) {
        document.cookie = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);

        if (isFilterNameMatched(cookies, filterValue)) {
            // обновить инфу о куках в браузере
            cookies = getCookie();
                
            listTable.innerHTML = ''; // очистим таблицу

            for (let cookie in cookies) { // переберем все куки и отобразим в таблице
                // в хависимости от фильтра
                if (isMatching(cookie, filterValue) || isMatching(cookies[cookie], filterValue)) {
                    addCookieInTable(cookie, cookies[cookie]);
                }
            }
        }
    }
});
