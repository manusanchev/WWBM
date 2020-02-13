
window.onload = function(){
    premios = document.getElementById("premios").children;
    boton = document.getElementById("boton");
    titleJugadas = document.getElementById("titleJugadas");
    pregunta = document.getElementById("pregunta");
    respuestasDiv = document.getElementById("respuestas");
    jugar = document.getElementById("jugar");
    resultado = document.getElementById("resultado");

    preguntas = [];
    respuestas = [];
    respuestasCorrectas=[];
    indice  = 0;
    
 
  
    boton.addEventListener("click",iniciarPartida);
    
}

function reiniciarTodo(){
    
    resultado.innerHTML ="";
    indice = 0;
    for (let i = 0; i < premios.length; i++) {
        
        premios[i].className = "premio";
    }
}
function iniciarPartida(){
    reiniciarTodo();
    var peticion = new XMLHttpRequest();
    
    peticion.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            var respuesta = JSON.parse(this.responseText);
            console.log(respuesta);
            var i = 0;
            for (const datos of respuesta.results) {
                preguntas[i] =  decodeURIComponent(datos.question);
                respuestas[i] = [...datos.incorrect_answers,decodeURIComponent(datos.correct_answer)];
                respuestasCorrectas[i] = decodeURIComponent(datos.correct_answer);
             
                i++;
            }
            
            mezclarRespuestas();
            boton.style.display = "none";
            jugar.style.display = "block";
            mostrarJugada();
            
        }
    }

    peticion.open("POST","https://opentdb.com/api.php?amount=6&category=9&difficulty=easy&type=multiple&encode=url3986",true);
    peticion.send();
}
function mezclarRespuestas(){
   
    var arr = [];
    nuevaRespuestas = [];
    for (let l = 0; l < respuestas.length; l++) {
        arr = arrayAleatorios();
        nuevaRespuestas[l] = [];
        for (let j = 0; j < arr.length; j++) {
            nuevaRespuestas[l][j] = decodeURIComponent(respuestas[l][arr[j]]);
                
        }
        
    }
   
   
}
function arrayAleatorios(){
    var arr =[];
    for (let i = 0; i < 4; i++) {
        do{
            var aleatorio = Math.floor(Math.random() * (4 - 0)) + 0;
        }while(compruebaRepeticion(aleatorio,arr));
        arr[i] = aleatorio;
        
    }
    return arr;
}
function compruebaRepeticion(aleatorio,arr){
    for (let i = 0; i < arr.length; i++) {
        if(aleatorio == arr[i]){
            return true;
        }
    }
    return false;
}
function mostrarJugada(){
    console.log(respuestasCorrectas);
    titleJugadas.innerHTML = "Jugada "+(indice+1)+" de 6";
    pregunta.innerText = preguntas[indice];

    respuestasDiv.innerHTML = "<div><p class='respuesta' onclick='comprobarRespuesta(this)'>"+nuevaRespuestas[indice][0]+"</p><p class='respuesta' onclick='comprobarRespuesta(this)'>"+nuevaRespuestas[indice][1]+"</p></div><div><p class='respuesta' onclick='comprobarRespuesta(this)'>"+nuevaRespuestas[indice][2]+"</p><p class='respuesta' onclick='comprobarRespuesta(this)'>"+nuevaRespuestas[indice][3]+"</p></div>"
    
    
}

function comprobarRespuesta(object){
    var aciertosPosibles = 5;
    var respuesta = object.innerText;
    
    if(respuesta==respuestasCorrectas[indice]){
       premios[aciertosPosibles-indice].classList.add("respuesta-correcta");
        if(indice==5){
            jugar.style.display = "none";
            resultado.innerHTML = "Enhorabuena, has ganado 1.000.000€";
            boton.style.display = "block";
        }
       indice++;
       mostrarJugada();
    }else{
        premios[aciertosPosibles-indice].classList.add("respuesta-incorrecta");
        jugar.style.display = "none";
        if(indice!=0){
            resultado.innerHTML = "Has ganado "+premios[aciertosPosibles-(indice-1)].innerHTML;
            boton.style.display = "block";
        }else{
            resultado.innerHTML = "Lo sentimos, no has ganado nada";
            boton.style.display = "block";
        }
       
        
    }
}