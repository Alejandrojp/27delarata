// — Configuración fácil de cambiar —
const WHATSAPP_NUMBER = "34685810754";

let audioCtx;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function runBootSequence() {
    // 1. Forzamos el fondo negro total en todo el dispositivo para el arranque
    document.body.style.backgroundColor = "#000000";
    document.documentElement.style.backgroundColor = "#000000";
    document.getElementById('meta-theme-color').setAttribute('content', '#000000');

    const boot = document.getElementById('boot-screen');
    const bar  = document.getElementById('boot-bar');
    
    setTimeout(() => { bar.style.width = '100%'; }, 100);
    
    setTimeout(() => {
        boot.classList.add('fade-out');
        setTimeout(() => { 
            boot.style.display = 'none'; 
            
            // 2. Restauramos los colores morados del escritorio de iOS al terminar
            document.body.style.backgroundColor = "#764ba2";
            document.documentElement.style.backgroundColor = "#764ba2";
            document.getElementById('meta-theme-color').setAttribute('content', '#667eea');
            
            // 3. NUEVO: Mostramos la cuenta atrás exactamente 1 segundo después de que ya esté viendo el PIN
            setTimeout(() => { showBirthdayCountdown(); }, 1000);
            
        }, 650);
    }, 6000);
    
    // (Hemos borrado el setTimeout que estaba aquí suelto abajo)
}

function playTap() {
    const audioCtx = getAudioCtx();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function playError() {
    const audioCtx = getAudioCtx();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

function playShutter() {
    const audioCtx = getAudioCtx();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

let sirenInterval;
function startSiren() {
    const audioCtx = getAudioCtx();
    let isHigh = false;
    sirenInterval = setInterval(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = isHigh ? 800 : 400; 
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
        isHigh = !isHigh;
    }, 200);
}
function stopSiren() { clearInterval(sirenInterval); }

function playTada() {
    const audioCtx = getAudioCtx();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.5);
        }, i * 150);
    });
}

let ringtoneInterval;
function playRingtone() {
    const audioCtx = getAudioCtx();
    function ringBeep(timeOffset) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800; 
        gain.gain.setValueAtTime(0, audioCtx.currentTime + timeOffset);
        gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + timeOffset + 0.05);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + timeOffset + 0.4);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + timeOffset + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + timeOffset);
        osc.stop(audioCtx.currentTime + timeOffset + 0.45);
    }
    function triggerRing() {
        ringBeep(0);
        ringBeep(0.5);
        if(navigator.vibrate) navigator.vibrate([400, 200, 400]);
    }
    triggerRing();
    ringtoneInterval = setInterval(triggerRing, 2000); 
}
function stopRingtone() { clearInterval(ringtoneInterval); }

let callTimeout; 

function triggerFakeCall() {
    document.getElementById('quiz-ui').classList.add('hidden');
    document.getElementById('incoming-call-ui').classList.remove('hidden');
    document.body.style.backgroundColor = "#1e1e1e"; 
    document.documentElement.style.backgroundColor = "#1e1e1e";
    document.getElementById('meta-theme-color').setAttribute('content', '#1e1e1e');
    playRingtone();
    callTimeout = setTimeout(() => { declineCall(true); }, 10000);
}

function declineCall(isAuto = false) {
    stopRingtone();
    clearTimeout(callTimeout); 
    if (isAuto === true) {
        playError(); showCustomAlert("Llamada Perdida", "El Santander se ha cansado de esperar. Mejor, así no te suben la cuota.");
    } else { 
        playError(); 
        showCustomAlert("Error de Sistema", "No puedes rechazar a tu banco. El Euríbor manda. Sigue con el test."); 
    }
    document.getElementById('incoming-call-ui').classList.add('hidden');
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.body.style.backgroundColor = "var(--ios-bg)"; 
    document.documentElement.style.backgroundColor = "var(--ios-bg)";
    document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
    renderQ(); 
}

function acceptCall() {
    stopRingtone();
    clearTimeout(callTimeout); 
    playError();
    showCustomAlert("Llamada Cortada", "Han colgado. Seguro que querían subirte el Euríbor. Sigue con el test.");
    document.getElementById('incoming-call-ui').classList.add('hidden');
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.body.style.backgroundColor = "var(--ios-bg)"; 
    document.documentElement.style.backgroundColor = "var(--ios-bg)";
    document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
    renderQ(); 
}

// Variable para controlar el tiempo de la alerta y que no se pisen
let alertTimeout; 

function showCustomAlert(title, message) {
    const alertBox = document.getElementById('custom-alert');
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-message').innerText = message;
    
    // 1. CANCELAMOS el temporizador de la notificación anterior (si lo hubiera)
    clearTimeout(alertTimeout);
    
    // 2. Mostramos la nueva alerta
    alertBox.classList.add('show-alert');
    if(navigator.vibrate) navigator.vibrate([100, 50, 100]); 
    
    // 3. Iniciamos los 4 segundos desde cero para esta notificación
    alertTimeout = setTimeout(() => { 
        alertBox.classList.remove('show-alert'); 
    }, 4000); 
}

// ── MEJORA 3: Cuenta atrás de cumpleaños ──────────────────────────────
let bdayInterval;
function showBirthdayCountdown() {
    const ui = document.getElementById('birthday-countdown-ui');
    ui.classList.add('show-bday');
    let secs = 10;
    document.getElementById('bday-timer').innerText = secs;
    bdayInterval = setInterval(() => {
        secs--;
        const el = document.getElementById('bday-timer');
        el.innerText = secs;
        if (secs <= 3) el.style.color = '#ff6b6b';
        if (secs <= 0) {
            clearInterval(bdayInterval);
            closeBirthdayCountdown(true);
        }
    }, 100);
}
function closeBirthdayCountdown(auto = false) {
    clearInterval(bdayInterval);
    const ui = document.getElementById('birthday-countdown-ui');
    ui.classList.remove('show-bday');
    if (auto) {
        setTimeout(() => showCustomAlert("⚠️ Licencia Expirada", "Embargo iniciado. ¡FELIZ CUMPLE! 🎂❤️"), 200);
    } else {
        setTimeout(() => showCustomAlert("💸 Renovación procesada", "400€ cargados a la hipoteca. Feliz cumple, propietaria 🏠"), 400);
    }
}

