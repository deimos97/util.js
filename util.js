/**
 *
 * Función que obtiene y procesa un JSON a partir de un elemento de script JSON
 * 
 * @param {string} elementId ID del elemento script del que sacaremos la información
 * 
 * @return {json} El JSON parseado de lo que tengamos dentro
 *
 **/
 function retrieveJson(elementId) {

	let elementJSON = document.getElementById(elementId);
	// Garantizamos que el elemento exista y tenga contenido
	if (!elementJSON || !elementJSON.innerHTML.length) 
		return false;
    // Tratamos de parsear el JSON
	let json = parseJSON(elementJSON.innerHTML);

	// Comprobamos que sea un JSON válido
	if (!json) 
		return false;

	return json;
}
/**
 *
 * Parsea un JSON controlando errores
 * 
 * @param {string} json JSON a parsear
 * 
 * @return {array/dictionary} JSON parseado a diccionario/array
 *
 **/
function parseJSON(json) {
    // Tratamos de parsearlo.
	try {
		jsonParsed = JSON.parse(json);
	} catch (e) {
        // Si falla imprimimos un error y devolvemos un array vacío
		console.warn("Encontrado JSON inválido.");
		jsonParsed = [];
	}
	return jsonParsed;
}

/**	
 *
 * Función que checkea si una variable es una función
 * 
 * @param {function} functionToCheck Variable sobre la que queremos comprobar si es una función o no
 * 
 * @return {boolean} Si es una función o no
 *  
 **/
function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}


/**	
 * 
 * Hace un scroll al comienzo de la página
 * 
 **/ 
function scrollToTop() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/**
 * 
 * Añade parámetros a la URL
 * 
 * @param {string/array} parameterIndex Parámetro o array de parámetros a añadir
 * @param {string/array} parameterValue Valor o array de valores para el parámetro a añadir
 * @param {boolean} reload Si queremos recargar la página con los nuevos parámetros o no
 * 
 * @return {nothing/string} Devolverá la URL actualizada con los nuevos parámetros
 * 
 */
function addParameterToUrl(parameterIndex, parameterValue, reload = true) {
    // Sacamos los parámetros de la URL actual
    let params = new URLSearchParams(location.search);

    // Si le hemos pasado un array iteraremos sobre él para añadir los valores
    if (Array.isArray(parameterIndex) && Array.isArray(parameterValue)) {
        parameterIndex.map((index, valueIndex) => {
            params.set(index, parameterValue[valueIndex]);
        });
    } else if (Array.isArray(parameterIndex) || Array.isArray(parameterValue)) {
        return console.error("Both parameters MUST be Arrays or Strings to add them to the URL");
    } else { // De lo contrario solo hay un parámetro a añadir
        params.set(parameterIndex, parameterValue);
    }

    // Si queremos recargar la página podemnos metérselo directamente al search parameter así
    if (reload) {
        window.location.search = params.toString(); 
        return;
    }
    
    // De lo contrario necesitamos "reconstruir" la URL con los nuevos parámetros
    let newUrl = window.location.href + "?"+params.toString();
    if (window.location.search) { // Si ya había parámetros los respetamos
        newUrl = window.location.href.replace(window.location.search, params.toString() ? "?"+params.toString() : "");
    }
    // Lo añadimos al historial de navegación y devolvemos la URL
    window.history.pushState('', document.title, newUrl);
    return newUrl;
}

/**
 * 
 * Borra parámetros a la URL y devuelve la URL sin parámetros
 * 
 * @param {string/array} parameterIndex Nombre o array de nombres del parámetro a borrar
 * 
 * @return {String} Url sustituida
 * 
 */
function removeParameterFromUrl(parameterIndex) {
    // Sacamos los parámetros de la URL
    let params = new URLSearchParams(location.search);
    // Si es un array los vamos borrando todos
    if (Array.isArray(parameterIndex)) {
        parameterIndex.map( index => params.delete(index) );
    } else { // De lo contrario borramos el único que haya que borrar
        params.delete(parameterIndex);
    }
    // Montamos la URL y la "empujamos" al historial de navegación
    let newUrl = window.location.href.replace(window.location.search, params.toString() ? "?"+params.toString() : "");
    window.history.pushState('', document.title, newUrl);
    return newUrl;
}

/**
 * 
 * @param {node} element Nodo del elemento que queremos detectar si está en pantalla
 * 
 * @returns {boolean} Si el elemento está o no en pantalla
 * 
 */
function isInViewport(element) {
    // Sacamos sus "coordenadas"
	var rect = element.getBoundingClientRect();
    // Y nuestro elemento
	var html = document.documentElement;
	
    // Si no tiene dimensiones no se podrá "ver"
	if (!rect.width || !rect.height) {
		return false;
	}

    // Con esto calculamos si está dentro de la ventana
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.top <= (window.innerHeight || html.clientHeight) &&
		rect.left <= (window.innerWidth || html.clientWidth)
	);
}

