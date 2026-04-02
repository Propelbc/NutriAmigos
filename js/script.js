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

    // ===== INICIAR CARRUSEL (AQUÍ SÍ FUNCIONA) =====
    intervalo = setInterval(() => move(1), 4000);

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

    if(!modal || !contenido) return;

    let info = "";

    if(tipo === "avena"){
        info = `
        <h2>Hot Cake de Avena</h2>
        <p>Consumir con moderación si se busca controlar peso o glucosa.</p>
        <ul>
            <li>✔ Mejora digestión</li>
            <li>✔ Aporta energía</li>
            <li>✔ Controla colesterol</li>
            <li>✔ Genera saciedad</li>
        </ul>
        `;
    }

    if(tipo === "arroz"){
        info = `
        <h2>Galletas de Arroz</h2>
        <p>Snack energético ideal antes de entrenar.</p>
        <ul>
            <li>✔ 150-190 kcal</li>
            <li>✔ Grasas saludables</li>
            <li>✔ Proteínas</li>
        </ul>
        `;
    }

    if(tipo === "agua"){
        info = `
        <h2>Agua de Avena</h2>
        <p>Mejora digestión y controla azúcar.</p>
        <ul>
            <li>✔ Reduce colesterol</li>
            <li>✔ Aporta vitaminas</li>
            <li>✔ Energía natural</li>
        </ul>
        `;
    }

    if(tipo === "yogurt"){
        info = `
        <h2>Yogurt con Frutos Secos</h2>
        <p>Combinación nutritiva y saciante.</p>
        <ul>
            <li>✔ Probióticos</li>
            <li>✔ Omega 3</li>
            <li>✔ Salud digestiva</li>
        </ul>
        `;
    }

    if(tipo === "palomitas"){
        info = `
        <h2>Palomitas Saludables</h2>
        <p>Snack rico en fibra y antioxidantes.</p>
        <ul>
            <li>✔ Mejora digestión</li>
            <li>✔ Controla peso</li>
            <li>✔ Beneficio cardiovascular</li>
        </ul>
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