// ── MEJORA 2: Llamada del paleta ──────────────────────────────────────
let paletaCallTimeout;
function triggerPaletaCall() {
    document.getElementById('quiz-ui').classList.add('hidden');
    document.getElementById('paleta-call-ui').classList.remove('hidden');
    document.body.style.backgroundColor = "#1a2e1a";
    document.documentElement.style.backgroundColor = "#1a2e1a";
    document.getElementById('meta-theme-color').setAttribute('content', '#1a2e1a');
    playRingtone();
    paletaCallTimeout = setTimeout(() => { declinePaleta(true); }, 9000);
}
function declinePaleta(isAuto = false) {
    stopRingtone();
    clearTimeout(paletaCallTimeout);
    document.getElementById('paleta-call-ui').classList.add('hidden');
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.body.style.backgroundColor = "var(--ios-bg)";
    document.documentElement.style.backgroundColor = "var(--ios-bg)";
    document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
    if (isAuto) {
        showCustomAlert("Llamada perdida 🏗️", "El paleta te llamaba para decirte que hay otro 'imprevisto'. Menos mal que no cogiste.");
    } else {
        playError();
        showCustomAlert("Llamada rechazada 🏗️", "No se puede rechazar al paleta. Te mandará un presupuesto ampliado por WhatsApp.");
    }
    renderQ();
}
function acceptPaleta() {
    stopRingtone();
    clearTimeout(paletaCallTimeout);
    playError();
    document.getElementById('paleta-call-ui').classList.add('hidden');
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.body.style.backgroundColor = "var(--ios-bg)";
    document.documentElement.style.backgroundColor = "var(--ios-bg)";
    document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
    showCustomAlert("🎤 Mensaje de voz", "\"Buenas, mira que hay un problemilla con las refomas, deberemos de retrasarlas. Llámame.\"");
    renderQ();
}

// ── MEJORA 5: Compartir resultado ─────────────────────────────────────
function compartirResultado() {
    const eStr = document.getElementById('p-estres').innerText;
    const rStr = document.getElementById('p-rata').innerText;
    const mStr = document.getElementById('p-miso').innerText;
    const cStr = document.getElementById('p-cuca').innerText;
    const res  = document.getElementById('res-title').innerText.replace('TRATAMIENTO: ', '');
    const texto = `🩺 CLÍNICA ALE — Diagnóstico oficial\n\n` +
        `🏚️ Estrés Hipotecario: ${eStr}\n` +
        `💸 Modo Rata: ${rStr}\n` +
        `🤬 Riesgo Ruiditos: ${mStr}\n` +
        `🐛 Supervivencia Bichos: ${cStr}\n\n` +
        `Tratamiento prescrito: ${res} 🎉\n\n` +
        `Evaluada por el Dpto. de Salud Mental de Clínica ALE`;
    if (navigator.share) {
        navigator.share({ title: 'Mi diagnóstico de Clínica ALE', text: texto })
            .catch(() => {});
    } else {
        navigator.clipboard.writeText(texto)
            .then(() => showCustomAlert("📋 ¡Copiado!", "Diagnóstico copiado al portapapeles. Pégalo donde quieras."))
            .catch(() => showCustomAlert("📤 Compartir", "Copia el texto manualmente desde el campo de resultados."));
    }
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('ios-clock').innerText = timeString;
    document.getElementById('sb-time').innerText = timeString; 
    
    const ncTime = document.getElementById('nc-time');
    if(ncTime) ncTime.innerText = timeString;

    let d = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    let dCap = d.charAt(0).toUpperCase() + d.slice(1);
    document.getElementById('ios-date').innerText = dCap;
    
    const ncDate = document.getElementById('nc-date');
    if(ncDate) ncDate.innerText = dCap;
}
setInterval(updateClock, 1000);
updateClock();

function triggerNotification(id, showDelay) {
    setTimeout(() => {
        let el = document.getElementById(id);
        el.classList.add('notif-show');
        if(navigator.vibrate) navigator.vibrate(30);
        setTimeout(() => {
            el.classList.remove('notif-show');
            el.classList.add('notif-dismiss'); 
        }, 7000); 
    }, showDelay);
}

let canOpenNC = false;

function openNC() {
    if(!canOpenNC) return;
    playTap();
    document.body.style.backgroundColor = "#000000";
    document.documentElement.style.backgroundColor = "#000000";
    document.getElementById('notification-center').classList.add('show-nc');
    document.getElementById('nc-hint').classList.add('hidden');
}

function closeNC() {
    playTap();
    document.body.style.backgroundColor = "#764ba2"; 
    document.documentElement.style.backgroundColor = "#764ba2";
    document.getElementById('notification-center').classList.remove('show-nc');
}

function ncAlert(title, msg) {
    closeNC();
    setTimeout(() => { showCustomAlert(title, msg); }, 300); 
}

document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();

    const homeScreen = document.getElementById('home-screen');
    const notifCenter = document.getElementById('notification-center');
    let touchStartY = 0;

    homeScreen.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, {passive: true});
    homeScreen.addEventListener('touchend', e => {
        let touchEndY = e.changedTouches[0].clientY;
        if (touchEndY - touchStartY > 60) { openNC(); } 
    });

    notifCenter.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, {passive: true});
    notifCenter.addEventListener('touchend', e => {
        let touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 60) { closeNC(); } 
    });
});

let input = "";
const secret = "280499";
let failedAttempts = 0;
const dotElems = document.querySelectorAll('.dot');
let hasCalled = false;
let hasPaletaCalled = false;
let isChecking = false;