/**
 * 
 * Función de ayuda para simplificar la creación de Nodos
 * 
 * @param {String} type Tipo de nodo a crear
 * @param {String[Array]} classArray Clases que queremos añadir a nuestro elemento
 * @param {Object} options Opciones extra a añadir a nuestro elemento
 * @returns 
 */
 function createNode(type, classArray = [], options = {}) {
	let node = document.createElement(type);
	// Asignamos todas las características de nuestro objeto al nodo creado 
	for (let [optionKey, optionValue] of Object.entries(options)) {
		node[optionKey] = optionValue;
	}
	
	// Asignamos las clases controlando errores
	classArray.map(singleClass => {
		try {
		node.classList.add(singleClass); 
		} catch (error) {
			console.warn(node, `Could not add the class ${singleClass} to the classList node`);
		}
	});      
	return node;
}


/**
 * 
 * ¡¡Necesita CSS!!
 * 
 * Alternativa al "confirm/alert/prompt" que te permite avisar al usuario antes de cualquier acción.
 * Puedes "bloquear" la ejecución con promesas/wait para conseguir la misma funcionalidad que las funciones de JS. 
 * 
 * @param {dictionary} data Puedes pasarle un "title" y un "body" que podrán ser HTML/texto o incluso nodos de JS
 * @param {dictionary} acceptData {name: "Nombre que le quieras dar a la acción", callback: "función que quieras que se ejecute cuando se ejecuta la acción" }
 * @param {dictionary} cancelData {name: "", callback: ""}
 * @param {boolean} cancelable Si podemos cerrarlo haciendo click en la X o fuera (de no serlo solo podrá ser cerrado cuando ejecutemos una acción)
 * 
 */
function alertPopup(data, acceptData = {}, cancelData = {}, cancelable = true) {
	// Idelamente lo posicionarás fixed con BG transparente. Un display flex te puede ayudar a posiconarlo en el centro (los contenidos)
    let container = document.createElement("div");
		container.classList.add("custom-alert");

        // Aquí es dónde irá el contenido (tanto el contenedor como los elementos de cerrar)
		let content = document.createElement("div");
			content.classList.add("custom-alert-content");

            // Si tenemos título lo añadimos
			if (data.title) {
				let title = document.createElement("div");
					title.classList.add("custom-alert-title");
                    // Podremos pasarle HTML en texto o directamente un Node Type
                    if (data.title.nodeType) {
                        title.appendChild(data.title);
                    } else {
                        title.innerHTML = data.title;
                    }
				content.appendChild(title);
			}
			// Igual pero para el body
			if (data.body) {
				let body = document.createElement("div");
					body.classList.add("custom-alert-body");
                    if (data.body.nodeType) {
                        body.appendChild(data.body);
                    } else {
                        body.innerHTML = data.body;
                    }
				content.appendChild(body);
			}

            // Aquí tendremos los botones de acción
			let buttonsContainer = document.createElement("div");
				buttonsContainer.classList.add("button-container");

                // Si tenemos alguna acción a ejecutar de "aceptación" (no es 100% necesario que sea de "aceptación")
				if (acceptData.name || acceptData.callback) {
					let confirmButton = document.createElement("div");
						confirmButton.classList.add("button-main");
						confirmButton.onclick = () => {
							if (acceptData.callback && acceptData.callback() === false) return; // Lets the callback stop the closing
							container.remove();
						};
						confirmButton.innerHTML = acceptData.name ?? "Ok";
					buttonsContainer.appendChild(confirmButton);
				}
				
                // Igual pero para la acción de cancelar
				if (cancelData.name || cancelData.callback) {
					let cancelButton = document.createElement("div");
						cancelButton.classList.add("button-secondary");
						cancelButton.onclick = () => {
							if (cancelData.callback && cancelData.callback() === false) return; // Lets the callback stop the closing
							container.remove();
						};
						cancelButton.innerHTML = cancelData.name ?? "No";
					buttonsContainer.appendChild(cancelButton);
				}
			content.appendChild(buttonsContainer);
			
			// Si es cancelable le asignamos las funciones de cerrado a los elementos
			if (cancelable) {
                
                // La función de cancelar además de borrar el popup ejecutará el callback que tengamos de cancelar
                let closeAndCancel = () => {
                    if(cancelData.callback) cancelData.callback();
                    container.remove();
                }
                
                // Le añadimos botón de cerrado con la funcionalidad (habrá que ponerlo en absolute para que esté donde quieras)
				let closeButton = document.createElement("div");
					closeButton.classList.add("custom-alert-close");
					closeButton.innerHTML = `X`; // Use an SVG or Icon here!
					closeButton.onclick = closeAndCancel;
				content.appendChild(closeButton);
                
                // Si hacemos click en el contenedor (que será el fondo) cerramops el popup
				container.onclick = (e) => {
					if (e.target == container) { // Solo cuando hemos hecho clicl en él (y no dentro de algún elemento de él)
						closeAndCancel();
					}
				}
			}

		container.appendChild(content);

	document.body.appendChild(container);
}
