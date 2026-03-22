const API_URL = 'https://apiesmaralda.up.railway.app/api'; // Cambiar en producción por https://tu-backend.up.railway.app/api

let turnstileWidgetId = null;
let isSubmitting = false;

// Función para mostrar toast
function showToast(message, type = 'success', duration = 4000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast) {
        console.error('❌ Elemento toast no encontrado');
        alert(message); // fallback por si no existe el toast
        return;
    }

    // Remover clases anteriores
    toast.classList.remove('success', 'error', 'show');

    // Configurar según tipo
    if (type === 'success') {
        toast.classList.add('success');
        toastIcon.className = 'fas fa-check-circle';
    } else {
        toast.classList.add('error');
        toastIcon.className = 'fas fa-exclamation-circle';
    }

    toastMessage.textContent = message;

    // Mostrar
    toast.classList.add('show');

    // Ocultar después del tiempo
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function initFormulario() {
    const form = document.getElementById('form-contacto');

    if (!form) {
        console.error('❌ Formulario de contacto no encontrado');
        return;
    }

    console.log('✅ Formulario encontrado, inicializando...');

    // Renderizar Turnstile manualmente si existe el contenedor
    const captchaContainer = document.querySelector('.cf-turnstile');

    if (window.turnstile && captchaContainer) {
        turnstileWidgetId = turnstile.render(captchaContainer, {
            sitekey: '1x00000000000000000000AA', // Usar clave de prueba o real
            theme: 'dark'
        });

        console.log('🛡️ Captcha Turnstile renderizado');
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (isSubmitting) {
            showToast('⏳ Ya se está enviando el formulario, espera un momento.', 'error');
            return;
        }

        // Obtener token del captcha
        const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

        if (!turnstileToken) {
            showToast('Por favor, completa el captcha', 'error');
            return;
        }

        isSubmitting = true;

        // Recoger datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Eliminar la entrada original del captcha
        delete data['cf-turnstile-response'];

        // Añadir token con el nombre esperado por el backend
        data['cf_turnstile_response'] = turnstileToken;

        console.log('📤 Enviando datos:', data);

        try {
            const response = await fetch(`${API_URL}/contacto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            console.log('📥 Respuesta del servidor:', result);

            if (response.ok) {
                showToast('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');

                form.reset();

                // Resetear captcha
                if (window.turnstile && turnstileWidgetId !== null) {
                    turnstile.reset(turnstileWidgetId);
                }
            } else {
                showToast('Error: ' + (result.error || 'No se pudo enviar el mensaje.'), 'error');
            }
        } catch (error) {
            console.error('❌ Error en fetch:', error);
            showToast('Error de conexión. Intenta más tarde.', 'error');
        } finally {
            isSubmitting = false;
        }
    });
}

// Esperar a que los componentes estén cargados
document.addEventListener('componentesCargados', initFormulario);

// También intentar inicializar si el evento ya ocurrió (por si acaso)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initFormulario, 500);
}