function resetPasscode() {
    input = ""; 
    dotElems.forEach(d=>d.classList.remove('filled')); 
    document.getElementById('dots-box').classList.remove('shake'); 
}

function triggerFaceID() {
    playTap();
    document.getElementById('face-id-btn').innerText = "Escaneando rostro...";
    setTimeout(() => {
        playError();
        document.getElementById('face-id-btn').innerText = "Face ID Fallido";
        document.getElementById('face-id-btn').style.borderColor = "#ff3b30";
        document.getElementById('face-id-btn').style.color = "#ff3b30";
        showCustomAlert("Face ID Fallido ❌", "Demasiadas ojeras detectadas por la búsqueda de piso. Por favor, introduzca código.");
    }, 1200);
}

function tap(n) {
    if (isChecking) return; // <-- BLOQUEO: Si está comprobando, no deja teclear
    
    playTap(); 
    if (input.length < 6) {
        input += n;
        dotElems[input.length - 1].classList.add('filled');
        if (input.length === 6) {
            isChecking = true; // <-- ACTIVAMOS EL BLOQUEO
            
            if (input === "123456") {
                playError(); document.getElementById('dots-box').classList.add('shake');
                setTimeout(() => { showCustomAlert("Nivel de Seguridad: Abuela 👵", "Dime que no usas '123456' para el banco. Céntrate y pon tu fecha de nacimiento (DDMMAA)."); resetPasscode(); isChecking = false; /* <-- DESBLOQUEAMOS */ }, 300);
                return;
            }
            if (input === "000000") {
                playError(); document.getElementById('dots-box').classList.add('shake');
                setTimeout(() => { showCustomAlert("Acceso Denegado 🛑", "Ni que esto fuera la maleta del gimnasio. Pon el código bueno."); resetPasscode(); isChecking = false; /* <-- DESBLOQUEAMOS */ }, 300);
                return;
            }
            if (input === "111111") {
                playError(); document.getElementById('dots-box').classList.add('shake');
                setTimeout(() => { showCustomAlert("Neurona no encontrada 🧠", "Seis unos. ¿En serio? El estrés de la hipoteca te ha fundido los plomos. Prueba otra vez."); resetPasscode(); isChecking = false; /* <-- DESBLOQUEAMOS */ }, 300);
                return;
            }
            if (input === secret) {
                playTada(); 
                document.getElementById('lock-icon').innerText = "🔓";
                if(navigator.vibrate) navigator.vibrate([50, 50, 50]); 
                document.body.style.backgroundColor = "var(--ios-bg)";
                document.documentElement.style.backgroundColor = "var(--ios-bg)";
                document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
                document.getElementById('ios-status-bar').classList.remove('status-light');
                document.getElementById('ios-status-bar').classList.add('status-dark');
                setTimeout(() => { let lock = document.getElementById('lock-screen'); lock.style.opacity = "0"; 
                setTimeout(() => { lock.classList.add('hidden'); }, 500);
            }, 600);
                // Aquí no hace falta desbloquear porque ya pasa a la siguiente pantalla
            } else {
                playError(); 
                if(navigator.vibrate) navigator.vibrate([100, 50, 100]); 
                failedAttempts++;
                document.getElementById('dots-box').classList.add('shake');
                if(failedAttempts >= 3) {
                    setTimeout(() => {
                        showCustomAlert("Dispositivo Bloqueado", "Deja de adivinar contraseñas, que sabemos que usas la misma para todo, rata.");
                        document.getElementById('passcode-hint').classList.remove('hidden');
                        failedAttempts = 0; 
                    }, 100);
                }
                setTimeout(() => {
                    resetPasscode();
                    isChecking = false; // <-- DESBLOQUEAMOS DESPUÉS DEL ERROR GENÉRICO
                }, 500);
            }
        }
    }
}

function redeemSandwich() {
    playTap(); 
    document.getElementById('prank-action').classList.add('hidden');
    document.getElementById('prank-loading').classList.remove('hidden');

    setTimeout(() => {
        startSiren();
        if(navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]); 
        document.body.style.backgroundColor = "var(--alert-red)";
        document.documentElement.style.backgroundColor = "var(--alert-red)";
        document.getElementById('meta-theme-color').setAttribute('content', '#ff3b30');
        document.getElementById('fullscreen-prank-alert').classList.add('show-prank');

        setTimeout(() => {
            stopSiren();
            stopRingtone(); 
            document.getElementById('fullscreen-prank-alert').classList.remove('show-prank');
            document.getElementById('prank-ui').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden');
            document.body.style.backgroundColor = "#764ba2";
            document.documentElement.style.backgroundColor = "#764ba2";
            document.getElementById('meta-theme-color').setAttribute('content', '#667eea'); 
            document.getElementById('ios-status-bar').classList.add('status-light');
            document.getElementById('ios-status-bar').classList.remove('status-dark');

            canOpenNC = true;
            setTimeout(() => { document.getElementById('nc-hint').classList.remove('hidden'); }, 3000);

            triggerNotification('n1', 1000);
            triggerNotification('n2', 4000);
            triggerNotification('n3', 7000);
            triggerNotification('n4', 10000);
            triggerNotification('n5', 13000);
            triggerNotification('n6', 16000); 
            triggerNotification('n7', 19000);
            
        }, 3500);
    }, 3500); 
}

function openRealApp() {
    playTap();
    const homeScreen = document.getElementById('home-screen');
    homeScreen.classList.add('launch-app'); 
    setTimeout(() => {
        homeScreen.classList.add('hidden');
        homeScreen.classList.remove('launch-app'); 
        document.getElementById('welcome-ui').classList.remove('hidden');
        document.body.style.backgroundColor = "var(--ios-bg)";
        document.documentElement.style.backgroundColor = "var(--ios-bg)";
        document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
        document.getElementById('ios-status-bar').classList.remove('status-light');
        document.getElementById('ios-status-bar').classList.add('status-dark');
        playTada(); 
    }, 300); 
}

