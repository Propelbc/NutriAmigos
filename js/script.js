let index = 0;

function move(step){
    const slides = document.getElementById("slides");
    const total = slides.children.length;

    index += step;

    if(index < 0) index = total-1;
    if(index >= total) index = 0;

    slides.style.transform = `translateX(-${index * 100}%)`;
}

// Movimiento automático
setInterval(()=> move(1), 4000);

// ===== POPUP =====
window.onload = function(){
    document.getElementById("popup").style.display = "flex";
}

function cerrarPopup(){
    document.getElementById("popup").style.display = "none";
}
