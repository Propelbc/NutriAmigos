// ===== VARIABLES GLOBALES =====
let index = 0;
let intervalo;

// ===== CARRUSEL =====

function move(step){
    const slides = document.getElementById("slides");

    if(!slides){
        console.log("❌ No existe #slides");
        return;
    }

    const total = slides.children.length;

    index += step;

    if(index < 0) index = total - 1;
    if(index >= total) index = 0;

    slides.style.transform = "translateX(-" + (index * 100) + "%)";
}

// ===== CUANDO CARGA LA PÁGINA =====
document.addEventListener("DOMContentLoaded", function(){

    const popup = document.getElementById("popup");
    const form = document.getElementById("formNutri");
    const mensaje = document.getElementById("mensaje");
    const contadorTexto = document.getElementById("contador");

    // ===== INICIAR CARRUSEL  =====
    const carousel = document.querySelector(".carousel");

    if(carousel){
        carousel.addEventListener("mouseenter", () => {
            clearInterval(intervalo);
        });

        carousel.addEventListener("mouseleave", () => {
            intervalo = setInterval(() => move(1), 4000);
        });
    }

    // ===== MOSTRAR POPUP =====
    if(popup){
        popup.style.display = "flex";
    }

    // ===== CONTADOR =====
    let contador = localStorage.getItem("contadorUsuarios") || 0;
    if(contadorTexto){
        contadorTexto.innerHTML = `👥 Participantes: ${contador}`;
    }

    // ===== FORMULARIO =====
    if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();

            const nombre = form.nombre.value.trim();
            const edad = parseInt(form.edad.value);
            const email = form.email.value.trim();

            if(nombre.length < 3){
                mensaje.innerHTML = "⚠️ Nombre muy corto";
                return;
            }

            if(edad < 10 || edad > 100){
                mensaje.innerHTML = "⚠️ Edad inválida";
                return;
            }

            if(!email.includes("@")){
                mensaje.innerHTML = "⚠️ Correo inválido";
                return;
            }

            if(localStorage.getItem("usuarioRegistrado")){
                mensaje.innerHTML = "⚠️ Ya te registraste";
                return;
            }

            const data = new FormData(form);

            fetch("https://formspree.io/f/maqlwlen", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if(response.ok){

                    mensaje.innerHTML = "✅ Gracias por participar";

                    localStorage.setItem("usuarioRegistrado", "true");

                    contador++;
                    localStorage.setItem("contadorUsuarios", contador);

                    if(contadorTexto){
                        contadorTexto.innerHTML = `👥 Participantes: ${contador}`;
                    }

                    form.reset();

                } else {
                    mensaje.innerHTML = "❌ Error al enviar";
                }
            })
            .catch(() => {
                mensaje.innerHTML = "⚠️ Error de conexión";
            });
        });
    }

    // ===== CALCULADORA GET =====
    const getForm = document.getElementById("getForm");
    const resultadoBox = document.getElementById("resultadoGET");

    if(getForm){

        getForm.addEventListener("submit", function(e){
            e.preventDefault();

            const sexo = document.getElementById("sexo").value;
            const edad = parseInt(document.getElementById("edad").value);
            const peso = parseFloat(document.getElementById("peso").value);
            const estatura = parseFloat(document.getElementById("estatura").value);
            const actividad = parseFloat(document.getElementById("actividad").value);

            if(!sexo || isNaN(edad) || isNaN(peso) || isNaN(estatura) || isNaN(actividad)){
                resultadoBox.innerHTML = "<p style='color:red;'>⚠️ Completa todos los campos correctamente.</p>";
                return;
            }

            let tmb;

            if(sexo === "hombre"){
                tmb = 88.36 + (13.4 * peso) + (4.8 * estatura) - (5.7 * edad);
            } else {
                tmb = 447.6 + (9.2 * peso) + (3.1 * estatura) - (4.3 * edad);
            }

            let get = tmb * actividad;
            get = get * 1.10;

            tmb = Math.round(tmb);
            get = Math.round(get);

            let mensajeGET = `Para mantener tu peso necesitas <strong>${get} kcal/día</strong>.`;

            resultadoBox.innerHTML = `
                <h3>📊 Resultados</h3>
                <p><strong>TMB:</strong> ${tmb} kcal/día</p>
                <p><strong>GET:</strong> ${get} kcal/día</p>
                <p>${mensajeGET}</p>
            `;

            // ===== EXTRA PRO =====
            const extra = document.getElementById("extraGET");

            if(extra){

                let porcentaje = Math.min((get / 3500) * 100, 100);

                extra.innerHTML = `
                    <h3>⚡ Nivel de Energía</h3>
                    <div class="barra-energia">
                        <div class="nivel-energia" id="barraNivel"></div>
                    </div>

                    <h3>Objetivo</h3>
                    <button onclick="ajustarCalorias(${get}, 'bajar')">Bajar peso</button>
                    <button onclick="ajustarCalorias(${get}, 'subir')">Subir masa</button>

                    <div id="recomendacion"></div>
                `;

                setTimeout(() => {
                    document.getElementById("barraNivel").style.width = porcentaje + "%";
                }, 100);
            }
        });
    }

});

// ===== AJUSTE DE CALORÍAS =====
function ajustarCalorias(get, objetivo){

    const recomendacion = document.getElementById("recomendacion");

    let calorias;

    if(objetivo === "bajar"){
        calorias = get - 500;
        recomendacion.innerHTML = `🔻 Consumir aprox <strong>${calorias} kcal/día</strong>`;
    } else {
        calorias = get + 500;
        recomendacion.innerHTML = `🔺 Consumir aprox <strong>${calorias} kcal/día</strong>`;
    }
}

// ===== CERRAR POPUP =====
function cerrarPopup(){
    const popup = document.getElementById("popup");
    if(popup){
        popup.style.display = "none";
    }
}

// ===== MODAL DE PLATILLOS =====
function abrirModal(tipo){

    const modal = document.getElementById("modalInfo");
    const contenido = document.getElementById("contenidoModal");

    let info = "";

    if(tipo === "avena"){
        info = `<h2>Hot Cake de Avena</h2>`;
    }

    contenido.innerHTML = info;
    modal.style.display = "flex";
}

// ===== CERRAR MODAL =====
function cerrarModal(){
    const modal = document.getElementById("modalInfo");
    if(modal){
        modal.style.display = "none";
    }
}

// ===== SWIPE =====
let startX = 0;
let endX = 0;

const slides = document.getElementById("slides");

if(slides){

    slides.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slides.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe(){
        let diff = startX - endX;

        if(diff > 50){
            move(1);
        } else if(diff < -50){
            move(-1);
        }
    }
}