function fakeAppAlert(appName) {
    if (appName === 'Santander') {
        playTap();
        
        // 1. Pintamos el fondo del móvil de blanco para cubrir el 'notch' y la parte inferior
        document.body.style.backgroundColor = "#ffffff";
        document.documentElement.style.backgroundColor = "#ffffff";
        document.getElementById('meta-theme-color').setAttribute('content', '#ffffff');

        // 2. Mostramos la app con animación
        const santanderUI = document.getElementById('fake-santander-ui');
        santanderUI.classList.remove('hidden');
        santanderUI.classList.add('fade-in');

        setTimeout(() => {
            playError();
            if(navigator.vibrate) navigator.vibrate([200, 100, 200]);
            
            // 3. Ocultamos la app
            santanderUI.classList.add('hidden');
            santanderUI.classList.remove('fade-in');

            // 4. Restauramos el fondo del escritorio de iOS
            document.body.style.backgroundColor = "var(--ios-bg)";
            document.documentElement.style.backgroundColor = "var(--ios-bg)";
            document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');

            showCustomAlert("🔒 Modo Rata Activado", "Acceso denegado. No quieres ver tu saldo después de la obra... créeme.");
        }, 2000);
        return; // Salimos para que no ejecute el alert normal
    }

    playError();
    if(navigator.vibrate) navigator.vibrate([50, 50, 50]);
    let msg = "El 'Modo Rata' ha bloqueado esta app para ahorrar batería y megas.";
    
    if(appName === 'Strava') msg = "Prohibido correr hoy. Tienes que guardar energía para los 27 años.";
    if(appName === 'Bet365') msg = "Demasiadas pérdidas. Aplicación desinstalada por salud mental.";
    if(appName === 'WhatsApp') msg = "AA mamá preguntando cómo llevas lo del IBI. Mejor lo ignoramos hoy.";
    if(appName === 'Mail') msg = "Tienes 99+ facturas del KALLAX de IKEA. Mejor no entrar.";
    if(appName === 'Fotos') msg = "Almacenamiento lleno. Tienes 4.500 fotos de azulejos para el baño, capturas de Idealista y fotos de postureo.";
    if(appName === 'Notas') msg = "Tu nota 'Presupuesto Reforma' ha colapsado el sistema por exceso de ceros.";
    if(appName === 'Ajustes') msg = "No puedes ajustar nada. El Euríbor ya te ha ajustado la cuenta corriente.";
    if(appName === 'Spotify') msg = "Pásate a Premium, rata. Que estás escuchando más anuncios que música.";
    
    showCustomAlert("🔒 " + appName + " Bloqueado", msg);
}

function startCameraVerification() {
    playTap();
    document.getElementById('welcome-ui').classList.add('hidden');
    document.getElementById('camera-ui').classList.remove('hidden');
}

function processPhoto(event) {
    const file = event.target.files[0];
    if (!file) {
        showCustomAlert("Sin foto 📷", "Anda, saca la foto. No te escapas tan fácil.");
        return;
    }
    playTap(); 
    playShutter();
    const flash = document.getElementById('camera-flash');
    flash.style.opacity = '1';
    setTimeout(() => flash.style.opacity = '0', 150);

    if(file) {
        const imgUrl = URL.createObjectURL(file);
        const preview = document.getElementById('selfie-preview');
        preview.style.backgroundImage = `url(${imgUrl})`;
        preview.style.display = 'block';
        document.getElementById('scan-emoji').style.display = 'none'; 
    }

    document.getElementById('camera-ui').classList.add('hidden');
    document.getElementById('camera-loading-ui').classList.remove('hidden');
    
    setTimeout(() => {
        // --- NUEVA MEJORA: Escáner troll ---
        document.getElementById('scan-title').innerText = "Análisis completado";
        document.getElementById('scan-title').style.color = "#ff9500";
        document.getElementById('scan-desc').innerText = "Edad estimada: 45 años (Efectos de la obra detectados). Ajustando a 27...";
        
        setTimeout(() => {
            document.getElementById('laser').style.display = 'none'; 
            document.getElementById('scan-title').innerText = "Identidad Confirmada";
            document.getElementById('scan-title').style.color = "#2e7d32";
            document.getElementById('scan-desc').innerText = "Nivel de estrés apto para iniciar el test.";
            document.getElementById('selfie-preview').style.opacity = "0.5";
            document.getElementById('scan-emoji').innerText = "✅";
            document.getElementById('scan-emoji').style.display = 'block';
            document.getElementById('scan-emoji').style.position = 'absolute';
            document.getElementById('scan-emoji').style.zIndex = '20';
            playTada(); 
            if(navigator.vibrate) navigator.vibrate([50, 100, 50]);
            
            setTimeout(() => {
                document.getElementById('camera-loading-ui').classList.add('hidden');
                document.getElementById('start-test-ui').classList.remove('hidden');
                document.getElementById('start-test-ui').classList.add('fade-in');
            }, 2000);
        }, 3000); // Tarda 3 segundos más en darle el ok para asustarla
        // ------------------------------------
    }, 2500);
}

function startQuiz() {
    playTap();
    document.getElementById('start-test-ui').classList.add('hidden');
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.getElementById('quiz-ui').classList.add('fade-in');
    renderQ();
}

