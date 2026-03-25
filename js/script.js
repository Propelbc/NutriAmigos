// ===== CARRUSEL =====
let index = 0;

function move(step){
    const slides = document.getElementById("slides");
    if(!slides) return;

    const total = slides.children.length;

    index += step;

    if(index < 0) index = total - 1;
    if(index >= total) index = 0;

    slides.style.transform = `translateX(-${index * 100}%)`;
}

// Movimiento automático
setInterval(() => move(1), 4000);


// ===== CUANDO CARGA LA PÁGINA =====
document.addEventListener("DOMContentLoaded", function(){

    const popup = document.getElementById("popup");
    const form = document.getElementById("formNutri");
    const mensaje = document.getElementById("mensaje");
    const contadorTexto = document.getElementById("contador");

    // MOSTRAR POPUP SIEMPRE
    if(popup){
        popup.style.display = "flex";
    }

    // CONTADOR
    let contador = localStorage.getItem("contadorUsuarios") || 0;
    if(contadorTexto){
        contadorTexto.innerHTML = `👥 Participantes: ${contador}`;
    }

    // FORMULARIO
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
                headers: {
                    'Accept': 'application/json'
                }
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
