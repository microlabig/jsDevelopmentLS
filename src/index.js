/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++)
        fn(array[i], i, array);
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let newArray = [];

    for (let i = 0; i < array.length; i++)
        newArray.push(fn(array[i], i, array));

    return newArray;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let prevItem = (initial) ? initial : array[0],
        i = (initial) ? 0 : 1;

    for (; i < array.length; i++) {
        let currItem = array[i];
        prevItem = fn(prevItem, currItem, i, array);
    }

    return prevItem;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let arr = [];

    for (let key in obj)
        arr.push(key.toUpperCase());

    return arr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    let newArray = [],
        length = array.length,
        start = from || 0, 
        end = (Math.abs(to) < length) ? to : length; 
    
    if (from === 0 && to === 0 || from > length) 
        return [];  

    if (from < 0) {
        if (Math.abs(from) > length) 
            start = 0;
        else 
            start = length + from;
    }

    if (to < 0) {
        if (Math.abs(to) > length) 
            return [];
        else 
            end = length + to;
    }

    for (let i=start; i<end; i++) 
        newArray.push(array[i]);
    
    return newArray;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set(target, property, value, receiver) {
            if (typeof value !== 'function' || typeof value !== 'object') {
                Reflect.set(target, property, value * value, receiver);
                return true; // инвариант
            } else
                return false; //инвариант
        }
    });
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