const data = [
    { q: "A nivel Strava, tu ritmo actual de vida es:", a: [{t:"Sprint constante y agobiante", s:'j'}, {t:"Trote cochinero (8:45 min/km)", s:'p'}, {t:"Descanso activo en el sofá", s:'p'}]},
    { q: "Te apuntas al gimnasio pero solo vas una vez al mes...", a: [{t:"Acepto que mi dinero se ha perdido", s:'p'}, {t:"Me obligo a ir aunque esté muerta para amortizar", s:'n'}, {t:"Busco excusas para no sentirme culpable", s:'j'}]},
    { q: "Es verano y ves por la calle a alguien con los talones agrietados...", a: [{t:"Le ofrezco mi tarjeta de podóloga", s:'n'}, {t:"Me dan escalofríos y aparto la mirada", s:'p'}, {t:"Siento el impulso de sacar la lima", s:'j'}]},
    { q: "Cobras pasta de podóloga, pero ves un bocadillo de tortilla brutal de 6€...", a: [{t:"Paso, el tupper manda", s:'n'}, {t:"Lo compro y sufro por el gasto", s:'n'}, {t:"¡Dámelo, que facturo bien!", s:'j'}]},
    { q: "Pierdo una combinada del BET365 en el último minuto...", a: [{t:"Respiro y acepto la derrota", s:'p'}, {t:"Me enfado, y culpo a mi hermano", s:'j'}, {t:"Borro la app para siempre", s:'n'}]},
    { q: "Toca pagar tu parte de la Primitiva semanal al papá...", a: [{t:"Hago un Bizum al instante", s:'p'}, {t:"Me hago la sueca y pago 2 semanas tarde", s:'n'}, {t:"Le digo que me lo descuente de los regalos", s:'n'}]},
    { q: "Vas al Mercadona a hacer la compra de la semana...", a: [{t:"Voy directa a la sección de marcas blancas", s:'n'}, {t:"Acabo comprando caprichos y dulces", s:'j'}, {t:"Llevo la lista calculada al céntimo", s:'n'}]},
    { q: "Toca hacer la Declaración de la Renta o rellenar un papel oficial...", a: [{t:"Me leo las bases y lo hago yo misma", s:'p'}, {t:"¡MAMÁAAAAA! ¿Me haces esto?", s:'n'}, {t:"Lo dejo para el último día y lloro", s:'j'}]},
    { q: "Te llega un correo súper formal del banco o del seguro...", a: [{t:"Lo analizo como una adulta funcional", s:'p'}, {t:"Captura de pantalla y WhatsApp a AA mamá", s:'n'}, {t:"Lo marco como no leído, ya llamarán", s:'j'}]},
    { q: "Se junta la firma de la hipoteca con la cuota del coche...", a: [{t:"Respiro hondo y pido un lexatín", s:'p'}, {t:"Grito internamente de desesperación", s:'j'}, {t:"Paso a comer arroz blanco 6 meses", s:'n'}]},
    { q: "¿Cómo va esa reforma infinita del piso?", a: [{t:"Controlada (mentira cochina)", s:'p'}, {t:"Ni hemos empezado no hay dinero", s:'j'}, {t:"No quiero mirar la cuenta bancaria", s:'n'}]},
    { q: "Tu niño ❤️ dice que va a descargar camiones para pagar la hipoteca...", a: [{t:"Le animo desde mi sofá relax", s:'p'}, {t:"Voy con él a cargar cajas a tope", s:'j'}, {t:"Calculo cuánto ganará al mes", s:'n'}]},
    { q: "Montas un mueble KALLAX de IKEA y sobra un tornillo importante...", a: [{t:"Respiro hondo y busco mi paz", s:'p'}, {t:"Le doy una patada al mueble", s:'j'}, {t:"Fingimos que es diseño", s:'n'}]},
    { q: "Falta papel higiénico para el piso nuevo...", a: [{t:"Compro el suave, es inversión", s:'p'}, {t:"Pillo la marca blanca que raspa", s:'n'}, {t:"Me llevo los rollos de la clínica", s:'n'}]},
    { q: "Un bicho mutante volador gigante entra al salón:", a: [{t:"Le dejo las llaves y me mudo", s:'p'}, {t:"Zapatillazo y a por el siguiente", s:'j'}, {t:"Mando a mi niño ❤️ a matarlo", s:'p'}]},
    { q: "Alguien mastica chicle con eco o hace ruido con la boca mientras come...", a: [{t:"Elijo la violencia absoluta", s:'j'}, {t:"Sufro en silencio riguroso", s:'p'}, {t:"Le suelto un moco", s:'j'}]},
    { q: "Sales de fiesta un viernes hasta las 6 de la mañana...", a: [{t:"Al día madrugo tan normal", s:'p'}, {t:"Necesito 3 días de sofá para recuperarme", s:'j'}, {t:"Mejor me quedo en casa y no gasto", s:'n'}]},
    { q: "¿Qué es lo mejor de vivir en Sant Andreu?", a: [{t:"Que no es La Mina", s:'n'}, {t:"La calma y pasear por la Rambla", s:'p'}, {t:"Las fiestas", s:'j'}]},
    { q: "¿Cuál es tu mayor orgullo de adulta a los 27?", a: [{t:"Saber cambiar una bombilla sola", s:'j'}, {t:"Tener la vajilla a juego", s:'p'}, {t:"Saber hacer una tortilla francesa", s:'n'}]},
    { q: "Última: ¿Cómo quieres celebrar los 27 añazos?", a: [{t:"Con paz total flotando en las nubes", s:'p'}, {t:"Gritando para soltar adrenalina pura", s:'j'}]}
];

let idx = 0; let p = 0; let j = 0; let n = 0;

function renderQ() {
    if (idx === 10 && !hasCalled) {
        hasCalled = true; triggerFakeCall(); return;
    }
    if (idx === 15 && !hasPaletaCalled) {
        hasPaletaCalled = true; triggerPaletaCall(); return;
    }

    // Lógica de la batería (Estilo iOS Real)
    let currentBattery = Math.max(2, 15 - Math.floor(idx * 0.7));
    document.getElementById('battery-text').innerText = `${currentBattery}%`;
    
    let batteryFill = document.getElementById('battery-fill');
    batteryFill.style.width = `${currentBattery}%`;
    
    if (currentBattery <= 10) {
        batteryFill.style.backgroundColor = "#ff3b30"; 
    } else {
        batteryFill.style.backgroundColor = ""; 
    }

    const ui = document.getElementById('quiz-ui');
    ui.classList.remove('fade-in'); void ui.offsetWidth; ui.classList.add('fade-in');

    document.getElementById('fill').style.width = (idx / data.length * 100) + "%";
    const current = data[idx];
    document.getElementById('question').innerText = current.q;
    
    const box = document.getElementById('options'); box.innerHTML = "";
    current.a.forEach(opt => {
        const b = document.createElement('button');
        b.className = "opt-btn"; b.innerText = opt.text || opt.t;
        b.onclick = () => {
            playTap(); 
            if(navigator.vibrate) navigator.vibrate(10); 
            if(opt.s === 'p') p++; if(opt.s === 'j') j++; if(opt.s === 'n') n++;
            idx++;
            if(idx < data.length) renderQ(); else showLoading();
        };
        box.appendChild(b);
    });
}

