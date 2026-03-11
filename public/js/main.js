// Actualizar carrito en localStorage
function updateCartUI() {
    // Sincronizar carrito con el servidor
    $.get('/carrito', function() {
        // El carrito se actualiza automáticamente en el servidor
    }).fail(function() {
        console.error('Error updating cart');
    });
}

// Agregar producto al carrito
$(document).on('click', '.add-to-cart', function(e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    const quantity = 1;

    if (!productId) {
        showNotification('No se pudo identificar el producto', 'danger');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/carrito/add',
        data: {
            productId: productId,
            quantity: quantity
        },
        success: function(response) {
            if(response.success) {
                showNotification('Producto agregado al carrito', 'success');
                
                // Actualizar badge del carrito
                updateCartBadge(response.cartCount);
            }
        },
        error: function() {
            showNotification('Error al agregar el producto', 'danger');
        }
    });
});

// Agregar producto desde detalle
$(document).on('click', '.add-single-product', function(e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    const quantity = parseInt($('#quantity').val()) || 1;
    const selectedSize = $('#selectedSize').val() || null;
    const selectedPrice = parseFloat($('#selectedPrice').val());

    if (!productId) {
        showNotification('No se pudo identificar el producto', 'danger');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/carrito/add',
        data: {
            productId: productId,
            quantity: quantity,
            size: selectedSize,
            price: Number.isFinite(selectedPrice) ? selectedPrice : undefined
        },
        success: function(response) {
            if(response.success) {
                showNotification('¡Producto agregado al carrito!', 'success');
                updateCartBadge(response.cartCount);
                // Cambiar texto del botón temporalmente
                const btn = $('.add-single-product');
                const originalText = btn.html();
                btn.html('<i class="fas fa-check"></i> Agregado').prop('disabled', true);
                setTimeout(() => {
                    btn.html(originalText).prop('disabled', false);
                }, 2000);
            }
        },
        error: function() {
            showNotification('Error al agregar el producto', 'danger');
        }
    });
});

// Seleccionar presentacion en detalle
$(document).on('click', '.size-option-btn', function() {
    const button = $(this);
    const size = button.data('size');
    const price = parseFloat(button.data('price'));

    $('.size-option-btn').removeClass('active');
    button.addClass('active');

    if (Number.isFinite(price)) {
        $('#productPrice').text(`$${price.toFixed(2)}`);
        $('#selectedPrice').val(price);
    }

    if (size) {
        $('#selectedSize').val(size);
    }
});

// Aumentar cantidad en carrito
$(document).on('click', '.increase-quantity', function() {
    const productId = $(this).data('product-id');
    const input = $(`.quantity-input[data-product-id="${productId}"]`);
    const newQuantity = parseInt(input.val()) + 1;
    updateQuantity(productId, newQuantity);
});

// Disminuir cantidad en carrito
$(document).on('click', '.decrease-quantity', function() {
    const productId = $(this).data('product-id');
    const input = $(`.quantity-input[data-product-id="${productId}"]`);
    const newQuantity = Math.max(1, parseInt(input.val()) - 1);
    updateQuantity(productId, newQuantity);
});

// Actualizar cantidad cuando cambia el input
$(document).on('change', '.quantity-input', function() {
    const productId = $(this).data('product-id');
    const newQuantity = parseInt($(this).val()) || 1;
    if(newQuantity > 0) {
        updateQuantity(productId, newQuantity);
    }
});

// Función para actualizar cantidad
function updateQuantity(productId, quantity) {
    $.ajax({
        type: 'POST',
        url: `/carrito/update/${productId}`,
        data: { quantity: quantity },
        success: function(response) {
            if(response.success) {
                // Actualizar el subtotal
                const input = $(`.quantity-input[data-product-id="${productId}"]`);
                const tr = input.closest('tr');
                const price = parseFloat(tr.find('td:eq(1)').text().replace('$', ''));
                const subtotal = (price * quantity).toFixed(2);
                tr.find('td:eq(3)').html(`$${subtotal}`);
                
                // Actualizar totales
                updateCartTotals(response.total);
                showNotification('Cantidad actualizada', 'success');
            }
        },
        error: function() {
            showNotification('Error al actualizar cantidad', 'danger');
        }
    });
}

