/*
Вариант выполнения Тестового задания для вакансии JS Разработчика в СКБ Контур
Автор: Пономарев Владислав Антонович

Ниже представлена авторская реализация шаблонизатора в формате небольшого прототипа позволяющего конструировать формы,
с учетом рекомендаций указанных в задании.
*/

var worker = {
    'build': 22,
    'configuration':{
        'viewContainer':'view-container',
        'template':'template.json',
        'statusLine':'status-line'
    },
    'extensions':[], // Намек на модульность (В роли примера набросал простенький редакотор шаблонов editor.js)
    'init': function () { // Функция подготавливает рабочее пространство
        console.log('[Worker] build '+worker.build+' initialised');
        document.body.innerHTML='<div id="'+worker.configuration.statusLine+'"></div><br/><div id="'+worker.configuration.viewContainer+'"></div>';
        for(i in worker.extensions){
            worker[i]['init'](); // Инициализация всех зарегистрированных расширений
            name = i.charAt(0).toUpperCase() + i.substr(1);
            console.log('['+name+']'+(worker[i].build?' build '+worker[i].build:'')+' initialised');
        }
        if(worker.configuration.template){
            console.log('[Template] is presented, loading...');
            worker.load(worker.configuration.template,worker.generate); // Загрузка шаблона и отправка его на рендеринг
        }
    },
    'load': function (path,callback) { // Функция загрузки через XHR
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (this.readyState != 4){
                if(worker.configuration.statusLine){
                    document.getElementById(worker.configuration.statusLine).innerText='Loading '+path+' ...';
                }
                return;
            }
            if (this.status != 200) {
                console.log('[Loader] '+path+' has not found');
                if(worker.configuration.statusLine) {
                    document.getElementById(worker.configuration.statusLine).innerText=path+' Not found';
                }
                return;
            }
            console.log('[Loader] Complete '+path);
            document.getElementById(worker.configuration.statusLine).innerText='';
            worker.response=this.responseText;
            if(callback){
                callback(this.responseText); //Callback передача принятых данных
            }
        }
    },
    'generate': function (template) { // Функция генерации элементов принятых в шаблоне
        console.log('[Worker] Generating DOM...');
        template=typeof template=='object'?template:JSON.parse(template); // Проверка полученных данных
        worker.dom={}; // Виртуальное древо DOM (попытка понять необходимость в переменной path у элементов)
        worker.listNode=Object.keys(template).map(function (key) {return template[key]});
        worker.listNode=worker.listNode[0]; // Получение списка элементов формы TODO: унификация обработчика
        document.getElementById(worker.configuration.viewContainer).innerHTML=''; // Очистка блока для вывода
        for(i in worker.listNode){
            console.log('['+worker.listNode[i]+'] Creating node');
            if(template[worker.listNode[i]]) {
                item = template[worker.listNode[i]]; // Сбор данных о элементе
                label = false; // Необходимость в сопутствующем тэге <Label for...>
                switch (item.type) {
                    case 'input': // Поле ввода типа Text
                        element = document.createElement('input');
                        element.id = worker.listNode[i];
                        element.type = 'text';
                        element.placeholder = item.title; // По вкусу автора, заместо Label'а
                        element.style.visible = item.visible ? 'visible' : 'hidden';
                        element.readOnly = item.editable ? false : true;
                        break;
                    case 'checkbox':
                        element = document.createElement('input');
                        element.id = worker.listNode[i];
                        element.type = 'checkbox';
                        label = true;
                        break;
                }
                if (label) {
                    console.log('['+worker.listNode[i]+'] Creating label for ' + item.type);
                    labelelement = document.createElement('label');
                    labelelement.htmlFor = element.id;
                    labelelement.innerText = item.title;
                    document.getElementById(worker.configuration.viewContainer).appendChild(labelelement);
                    delete labelelement;
                }
                element = document.getElementById(worker.configuration.viewContainer).appendChild(element);
                document.getElementById(worker.configuration.viewContainer).innerHTML += '<br>';
                worker.dom = worker.genTree(item.path.split('.'), element, worker.dom); // Дополняем DOM древо данными из path
                //worker.dom.concat(Object.keys(path).map(function (key) {return path[key]}));
                console.log('[' + worker.listNode[i] + '] (Type: ' + item.type + ') created');
                delete element; // Считаю уместным, подчистить "пушистые" хвосты
                delete item;
            }else{
                console.log('[Template][ERROR] '+worker.listNode[i]+' is not declared');
            }
        }
        console.log('[Worker] DOM ready');
        delete template;
    },
    'genTree':function(array,node,tree) { // Функция для заполнения модели древа DOM
        tree = tree?tree:{}; // Новый куст, если пусто
        key=array[0];
        array.splice(0, 1); // Отщипываем узел
        if(array.length==0){
            tree[key] = node ? node : {}; // И снова загадка, но пусть будет реальный узел
        }else{
            tree[key] = worker.genTree(array, node?node:null,tree[key]); // Рекурсивно заполняем древо
        }
        return tree;
    }
};
window.addEventListener('load',worker.init); // Триггер инициализации