function showLoading() {
    document.getElementById('quiz-ui').classList.add('hidden');
    document.getElementById('loading-ui').classList.remove('hidden');
    document.getElementById('loading-ui').classList.add('fade-in');
    
    const texts = ["Midiendo paciencia con las reformas...", "Buscando dinero perdido en Bet365...", "Diagnosticando nivel de Rata...", "Analizando traumas con muebles IKEA...", "Finalizando tratamiento..."];
    let i = 0;
    const textEl = document.getElementById('loading-text');
    const interval = setInterval(() => { if(i < texts.length) { textEl.innerText = texts[i]; i++; } else { clearInterval(interval); } }, 1500); 

    setTimeout(() => {
        document.getElementById('battery-text').innerText = '1%'; 
        document.getElementById('battery-fill').style.width = '1%';
        document.getElementById('battery-fill').style.backgroundColor = '#ff3b30';
        document.getElementById('battery-status').classList.add('battery-critical');
        playError(); showCustomAlert("Batería Crítica 🪫", "Sobrevives a la obra y al Bet365, pero a tu móvil le queda 1%. Date prisa.");
    }, 3000);

    // SECUENCIA DE MENSAJES DE HACKEO
    setTimeout(() => {
        const blackout = document.getElementById('blackout-overlay');
        blackout.style.opacity = '1';
        blackout.innerHTML = '<div id="blackout-text" style="color: #34c759; font-family: monospace; position: absolute; top: 50%; left: 10%; width: 80%; text-align: center; font-size: 15px; text-shadow: 0 0 5px #34c759;">Iniciando protocolo de emergencia...</div>';
        document.body.style.backgroundColor = "#000000"; document.documentElement.style.backgroundColor = "#000000";
        document.getElementById('meta-theme-color').setAttribute('content', '#000000');
        
        let bText = document.getElementById('blackout-text');
        setTimeout(() => bText.innerText = "Calculando deuda de IKEA...", 3000);
        setTimeout(() => bText.innerText = "Buscando fondos en los cojines del sofá...", 7000);
        setTimeout(() => bText.innerText = "Restaurando juventud... ERROR 404", 10000);
        setTimeout(() => bText.innerText = "Iniciando desfibrilador financiero...", 13000);

        // ¡NUEVO!: Iniciamos el juego 3 segundos después del último mensaje (Total 16s después del inicio del blackout)
        setTimeout(() => {
            // FIX: Ocultamos la UI blanca y mostramos el fondo del minijuego ANTES de quitar el negro
            document.getElementById('loading-ui').classList.add('hidden');
            document.getElementById('minigame-ui').classList.remove('hidden');

            blackout.style.opacity = '0'; // Desvanecemos el negro
            setTimeout(() => {
                blackout.innerHTML = ''; 
                startMiniGame(); // LANZAMOS LA LÓGICA DEL JUEGO
            }, 600);
        }, 16000);
    }, 5000);
}

function showStats() {
    const blackout = document.getElementById('blackout-overlay');
    blackout.style.opacity = '0'; blackout.innerHTML = ''; 
    
    document.body.style.backgroundColor = "var(--ios-bg)"; document.documentElement.style.backgroundColor = "var(--ios-bg)";
    document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
    document.getElementById('loading-ui').classList.add('hidden');
    document.getElementById('stats-ui').classList.remove('hidden');
    document.getElementById('stats-ui').classList.add('fade-in');

    let estres = Math.min(99, Math.floor((j / 8) * 100) + 20); 
    let rata = Math.min(100, Math.floor((n / 6) * 100) + 30); 
    let miso = Math.floor(Math.random() * 5) + 95; 
    let cuca = Math.floor(Math.random() * 5) + 2;  

    setTimeout(() => {
        document.getElementById('bar-estres').style.width = estres + '%'; document.getElementById('p-estres').innerText = estres + '%';
        document.getElementById('bar-rata').style.width = rata + '%'; document.getElementById('p-rata').innerText = rata + '%';
        document.getElementById('bar-miso').style.width = miso + '%'; document.getElementById('p-miso').innerText = miso + '%';
        document.getElementById('bar-cuca').style.width = cuca + '%'; document.getElementById('p-cuca').innerText = cuca + '%';
        playTada(); 
    }, 100);
}