// Actualizar totales del carrito
function updateCartTotals(subtotal) {
    const tax = (subtotal * 0.16).toFixed(2);
    const total = (subtotal * 1.16).toFixed(2);
    
    $('#subtotal').text(parseFloat(subtotal).toFixed(2));
    $('#tax').text(tax);
    $('#total').text(total);
}

// Eliminar producto del carrito
$(document).on('click', '.remove-from-cart', function(e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    
    if(confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        $.ajax({
            type: 'POST',
            url: `/carrito/remove/${productId}`,
            contentType: 'application/json',
            success: function(response) {
                if(response.success) {
                    // Recargar la página del carrito
                    location.reload();
                }
            },
            error: function() {
                showNotification('Error al eliminar el producto', 'danger');
            }
        });
    }
});

// Vaciar carrito
$(document).on('click', '.clear-cart', function(e) {
    e.preventDefault();
    if(confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        $.ajax({
            type: 'POST',
            url: '/carrito/clear',
            contentType: 'application/json',
            success: function(response) {
                if(response.success) {
                    location.reload();
                }
            },
            error: function() {
                showNotification('Error al vaciar el carrito', 'danger');
            }
        });
    }
});

// Procesar checkout
$(document).on('click', '#processCheckout', function(e) {
    e.preventDefault();
    
    const customerName = $('#customerName').val();
    const customerEmail = $('#customerEmail').val();
    const customerPhone = $('#customerPhone').val();
    const address = $('#address').val();
    const notes = $('#notes').val();
    
    if(!customerName || !customerEmail || !customerPhone || !address) {
        showNotification('Por favor completa todos los campos requeridos', 'warning');
        return;
    }
    
    // Mostrar loading
    const btn = $(this);
    const originalText = btn.html();
    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Procesando...');
    
    $.ajax({
        type: 'POST',
        url: '/carrito/checkout',
        data: {
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            address: address,
            notes: notes
        },
        success: function(response) {
            if(response.success) {
                showNotification('¡Pedido creado exitosamente!', 'success');
                
                // Cerrar modal después de 1 segundo
                setTimeout(() => {
                    // Redirigir a WhatsApp para confirmación
                    if(response.whatsappUrl) {
                        const confirmRedirect = confirm('Tu pedido se ha creado. ¿Deseas confirmar por WhatsApp?');
                        if(confirmRedirect) {
                            window.open(response.whatsappUrl, '_blank');
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1000);
                        } else {
                            window.location.href = '/';
                        }
                    } else {
                        window.location.href = '/';
                    }
                }, 1000);
            }
        },
        error: function(xhr) {
            const error = JSON.parse(xhr.responseText);
            showNotification(error.message || 'Error al procesar el pedido', 'danger');
            btn.prop('disabled', false).html(originalText);
        }
    });
});

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                       type === 'danger' ? 'alert-danger' : 
                       type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const alert = $(`
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    // Insertar al principio del body
    $('body').prepend(alert);
    
    // Desaparecer después de 4 segundos
    setTimeout(() => {
        alert.fadeOut(300, function() {
            $(this).remove();
        });
    }, 4000);
}

// Actualizar badge del carrito
function updateCartBadge(count) {
    const badge = $('#cartBadge');
    if(count > 0) {
        badge.text(count).show();
    } else {
        badge.hide();
    }
}

// Formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}

// Inicialización al cargar el documento
$(document).ready(function() {
    // Validar formulario de contacto
    const contactForm = $('form[action="/contacto"]');
    if(contactForm.length > 0) {
        contactForm.on('submit', function(e) {
            // Bootstrap valida automáticamente
        });
    }
    
    // Smooth scroll
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
    
    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Ripple effect en botones
    $('button, .btn').on('click', function(e) {
        const x = e.clientX - e.currentTarget.offsetLeft;
        const y = e.clientY - e.currentTarget.offsetTop;
        
        const ripple = $('<span></span>')
            .css({
                position: 'absolute',
                width: '20px',
                height: '20px',
                background: 'rgba(255, 255, 255, 0.5)',
                left: x,
                top: y,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'ripple 0.6s ease-out'
            });
        
        $(this).append(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
    
    // Agregar estilos para ripple animation
    if(!$('#ripple-styles').length) {
        $('head').append(`
            <style id="ripple-styles">
                @keyframes ripple {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            </style>
        `);
    }
});

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validación de teléfono
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
}

// Log para debugging (puedes remover esto en producción)
console.log('✅ JavaScript cargado correctamente');
