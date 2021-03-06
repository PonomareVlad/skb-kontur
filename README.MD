# Тестовое задание  на соискание вакансии js-разработчика  в команду Контур-Экстерна

В рамках выполнения задания необходимо реализовать форму для заполнения данных. Форма должна разворачиваться на произвольном DOM-контейнере при помощи вызова публичной функции инициализации из кода страницы. Содержимое формы определяется JSON, передаваемым в инициализатор в качестве аргумента. Данные получаются из некоторого стороннего хранилища, в котором они доступны по строкам-путям.

### Состав формы.
Форма должна состоять из контролов. Каждый контрол обладает отдельным описанием, содержащим шаблон разметки. Набор контролов должен быть легко расширяем. Обязательные для реализации контролы: input, checkbox, radiobutton. Реализация других контролов необязательна, но может быть засчитана отдельным плюсом.

### Построение формы.
Построение формы в браузере происходит при вызове функции, принимающей параметрами DOM-узел, внутри которого будет развёрнута форма, и JSON, описывающий набор контролов и пути к данным в них. Формат JSON должен быть описан в приложенном к решению файлу-комментарию. 

Пример формата такого JSON:

```
{
	"order": ["input1", "input2", "cb3"],
	"input1": {
		"type": "input",
		"title": "Первый инпут",
		"path": "root.input",
		"visible": true,
		"editable": true
	},
	"input2": {
		"type": "input",
		"title": "Второй инпут",
		"path": "root.node1.node2.input",
		"visible": true,
		"editable": true
	},
	"cb3": {
		"type": "checkbox",
		"title": "Чекбокс",
		"path": "root.check"
	}
}
```

Данные в контролах должны извлекаться из источника данных. Одно- или двухсторонняя связь в реальном времени между данными в контролах и данными в источнике данных необязательна и является большим плюсом.

### Источник данных.
Источник данных должен быть вынесен в отдельный модуль и должен предоставлять публичные методы для извлечения из него данных по путям.

### Общие рекомендации к выполнению тестового задания.
Работа с DOM должна происходить посредством библиотеки jQuery или (предпочтительнее) i-bem. Большим плюсом будет описание контролов и страницы в идеологии БЭМ. Следует избегать использования глобального пространства имен, кроме необходимого минимума.

Рекомендуем в качестве синтаксиса шаблонизатора использовать синтаксис mustache. Но можете взять и любой другой на ваше усмотрение, при этом нам будет интересна ваша аргументация в пользу сделанного выбора.