function finish() {
    playTap();
    document.getElementById('stats-ui').classList.add('hidden');
    document.getElementById('result-ui').classList.remove('hidden');
    document.getElementById('result-ui').classList.add('fade-in');

    // 1. Configuración de fecha
    const hoy = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaStr = hoy.toLocaleDateString('es-ES', opciones);
    const cartaFecha = document.getElementById('carta-fecha');
    if (cartaFecha) cartaFecha.innerText = fechaStr;
    
    // 2. Determinamos el tratamiento según los resultados
    const res = j > p ? "PUENTING" : "PARAPENTE";
    document.getElementById('res-title').innerText = "TRATAMIENTO: " + res;
    
    // Emoji corregido
    document.getElementById('res-icon').innerText = res === "PUENTING" ? "🌉" : "🪂";
    
    document.getElementById('res-desc').innerText = res === "PUENTING" ? 
        "El análisis muestra niveles críticos de estrés por la obra y demasiada energía reprimida por los ruiditos y el Bet365. Prescribo soltar tensión saltando al vacío. ¡Adrenalina pura para tus 27!" : 
        "El análisis indica que necesitas alejarte de los ruiditos, los bichos y las deudas de la Primitiva. Tu receta es volar sobre las nubes en silencio total. ¡Paz para la nueva propietaria!";

    // 3. EFECTO MÁQUINA DE ESCRIBIR COMPLETO (Desde Ale hasta la firma)
    
    // Guardamos la cabecera (fecha) y el botón para que no se borren
    const headerHTML = `<div style="font-size:10px; color:#bbb; text-align:right; margin-bottom:12px; font-family:'Courier New',monospace;">Barcelona, <span id="carta-fecha">${fechaStr}</span></div>`;
    const buttonHTML = `<button class="action-btn secondary-btn" style="background:#e8d5a3; color:#333; font-size:13px; margin-top:20px; border: 1px solid #d4c08f;" onclick="toggleCarta()">Cerrar Carta 📜</button>`;

    // Todo el cuerpo de la carta que se va a escribir solo
    const bodyHTML = `
<p style="font-family:'Georgia',serif; font-size:14px; line-height:1.9; color:#3a3a3a; margin:0 0 12px;">Ale,</p>
<p style="font-family:'Georgia',serif; font-size:13px; line-height:1.9; color:#3a3a3a; margin:0 0 10px;">Si has llegado hasta aquí, enhorabuena. Has sobrevivido al test, al paleta, al Santander y a tu propio nivel de <em>rata</em>. Eso ya dice mucho de ti.</p>
<p style="font-family:'Georgia',serif; font-size:13px; line-height:1.9; color:#3a3a3a; margin:0 0 10px;">El regalo real no es el <strong>${res.toLowerCase()}</strong>. El regalo es que este año, por muy agobiante que haya sido con la hipoteca, las futuras reformas y los bichos mutantes… lo has petado. Tienes <strong>un piso. Tuyo.</strong></p>
<p style="font-family:'Georgia',serif; font-size:13px; line-height:1.9; color:#3a3a3a; margin:0 0 16px;">Felices 27, hermana. Te quiero mucho.&nbsp;❤️</p>
<div style="text-align:right; margin-top: 15px;">
    <svg width="160" height="70" viewBox="0 0 160 70" style="overflow:visible; transform: rotate(-4deg);">
        <path d="M 20,55 L 45,15 L 20,45 L 85,45" stroke="#1a237e" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 45,45 C 40,65 60,70 65,55" stroke="#1a237e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 65,55 C 75,25 110,15 125,30 C 140,45 110,60 145,45 C 155,40 160,45 145,55 Z" stroke="#1a237e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 15,50 C 60,55 100,50 150,45" stroke="#1a237e" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
    </svg>
    <div style="font-family:'Georgia',serif; font-size:12px; color:#888; margin-top:5px; font-style:italic;">El mejor hermano del mundo</div>
</div>`;

    // Reconstruimos el contenedor
    const contentContainer = document.querySelector('.carta-content');
    contentContainer.innerHTML = headerHTML + `<div id="typewriter-container"></div>` + buttonHTML;
    const typeContainer = document.getElementById('typewriter-container');

    let charIndex = 0;
    let isTag = false;
    let textoAcumulado = "";

    function typeWriter() {
        if (charIndex < bodyHTML.length) {
            textoAcumulado += bodyHTML.charAt(charIndex);
            
            // Si es código HTML lo saltamos de golpe para no romper el diseño
            if (bodyHTML.charAt(charIndex) === '<') isTag = true;
            if (bodyHTML.charAt(charIndex) === '>') isTag = false;

            typeContainer.innerHTML = textoAcumulado;
            charIndex++;

            if (isTag) {
                typeWriter(); // Sin pausa para el código interno
            } else {
                setTimeout(typeWriter, 45); 
            }
        }
    }

    // 4. PREPARAR EL MENSAJE DE WHATSAPP
    let eStr = document.getElementById('p-estres').innerText;
    let rStr = document.getElementById('p-rata').innerText;
    let mStr = document.getElementById('p-miso').innerText;
    let cStr = document.getElementById('p-cuca').innerText;

    let mensaje = `¡He sobrevivido al test psicotécnico de los 27! 🤣\n\n📊 Mis resultados:\n🏚️ Estrés (Hipoteca+Obra): ${eStr}\n💸 Nivel Rata: ${rStr}\n🤬 Riesgo por Ruiditos: ${mStr}\n🐛 Supervivencia Bichos: ${cStr}\n\nMi tratamiento oficial es: *${res}*. \n\n¡Ve preparando el fin de semana, mejor hermano del mundo: guapo, musculoso, arrollador, titánico, inteligente, brillante, valiente, legendario, fuera de serie, de otro nivel...! 🎁`;    
    
    const btn = document.getElementById('whatsapp-btn');
    btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    btn.innerHTML = `<span style="font-size: 18px;">📲</span> Reclamar mi ${res}`;

    // 5. SECUENCIA FINAL: Confetti + Abrir Carta
    playTada(); 
    
    var duration = 4000; 
    var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ce93d8', '#9c27b0', '#ffffff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ce93d8', '#9c27b0', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    setTimeout(() => {
        const carta = document.getElementById('carta-hermano');
        carta.querySelector('.carta-content').classList.add('efecto-pergamino');
        carta.classList.add('show-carta');
        document.getElementById('carta-tab').classList.remove('visible');
        
        // Empieza a escribir toda la carta 1 segundo después de que baje el pergamino
        setTimeout(typeWriter, 1000);
    }, 2500);
}

let dodges = 0; const dodgeTexts = ["¡Uy, casi!", "¿No hay fondos?", "¡Más rápida!", "¡Paga la obra!", "Pagar 400.00€ (Bizum)"];
function dodgeButton(btn) {
    if (dodges < 4) {
        const x = (Math.random() - 0.5) * 120; const y = (Math.random() - 0.5) * 60;  
        btn.style.transform = `translate(${x}px, ${y}px)`; btn.innerText = dodgeTexts[dodges]; dodges++;
    }
}
function catchButton() {
    playTada(); showCustomAlert("¡Tranquila, rata! 💸", "El piso te ha dejado seca, ya invito yo. ¡Felices 27!");
    const btn = document.getElementById('troll-pay-btn');
    btn.style.transform = "translate(0px, 0px)"; btn.innerText = "Pagar 400.00€ (Bizum)"; dodges = 0;
}

