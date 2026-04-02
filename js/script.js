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

            // VALIDACIONES
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

});


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

// ===== SWIPE PARA CELULAR =====
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
            move(1); // izquierda
        } else if(diff < -50){
            move(-1); // derecha
        }
    }
}
