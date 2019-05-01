// Расширение позволяющее генерировать собственные шаблоны и тестировать их
// Позволяет сохранять несколько шаблонов и незаметно сидит в LocalStorage

worker.editor={
    'build':14,
    'configuration':{
        'listTemplates':'list-templates',
        'editorArea':'editor-area'
    },
    'init':function(){
        document.body.innerHTML+='<button onclick="worker.editor.view()">Открыть редактор</button>';
    },
    'view':function(){
        document.body.innerHTML='<div id="'+worker.configuration.statusLine+'"></div><br/><div id="'+worker.editor.configuration.listTemplates+'"></div><textarea rows="20" cols="50" id="'+worker.editor.configuration.editorArea+'">'+worker.response+'</textarea><br><button onclick="worker.editor.save();">Сохранить</button><button onclick="worker.editor.run();">Запустить</button><hr><div id="'+worker.configuration.viewContainer+'"></div>';
        document.getElementById(worker.editor.configuration.listTemplates).innerHTML=worker.editor.genList();
        console.log('[Editor] Workplace prepared');
        if(worker.response) {
            worker.generate(worker.response);
        }
    },
    'save':function() {
        templates = [];
        if (localStorage['templates']) {
            templates = JSON.parse(localStorage['templates']);
        }
        data = document.getElementById(worker.editor.configuration.editorArea).value;
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log('[Editor][ERROR] while parsing');
            alert('Синтаксическая ошибка в шаблоне');
            return;
        }
        name = prompt('Укажите имя для шаблона:', 'Новый шаблон ' + templates.length);
        if (name == 'null'||name=='') {
            return;
        }
        templates[templates.length] = {'name': name, 'data': data};
        localStorage['templates'] = JSON.stringify(templates);
        document.getElementById('list-templates').innerHTML = worker.editor.genList(templates);
    },
    'genList':function(list){
        list=list?list:localStorage['templates']?JSON.parse(localStorage['templates']):[];
        output=list.length>0?'Ваши сохраненные шаблоны:<br>':'';
        output+='<select onchange="worker.editor.select(this.options[this.selectedIndex].value)">';
        output+='<option value="">Default template</option>'
        for(i in list){
            output+='<option value="'+i+'">'+list[i].name+'</option>';
        }
        return output+'</select>';
    },
    'select':function(id){
        if(id=='') {
            document.getElementById(worker.editor.configuration.editorArea).value = worker.response;
            console.log('[Editor] Selected and preloaded Default template');
        }else{
            templates = JSON.parse(localStorage['templates']);
            document.getElementById(worker.editor.configuration.editorArea).value = JSON.stringify(templates[id].data,null,4);
            console.log('[Editor] Selected and preloaded template ' + templates[id].name);
        }
    },
    'run':function(){
        console.log('Parsing and Building your Template...');
        source=document.getElementById(worker.editor.configuration.editorArea).value;
        try{
            source=JSON.parse(source);
            worker.generate(source);
        }catch (e){
            console.log('[Editor][ERROR] while parsing');
            alert('Синтаксическая ошибка в шаблоне');
        }
    }
};
worker.extensions['editor']={'init':worker.editor.init};