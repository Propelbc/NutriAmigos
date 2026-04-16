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

           let diagnostico = "";

if(get < 1800){
    diagnostico = "🔻 Consumo bajo: podrías necesitar aumentar tu ingesta.";
}else if(get >= 1800 && get <= 2500){
    diagnostico = "✅ Consumo adecuado: estás en un rango saludable.";
}else{
    diagnostico = "⚠️ Consumo alto: podrías estar en superávit calórico.";
}

let mensajeGET = `
Para mantener tu peso necesitas <strong>${get} kcal/día</strong>.<br>
<strong>Diagnóstico:</strong> ${diagnostico}
`;

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
    const barra = document.getElementById("barraNivel");
    barra.style.width = porcentaje + "%";

    // COLOR DINÁMICO
    if(get < 1800){
        barra.style.background = "#3498db"; // azul
    } else if(get <= 2500){
        barra.style.background = "#27ae60"; // verde
    } else {
        barra.style.background = "#e74c3c"; // rojo
    }

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
        info = `
        <h2>Hot Cake de Avena</h2>
        <p>Consumir con moderación si se busca controlar peso o glucosa.</p>

        <h3>Beneficios</h3>
        <ul>
            <li>✔ Mejora la digestión</li>
            <li>✔ Aporta energía natural</li>
            <li>✔ Ayuda a controlar el colesterol</li>
            <li>✔ Genera saciedad</li>
        </ul>

        <h3>Valor Nutricional</h3>
        <ul>
            <li>Calorías: 250-300 kcal</li>
            <li>Carbohidratos: 45-50 g</li>
            <li>Proteínas: 7-9 g</li>
            <li>Grasas: 4-6 g</li>
            <li>Fibra: 6-8 g</li>
            <li>Potasio: Alto</li>
            <li>Vitaminas: Complejo B y B6</li>
        </ul>
        `;
    }

    if(tipo === "arroz"){
        info = `
        <h2>Galletas de Arroz con Crema de Cacahuate</h2>

        <p>Snack energético ideal antes de entrenar.</p>

        <h3>Información Nutricional</h3>
        <ul>
            <li>Calorías: 150-190 kcal</li>
            <li>Grasas: 6-9 g</li>
            <li>Carbohidratos: 16-31 g</li>
            <li>Proteínas: 4-6 g</li>
        </ul>

        <p>⚠️ Consumir con moderación por su alto contenido calórico.</p>
        `;
    }

    if(tipo === "agua"){
        info = `
        <h2>Agua de Avena</h2>

        <h3>Beneficios</h3>
        <ul>
            <li>✔ Mejora la digestión</li>
            <li>✔ Reduce colesterol</li>
            <li>✔ Controla azúcar en sangre</li>
            <li>✔ Aporta vitaminas B y E</li>
        </ul>

        <h3>Valor Nutricional (250ml)</h3>
        <ul>
            <li>Calorías: 130-140 kcal</li>
            <li>Carbohidratos: 21-22 g</li>
            <li>Proteínas: 4-5.8 g</li>
            <li>Grasas: 3-3.4 g</li>
            <li>Fibra: 2 g</li>
        </ul>
        `;
    }

    if(tipo === "yogurt"){
        info = `
        <h2>Yogurt con Frutos Secos</h2>

        <h3>Beneficios</h3>
        <ul>
            <li>✔ Rico en probióticos</li>
            <li>✔ Favorece la microbiota</li>
            <li>✔ Aporta omega 3</li>
            <li>✔ Alta saciedad</li>
        </ul>

        <h3>Porción Recomendada</h3>
        <p>200-250 kcal aproximadamente</p>
        `;
    }

    if(tipo === "palomitas"){
        info = `
        <h2>Palomitas Saludables</h2>

        <h3>Beneficios</h3>
        <ul>
            <li>✔ Fuente de fibra</li>
            <li>✔ Control de peso</li>
            <li>✔ Antioxidantes</li>
            <li>✔ Salud cardiovascular</li>
        </ul>

        <p>⚠️ Evitar mantequilla y exceso de aceite.</p>
        `;
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

// ===== NUEVO: MODAL ETIQUETADO (AGREGADO) =====
function abrirEtiqueta(tipo){

    const modal = document.getElementById("modalInfo");
    const contenido = document.getElementById("contenidoModal");

    let info = "";

    if(tipo === "calorias"){
        info = `
        <h2>🔥 Exceso de Calorías</h2>

        <p>
        Las calorías representan la energía que aportan los alimentos. 
        Un consumo excesivo, especialmente sin actividad física, provoca acumulación de grasa corporal.
        </p>

        <h3>⚠️ Riesgos</h3>
        <ul>
            <li>Obesidad</li>
            <li>Fatiga constante</li>
            <li>Mayor riesgo de diabetes tipo 2</li>
        </ul>

        <h3>🍔 ¿Dónde se encuentra?</h3>
        <p>Comida rápida, bebidas azucaradas, snacks procesados.</p>

        <h3>💡 Recomendación</h3>
        <p>Consumir porciones adecuadas y equilibrar con actividad física.</p>
        `;
    }

    if(tipo === "azucar"){
        info = `
        <h2>🍬 Exceso de Azúcares</h2>

        <p>
        El azúcar añadido se absorbe rápidamente, elevando la glucosa en sangre.
        Su consumo frecuente genera dependencia y problemas metabólicos.
        </p>

        <h3>⚠️ Riesgos</h3>
        <ul>
            <li>Diabetes tipo 2</li>
            <li>Caries dentales</li>
            <li>Aumento de peso</li>
        </ul>

        <h3>🥤 ¿Dónde se encuentra?</h3>
        <p>Refrescos, jugos industriales, dulces, cereales azucarados.</p>

        <h3>💡 Recomendación</h3>
        <p>Reducir bebidas azucaradas y preferir agua natural.</p>
        `;
    }

    if(tipo === "sodio"){
        info = `
        <h2>🧂 Exceso de Sodio</h2>

        <p>
        El sodio es necesario en pequeñas cantidades, pero su exceso afecta el sistema cardiovascular.
        </p>

        <h3>⚠️ Riesgos</h3>
        <ul>
            <li>Hipertensión arterial</li>
            <li>Retención de líquidos</li>
            <li>Problemas cardíacos</li>
        </ul>

        <h3>🍟 ¿Dónde se encuentra?</h3>
        <p>Botanas, sopas instantáneas, comida rápida y enlatados.</p>

        <h3>💡 Recomendación</h3>
        <p>Evitar alimentos ultraprocesados y no añadir sal extra.</p>
        `;
    }

    if(tipo === "grasas"){
        info = `
        <h2>🥓 Exceso de Grasas</h2>

        <p>
        Las grasas son necesarias, pero el exceso de grasas saturadas y trans afecta la salud.
        </p>

        <h3>⚠️ Riesgos</h3>
        <ul>
            <li>Aumento del colesterol LDL</li>
            <li>Enfermedades cardiovasculares</li>
            <li>Incremento de peso</li>
        </ul>

        <h3>🍕 ¿Dónde se encuentra?</h3>
        <p>Frituras, comida rápida, productos industrializados.</p>

        <h3>💡 Recomendación</h3>
        <p>Preferir grasas saludables como aguacate, nueces y aceite de oliva.</p>
        `;
    }

    contenido.innerHTML = info;
    modal.style.display = "flex";
}

// ===== VER IMAGEN EN GRANDE ===== 
function verImagen(src){

    const modal = document.getElementById("modalInfo");
    const contenido = document.getElementById("contenidoModal");

    contenido.innerHTML = `
        <h2>Ejemplo de Etiqueta</h2>
        <img src="${src}" style="width:100%; max-width:500px; border-radius:10px;">
        <p style="margin-top:10px;">🔍 Puedes observar los sellos de advertencia del producto.</p>
    `;

    modal.style.display = "flex";
}

// ===== BOTÓN VOLVER ARRIBA =====
window.addEventListener("scroll", function(){

    const btn = document.getElementById("btnTop");

    if(window.scrollY > 300){
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});

function irArriba(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

// ===== PROGRESO DINÁMICO =====
window.addEventListener("scroll", () => {

    const pasos = document.querySelectorAll(".paso");
    const scroll = window.scrollY;

    pasos.forEach(p => p.classList.remove("activo"));

    if(scroll < 800){
        pasos[0].classList.add("activo");
    } else if(scroll < 1600){
        pasos[1].classList.add("activo");
    } else {
        pasos[2].classList.add("activo");
    }

});

// ===== PROGRESO CON SCROLL =====
window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;

    let progreso = (scrollTop / docHeight) * 100;

    // Mover barra
    document.getElementById("barraScroll").style.width = progreso + "%";

    // LOGROS
    const l1 = document.getElementById("logro1");
    const l2 = document.getElementById("logro2");
    const l3 = document.getElementById("logro3");

    l1.classList.remove("activo");
    l2.classList.remove("activo");
    l3.classList.remove("activo");

    if(progreso > 10){
        l1.classList.add("activo");
    }
    if(progreso > 40){
        l2.classList.add("activo");
    }
    if(progreso > 80){
        l3.classList.add("activo");
    }

});