function openModal(id) {
    playTap(); document.getElementById(id).classList.add('show-modal');
    document.body.style.backgroundColor = "#615c62"; document.documentElement.style.backgroundColor = "#615c62"; document.getElementById('meta-theme-color').setAttribute('content', '#615c62');
}
function closeModal(id) {
    playTap(); document.getElementById(id).classList.remove('show-modal');
    document.body.style.backgroundColor = "var(--ios-bg)"; document.documentElement.style.backgroundColor = "var(--ios-bg)"; document.getElementById('meta-theme-color').setAttribute('content', '#f3e5f5');
    if(id === 'invoice-modal') {
        const btn = document.getElementById('troll-pay-btn');
        if(btn) { btn.style.transform = "translate(0px, 0px)"; btn.innerText = "Pagar 400.00€ (Bizum)"; }
        dodges = 0;
    }
}

let gameScore = 0;
let gameInterval;

function startMiniGame() {
    // Aseguramos fondo negro para el juego
    document.body.style.backgroundColor = "#0a0a0a";
    document.documentElement.style.backgroundColor = "#0a0a0a"; // Añadido para iOS
    document.getElementById('meta-theme-color').setAttribute('content', '#0a0a0a'); // Añadido para el notch
    
    // (Línea eliminada: ya no mostramos el UI aquí, sino antes del fadeout)
    
    gameScore = 0;
    document.getElementById('game-score').innerText = "0/10";
    document.getElementById('game-score').style.color = "#34c759";
    
    // Generar un objeto cada 600ms
    gameInterval = setInterval(spawnBill, 600);
}

function spawnBill() {
    const area = document.getElementById('game-area');
    const bill = document.createElement('div');
    bill.className = 'falling-bill';
    
    // 15% de probabilidad de que sea una trampa
    const isTrap = Math.random() > 0.85; 
    
    if (isTrap) {
        const traps = ['🪳', '🔩'];
        bill.innerText = traps[Math.floor(Math.random() * traps.length)];
        bill.dataset.type = "trap";
    } else {
        const items = ['💸', '💶', '💰', '🧾', '🪙'];
        bill.innerText = items[Math.floor(Math.random() * items.length)];
        bill.dataset.type = "money";
    }
    
    bill.style.left = Math.floor(Math.random() * 80 + 5) + '%';
    
    let baseSpeed = Math.random() * 1.2 + 1.8;
    let speed = baseSpeed - (gameScore * 0.15); 
    if (speed < 0.7) speed = 0.7; 
    
    if (gameScore === 9 && !isTrap) {
        speed = 0.4;
        bill.style.fontSize = "60px"; 
    }
    
    bill.style.animationDuration = speed + 's';

    const handleCapture = (e) => {
        e.preventDefault();
        if(gameScore < 10) {
            bill.remove();
            
            if (bill.dataset.type === "trap") {
                // TRAMPA: Resta punto y pantalla roja
                playError();
                if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
                gameScore = Math.max(0, gameScore - 1); // No baja de 0
                
                // Efecto de daño
                const blackout = document.getElementById('blackout-overlay');
                blackout.style.background = "red";
                blackout.style.opacity = "0.5";
                setTimeout(() => { blackout.style.opacity = "0"; blackout.style.background = "black"; }, 150);

            } else {
                // ACIERTO: Suma punto
                gameScore++;
                playTap();
            }
            
            document.getElementById('game-score').innerText = gameScore + "/10";
            if(gameScore === 10) finishGame();
        }
    };
    
    bill.addEventListener('mousedown', handleCapture);
    bill.addEventListener('touchstart', handleCapture, {passive: false});
    
    area.appendChild(bill);
    setTimeout(() => { if(bill.parentElement) bill.remove(); }, speed * 1000);
}

function finishGame() {
    clearInterval(gameInterval);
    const scoreHeader = document.getElementById('game-score');
    scoreHeader.innerText = "SISTEMA RESTAURADO";
    scoreHeader.style.color = "#fff";
    document.getElementById('game-area').innerHTML = "";
    
    playTada();
    
    setTimeout(() => {
        document.getElementById('minigame-ui').classList.add('hidden');
        showStats(); // Por fin, mostramos los resultados
    }, 2000);
}

// --- LÓGICA DE LA CARTA / PERGAMINO ---
function toggleCarta() {
    playTap();
    const carta = document.getElementById('carta-hermano');
    const tab = document.getElementById('carta-tab');
    
    if (carta.classList.contains('show-carta')) {
        // Ocultar carta y mostrar pestaña
        carta.classList.remove('show-carta');
        tab.classList.add('visible');
    } else {
        // Mostrar carta y ocultar pestaña
        carta.classList.add('show-carta');
        tab.classList.remove('visible');
    }
}

// Detectar deslizamiento (swipe) desde el borde derecho para sacar la carta
let swipeCartaStartX = 0;

document.addEventListener('touchstart', e => {
    swipeCartaStartX = e.touches[0].clientX;
}, {passive: true});

document.addEventListener('touchend', e => {
    let swipeCartaEndX = e.changedTouches[0].clientX;
    
    // Si inicia muy a la derecha (últimos 40px) y desliza hacia la izquierda más de 50px
    if (swipeCartaStartX > window.innerWidth - 40 && (swipeCartaStartX - swipeCartaEndX) > 50) {
        const resultUI = document.getElementById('result-ui');
        const carta = document.getElementById('carta-hermano');
        
        // Solo abrir si estamos en la pantalla final y la carta está oculta
        if (!resultUI.classList.contains('hidden') && !carta.classList.contains('show-carta')) {
            toggleCarta();
        }
    }
}, {passive: true});