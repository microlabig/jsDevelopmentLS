/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

// закешируем стили homeworkContainer
const homeWorkContainerStyles = homeworkContainer.getBoundingClientRect();

// определим св-во margin у body для параметров контейнера,
// также коррекция относительно margin убирает глюки при клике на DIV-ы
const bodyMargin = parseInt(getComputedStyle(document.body).margin); 

// вычислим параметры контейнера
const containerParams = { 
    width: homeWorkContainerStyles.width,
    height: homeWorkContainerStyles.height,
    x: homeWorkContainerStyles.x - bodyMargin,
    y: homeWorkContainerStyles.y - bodyMargin,
    borderRight: homeWorkContainerStyles.x + homeWorkContainerStyles.width - bodyMargin,
    borderBottom: homeWorkContainerStyles.y + homeWorkContainerStyles.height - bodyMargin
};

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const HALF_SIZE = 3; // 3 - максимальная ширина и высота DIV в 3 раза меньше относительно родителя

    let randomCharacters = { // генерация случайных характеристик
        width: getRandomValueFromRange(containerParams.x, containerParams.width, HALF_SIZE) + 'px',
        height: getRandomValueFromRange(containerParams.y, containerParams.height, HALF_SIZE) + 'px',
        x: getRandomValue(containerParams.width, containerParams.x) + 'px', 
        y: getRandomValue(containerParams.height, containerParams.y) + 'px' 
    };
    let element = document.createElement('div'); // создаваемый элемент DIV
    let isNotBorderAcross = false; // флаг определения выхода за границы родителя
    let left = containerParams.width - containerParams.x; // расстояние от левой границы родителя
    let top = containerParams.height - containerParams.y; // расстояние от верхней границы родителя

    // генерация случайного значения от 0 до last
    function getRandomValue(last, curr) {

        return Math.floor(0 + Math.random() * (last - curr + 1)); 
    }

    // генерация случайного значения от from до to и деление полученного значения на div
    function getRandomValueFromRange(from, to, div = 1) {

        return Math.floor(from + Math.random() * (to - from + 1) / div);
    }    

    // генерация случайного цвета
    function generateColors() {
        let color = '#', 
            colorArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']; // HEX

        for (let i = 0; i < 6; i++) { // #123456 (6 - 6 символов после '#')
            color += colorArr[Math.floor(Math.random() * Math.floor(colorArr.length))];
        }

        return color;
    }
    
    // проверка на выход за границу родителя при создании div  
    // если выходит, то заново вычислить X и Y 
    while (!isNotBorderAcross) {
        let checkX = left > (parseInt(randomCharacters.width) + parseInt(randomCharacters.x) - containerParams.x), // нижний x div'a
            checkY = top > (parseInt(randomCharacters.height) + parseInt(randomCharacters.y) - containerParams.y); // нижний y div'a
        
        if (checkX && checkY) {
            isNotBorderAcross = true;
        } else {
            randomCharacters.x = getRandomValue(containerParams.width, containerParams.x) + 'px';
            randomCharacters.y = getRandomValue(containerParams.height, containerParams.y) + 'px';
        }
    }
    
    element.classList.add('draggable-div');
    element.setAttribute('draggable', true);

    element.style = `
        position: absolute;
        background-color: ${generateColors()};
        width: ${randomCharacters.width};
        height: ${randomCharacters.height};
        top: ${randomCharacters.y};
        left: ${randomCharacters.x};
    `;

    return element;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {   

    target.addEventListener('mousedown', e => {
        
        let shiftX = e.clientX - target.getBoundingClientRect().left,
            shiftY = e.clientY - target.getBoundingClientRect().top,
            targetStyles = target.getBoundingClientRect(); // стили target
        
        function moveAt(e) {

            target.style.left = e.pageX - shiftX + 'px';
            target.style.top = e.pageY - shiftY + 'px'; 

            // проверка выхода за границы контейнера
            function isAcrossTop() { // сверху

                return targetStyles.y < containerParams.y;
            }

            function isAcrossRight() { // справа

                return (targetStyles.x + targetStyles.width) > containerParams.borderRight;
            }

            function isAcrossBottom() { // снизу

                return (targetStyles.y + targetStyles.height) > containerParams.borderBottom;
            }

            function isAcrossLeft() { // слева

                return targetStyles.x < containerParams.x;
            }
            
            if (isAcrossTop()) {
                target.style.top = containerParams.y + 'px';
            }

            if (isAcrossRight()) {
                target.style.left = (containerParams.borderRight - targetStyles.width) + 'px';                
            }

            if (isAcrossBottom()) {
                target.style.top = (containerParams.borderBottom - targetStyles.height) + 'px';
            }

            if (isAcrossLeft()) {
                target.style.left = containerParams.x + 'px';
            }
        }

        target.style.zIndex = 1000;
        document.body.append(target);
        moveAt(e);
        
        document.onmousemove = e => moveAt(e);

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        }

        target.ondragstart = function() {
            return false;
        };
    });      
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
