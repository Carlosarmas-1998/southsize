/* ═══════════════════════════════════════════════════════════════
   SST-CORE.JS — South Size Topping · Sistema Central
   Órdenes · Notificaciones · Cookies · Protección · Usuarios
   © 2026 South Size Topping — Todos los derechos reservados
   ═══════════════════════════════════════════════════════════════ */

(function(){
  'use strict';

  /* ──────────────────────────
     1. PROTECCIÓN DE CÓDIGO
  ────────────────────────── */
  // Deshabilitar clic derecho
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  // Deshabilitar F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
  document.addEventListener('keydown', function(e){
    if(e.key === 'F12') { e.preventDefault(); return false; }
    if(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) { e.preventDefault(); return false; }
    if(e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) { e.preventDefault(); return false; }
  });
  // Deshabilitar arrastrar imágenes
  document.addEventListener('dragstart', function(e){ if(e.target.tagName === 'IMG') e.preventDefault(); });
  // Deshabilitar selección de texto en imágenes
  document.addEventListener('selectstart', function(e){ if(e.target.tagName === 'IMG') e.preventDefault(); });

  /* ──────────────────────────
     2. SISTEMA DE COOKIES / POLÍTICAS
  ────────────────────────── */
  var SST_COOKIES_KEY = 'sst-cookies-accepted';

  function hasCookieConsent() {
    return localStorage.getItem(SST_COOKIES_KEY) === 'true';
  }

  function acceptCookies() {
    localStorage.setItem(SST_COOKIES_KEY, 'true');
    var banner = document.getElementById('sst-cookie-banner');
    if(banner) {
      banner.style.animation = 'sstSlideDown 0.4s ease forwards';
      setTimeout(function(){ banner.remove(); }, 500);
    }
  }

  function injectCookieBanner() {
    if(hasCookieConsent()) return;

    var banner = document.createElement('div');
    banner.id = 'sst-cookie-banner';
    banner.innerHTML = '<div class="sst-cb-inner">' +
      '<div class="sst-cb-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#b8975a" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="1" fill="#b8975a" stroke="none"/><circle cx="15" cy="9" r="1" fill="#b8975a" stroke="none"/></svg></div>' +
      '<div class="sst-cb-text">' +
        '<strong>Tu experiencia importa</strong>' +
        '<p>Usamos cookies propias y de terceros para mejorar tu experiencia, personalizar contenido y analizar el tráfico. Al aceptar, aceptas nuestra <a href="politicas.html" style="color:#b8975a;text-decoration:underline;">política de cookies y privacidad</a> completa.</p>' +
      '</div>' +
      '<button id="sst-accept-cookies" class="sst-cb-btn">Aceptar todo</button>' +
    '</div>';

    var style = document.createElement('style');
    style.textContent = '' +
      '@keyframes sstSlideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }' +
      '@keyframes sstSlideDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100%); opacity: 0; } }' +
      '#sst-cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999; background: #0d0d0d; border-top: 1px solid rgba(184,151,90,0.3); animation: sstSlideUp 0.5s ease forwards; font-family: "Montserrat", sans-serif; }' +
      '.sst-cb-inner { max-width: 900px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }' +
      '.sst-cb-icon { flex-shrink: 0; }' +
      '.sst-cb-text { flex: 1; min-width: 200px; }' +
      '.sst-cb-text strong { color: #faf9f7; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-bottom: 6px; }' +
      '.sst-cb-text p { color: rgba(250,249,247,0.6); font-size: 10px; line-height: 1.6; font-weight: 500; margin: 0; }' +
      '.sst-cb-btn { flex-shrink: 0; background: #b8975a; color: #0d0d0d; border: none; padding: 12px 32px; border-radius: 999px; font-family: "Montserrat", sans-serif; font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; }' +
      '.sst-cb-btn:hover { background: #faf9f7; transform: translateY(-1px); }' +
      '@media (max-width: 600px) { .sst-cb-inner { flex-direction: column; text-align: center; padding: 16px; gap: 12px; } .sst-cb-btn { width: 100%; } }';
    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById('sst-accept-cookies').addEventListener('click', acceptCookies);
  }

  /* ──────────────────────────
     3. SISTEMA DE USUARIO
  ────────────────────────── */
  var SST_USER_KEY = 'sst-user';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(SST_USER_KEY)) || null; } catch(e) { return null; }
  }

  function saveUser(data) {
    localStorage.setItem(SST_USER_KEY, JSON.stringify(data));
  }

  function ensureUserRegistered(callback) {
    var user = getUser();
    if(user && user.name && user.city) {
      if(callback) callback(user);
      return;
    }
    showUserModal(callback);
  }

  function showUserModal(callback) {
    if(document.getElementById('sst-user-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'sst-user-modal';
    modal.innerHTML = '<div class="sst-um-overlay"></div>' +
      '<div class="sst-um-box">' +
        '<div class="sst-um-header">' +
          '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#b8975a" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
          '<h3>Completa tu perfil</h3>' +
          '<p>Para gestionar tus pedidos y notificaciones</p>' +
        '</div>' +
        '<form id="sst-user-form">' +
          '<input type="text" id="sst-u-name" placeholder="Tu nombre completo" required />' +
          '<input type="email" id="sst-u-email" placeholder="Email" required />' +
          '<input type="tel" id="sst-u-phone" placeholder="Teléfono (opcional)" />' +
          '<select id="sst-u-city" required>' +
            '<option value="">— Selecciona tu ciudad —</option>' +
            '<option value="Madrid">Madrid</option>' +
            '<option value="Barcelona">Barcelona</option>' +
            '<option value="Valencia">Valencia</option>' +
            '<option value="Sevilla">Sevilla</option>' +
            '<option value="Bilbao">Bilbao</option>' +
            '<option value="Málaga">Málaga</option>' +
            '<option value="Zaragoza">Zaragoza</option>' +
            '<option value="Murcia">Murcia</option>' +
            '<option value="Palma">Palma de Mallorca</option>' +
            '<option value="Las Palmas">Las Palmas</option>' +
            '<option value="Otra">Otra ciudad</option>' +
          '</select>' +
          '<button type="submit" class="sst-um-btn">Guardar perfil</button>' +
        '</form>' +
      '</div>';

    var style = document.createElement('style');
    style.textContent = '' +
      '#sst-user-modal { position: fixed; inset: 0; z-index: 100000; display: flex; align-items: center; justify-content: center; animation: sstFadeIn 0.3s ease; }' +
      '@keyframes sstFadeIn { from { opacity: 0; } to { opacity: 1; } }' +
      '.sst-um-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); }' +
      '.sst-um-box { position: relative; background: #faf9f7; border-radius: 12px; padding: 36px 32px; max-width: 380px; width: 92%; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }' +
      '.sst-um-header { text-align: center; margin-bottom: 24px; }' +
      '.sst-um-header h3 { font-family: "Montserrat", sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #0d0d0d; margin: 12px 0 6px; }' +
      '.sst-um-header p { font-size: 10px; color: #7a7875; font-weight: 600; }' +
      '#sst-user-form { display: flex; flex-direction: column; gap: 12px; }' +
      '#sst-user-form input, #sst-user-form select { font-family: "Montserrat", sans-serif; font-size: 11px; font-weight: 600; padding: 12px 16px; border: 1.5px solid rgba(13,13,13,0.15); border-radius: 8px; background: #fff; color: #0d0d0d; outline: none; transition: border-color 0.2s; }' +
      '#sst-user-form input:focus, #sst-user-form select:focus { border-color: #b8975a; }' +
      '.sst-um-btn { font-family: "Montserrat", sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px; border: none; border-radius: 999px; background: #0d0d0d; color: #faf9f7; cursor: pointer; transition: all 0.25s; margin-top: 4px; }' +
      '.sst-um-btn:hover { background: #b8975a; transform: translateY(-1px); }';
    document.head.appendChild(style);
    document.body.appendChild(modal);

    document.getElementById('sst-user-form').addEventListener('submit', function(e){
      e.preventDefault();
      var userData = {
        name: document.getElementById('sst-u-name').value.trim(),
        email: document.getElementById('sst-u-email').value.trim(),
        phone: document.getElementById('sst-u-phone').value.trim(),
        city: document.getElementById('sst-u-city').value,
        registeredAt: new Date().toISOString()
      };
      saveUser(userData);
      modal.style.animation = 'sstFadeIn 0.3s ease reverse forwards';
      setTimeout(function(){ modal.remove(); }, 300);
      if(callback) callback(userData);
    });
  }

  /* ──────────────────────────
     4. SISTEMA DE PEDIDOS
  ────────────────────────── */
  var SST_ORDERS_KEY = 'sst-orders';
  var SST_ORDER_COUNTER_KEY = 'sst-order-counter';

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(SST_ORDERS_KEY)) || []; } catch(e) { return []; }
  }

  function saveOrders(orders) {
    localStorage.setItem(SST_ORDERS_KEY, JSON.stringify(orders));
  }

  function generateOrderId() {
    var counter = parseInt(localStorage.getItem(SST_ORDER_COUNTER_KEY) || '0') + 1;
    localStorage.setItem(SST_ORDER_COUNTER_KEY, counter.toString());
    var num = counter.toString().padStart(3, '0');
    return 'AM200326' + num;
  }

  function createOrder(cartItems, totalPrice) {
    var user = getUser();
    if(!user) return null;

    var order = {
      id: generateOrderId(),
      user: { name: user.name, email: user.email, phone: user.phone, city: user.city },
      items: cartItems.map(function(item){
        return { name: item.name, size: item.size || '', color: item.color || '', qty: item.qty, price: item.price, img: item.img || '' };
      }),
      total: totalPrice,
      status: 'Pendiente',
      statusHistory: [{ status: 'Pendiente', date: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };

    var orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);

    addNotification('Pedido ' + order.id + ' creado', 'Tu pedido ha sido registrado correctamente. Total: ' + totalPrice.toFixed(2) + '€', 'order');

    return order;
  }

  function updateOrderStatus(orderId, newStatus) {
    var orders = getOrders();
    for(var i = 0; i < orders.length; i++) {
      if(orders[i].id === orderId) {
        orders[i].status = newStatus;
        orders[i].statusHistory.push({ status: newStatus, date: new Date().toISOString() });
        saveOrders(orders);

        addNotification(
          'Pedido ' + orderId + ' actualizado',
          'Tu pedido ha cambiado a: ' + newStatus,
          'status'
        );

        // Intentar notificación del navegador
        if('Notification' in window && Notification.permission === 'granted') {
          new Notification('South Size Topping', {
            body: 'Tu pedido ' + orderId + ' ahora está: ' + newStatus,
            icon: 'logo.png'
          });
        }
        return orders[i];
      }
    }
    return null;
  }

  var ORDER_STATUSES = ['Pendiente', 'Confirmado', 'En Preparación', 'Enviado', 'Entregado'];

  function getStatusColor(status) {
    var colors = {
      'Pendiente': '#e67e22',
      'Confirmado': '#3498db',
      'En Preparación': '#9b59b6',
      'Enviado': '#2ecc71',
      'Entregado': '#27ae60'
    };
    return colors[status] || '#7a7875';
  }

  function getStatusIcon(status) {
    var icons = {
      'Pendiente': '⏳',
      'Confirmado': '✓',
      'En Preparación': '📦',
      'Enviado': '🚚',
      'Entregado': '✅'
    };
    return icons[status] || '•';
  }

  /* ──────────────────────────
     5. SISTEMA DE NOTIFICACIONES
  ────────────────────────── */
  var SST_NOTIF_KEY = 'sst-notifications';

  function getNotifications() {
    try { return JSON.parse(localStorage.getItem(SST_NOTIF_KEY)) || []; } catch(e) { return []; }
  }

  function saveNotifications(notifs) {
    localStorage.setItem(SST_NOTIF_KEY, JSON.stringify(notifs));
  }

  function addNotification(title, message, type) {
    var notifs = getNotifications();
    notifs.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
      title: title,
      message: message,
      type: type || 'info', // order, status, reminder, info
      read: false,
      date: new Date().toISOString()
    });
    // Máximo 50 notificaciones
    if(notifs.length > 50) notifs = notifs.slice(0, 50);
    saveNotifications(notifs);
    updateNotifBadge();
  }

  function markNotificationRead(id) {
    var notifs = getNotifications();
    for(var i = 0; i < notifs.length; i++) {
      if(notifs[i].id === id) { notifs[i].read = true; break; }
    }
    saveNotifications(notifs);
    updateNotifBadge();
  }

  function markAllRead() {
    var notifs = getNotifications();
    notifs.forEach(function(n){ n.read = true; });
    saveNotifications(notifs);
    updateNotifBadge();
  }

  function getUnreadCount() {
    return getNotifications().filter(function(n){ return !n.read; }).length;
  }

  function updateNotifBadge() {
    var badge = document.getElementById('notif-badge');
    if(!badge) return;
    var count = getUnreadCount();
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  /* ──────────────────────────
     6. RECORDATORIOS 24H (Favoritos + Carrito)
  ────────────────────────── */
  var SST_REMINDER_KEY = 'sst-last-reminder';

  function checkReminders() {
    var lastReminder = localStorage.getItem(SST_REMINDER_KEY);
    var now = Date.now();
    var ONE_DAY = 24 * 60 * 60 * 1000;

    if(lastReminder && (now - parseInt(lastReminder)) < ONE_DAY) return;

    var cart = [];
    var favs = [];
    try { cart = JSON.parse(localStorage.getItem('sst-cart')) || JSON.parse(localStorage.getItem('sst_cart')) || []; } catch(e){}
    try { favs = JSON.parse(localStorage.getItem('sst-fav')) || []; } catch(e){}

    if(cart.length > 0) {
      addNotification(
        'Tienes artículos en tu bolsa',
        'No olvides completar tu compra. Tienes ' + cart.length + ' artículo(s) esperándote en tu bolsa.',
        'reminder'
      );
      if('Notification' in window && Notification.permission === 'granted') {
        new Notification('South Size Topping', {
          body: 'Tienes ' + cart.length + ' artículo(s) en tu bolsa. ¡Completa tu compra!',
          icon: 'logo.png'
        });
      }
    }

    if(favs.length > 0) {
      addNotification(
        'Tus favoritos te esperan',
        'Tienes ' + favs.length + ' artículo(s) en favoritos. Las ediciones son limitadas, ¡no te quedes sin ellos!',
        'reminder'
      );
      if('Notification' in window && Notification.permission === 'granted') {
        new Notification('South Size Topping', {
          body: 'Tienes ' + favs.length + ' favorito(s). ¡Las ediciones son limitadas!',
          icon: 'logo.png'
        });
      }
    }

    if(cart.length > 0 || favs.length > 0) {
      localStorage.setItem(SST_REMINDER_KEY, now.toString());
    }
  }

  /* ──────────────────────────
     7. INYECTAR BOTÓN NOTIFICACIONES EN NAV
  ────────────────────────── */
  function injectNotifButton() {
    var nav = document.querySelector('nav');
    if(!nav || document.getElementById('notif-nav-btn')) return;

    // Buscar el separador para insertar después
    var sep = nav.querySelector('.nav-sep');
    if(!sep) return;

    var btn = document.createElement('a');
    btn.href = 'notificaciones.html';
    btn.className = 'nav-icon-btn';
    btn.id = 'notif-nav-btn';
    btn.title = 'Notificaciones';
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>' +
      '<span class="notif-count" id="notif-badge">0</span>';

    // Añadir estilos para el badge de notificaciones
    if(!document.getElementById('sst-notif-styles')) {
      var style = document.createElement('style');
      style.id = 'sst-notif-styles';
      style.textContent = '.notif-count { position: absolute; top: -4px; right: -4px; background: #e03535; color: #fff; font-size: 7px; font-weight: 800; width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--cream, #faf9f7); transition: transform 0.3s; opacity: 0; transform: scale(0); } .notif-count.visible { opacity: 1; transform: scale(1); }';
      document.head.appendChild(style);
    }

    sep.insertAdjacentElement('afterend', btn);
    updateNotifBadge();
  }

  /* ──────────────────────────
     8. GENERADOR DE JUSTIFICANTE PDF (HTML)
  ────────────────────────── */
  function generateReceipt(order) {
    var itemsHtml = order.items.map(function(item){
      return '<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:11px;">' + item.name + (item.size ? ' ('+item.size+')' : '') + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:11px;text-align:center;">' + item.qty + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:11px;text-align:right;">' + (item.price * item.qty).toFixed(2) + ' €</td></tr>';
    }).join('');

    var statusHtml = order.statusHistory.map(function(sh){
      var d = new Date(sh.date);
      return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
        '<span style="width:8px;height:8px;border-radius:50%;background:' + getStatusColor(sh.status) + ';flex-shrink:0;"></span>' +
        '<span style="font-size:10px;font-weight:600;">' + sh.status + '</span>' +
        '<span style="font-size:9px;color:#999;margin-left:auto;">' + d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) + '</span>' +
      '</div>';
    }).join('');

    var date = new Date(order.createdAt);

    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Justificante ' + order.id + '</title>' +
      '<style>@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap"); body{font-family:"Montserrat",sans-serif;background:#fff;color:#0d0d0d;margin:0;padding:40px;} @media print{body{padding:20px;}} .receipt{max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;} .receipt-header{background:#0d0d0d;color:#faf9f7;padding:30px;text-align:center;} .receipt-body{padding:24px;} table{width:100%;border-collapse:collapse;} .btn-print{display:block;margin:20px auto;padding:12px 40px;background:#0d0d0d;color:#faf9f7;border:none;border-radius:999px;font-family:"Montserrat",sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;} .btn-print:hover{background:#b8975a;} @media print{.btn-print{display:none !important;}}</style></head><body>' +
      '<div class="receipt">' +
        '<div class="receipt-header">' +
          '<div style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#b8975a;margin-bottom:8px;">South Size Topping</div>' +
          '<div style="font-size:22px;font-weight:800;letter-spacing:0.05em;">' + order.id + '</div>' +
          '<div style="font-size:9px;color:rgba(250,249,247,0.5);margin-top:6px;">' + date.toLocaleDateString('es-ES',{day:'2-digit',month:'long',year:'numeric'}) + ' · ' + date.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) + '</div>' +
        '</div>' +
        '<div class="receipt-body">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">' +
            '<div><div style="font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin-bottom:4px;">Cliente</div><div style="font-size:12px;font-weight:700;">' + order.user.name + '</div><div style="font-size:10px;color:#666;">' + order.user.email + '</div><div style="font-size:10px;color:#666;">' + order.user.city + '</div></div>' +
            '<div style="text-align:right;"><div style="font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin-bottom:4px;">Estado</div><div style="display:inline-block;padding:6px 16px;border-radius:999px;background:' + getStatusColor(order.status) + ';color:#fff;font-size:10px;font-weight:700;letter-spacing:0.1em;">' + order.status + '</div></div>' +
          '</div>' +
          '<table><thead><tr><th style="padding:8px 12px;border-bottom:2px solid #0d0d0d;font-size:8px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;text-align:left;">Artículo</th><th style="padding:8px 12px;border-bottom:2px solid #0d0d0d;font-size:8px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;text-align:center;">Ud.</th><th style="padding:8px 12px;border-bottom:2px solid #0d0d0d;font-size:8px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;text-align:right;">Importe</th></tr></thead><tbody>' + itemsHtml + '</tbody>' +
          '<tfoot><tr><td colspan="2" style="padding:12px;font-size:12px;font-weight:800;text-align:right;border-top:2px solid #0d0d0d;">TOTAL</td><td style="padding:12px;font-size:14px;font-weight:800;text-align:right;border-top:2px solid #0d0d0d;color:#b8975a;">' + order.total.toFixed(2) + ' €</td></tr></tfoot></table>' +
          '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee;"><div style="font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin-bottom:8px;">Historial de estado</div>' + statusHtml + '</div>' +
          '<div style="margin-top:20px;padding:16px;background:#f8f8f6;border-radius:6px;text-align:center;"><div style="font-size:9px;color:#999;line-height:1.6;">Este justificante es un comprobante de tu pedido en South Size Topping.<br>Para cualquier consulta: angelmoretaalcorta01@gmail.com · +34 653 181 905</div></div>' +
        '</div>' +
      '</div>' +
      '<button class="btn-print" onclick="window.print()">Imprimir justificante</button>' +
      '</body></html>';
  }

  function openReceipt(orderId) {
    var orders = getOrders();
    var order = orders.find(function(o){ return o.id === orderId; });
    if(!order) return;
    var w = window.open('', '_blank');
    w.document.write(generateReceipt(order));
    w.document.close();
  }

  /* ──────────────────────────
     9. EXPORTAR A EXCEL (CSV con BOM para Excel)
  ────────────────────────── */
  function exportToExcel(data, filename, headers) {
    var BOM = '\uFEFF';
    var csv = headers.join(';') + '\n';
    data.forEach(function(row){
      csv += row.map(function(cell){
        var str = String(cell).replace(/"/g, '""');
        return '"' + str + '"';
      }).join(';') + '\n';
    });
    var blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /* ──────────────────────────
     10. SOLICITAR PERMISOS DE NOTIFICACIÓN
  ────────────────────────── */
  function requestNotifPermission() {
    if('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /* ──────────────────────────
     11. INICIALIZACIÓN
  ────────────────────────── */
  document.addEventListener('DOMContentLoaded', function(){
    injectCookieBanner();
    injectNotifButton();
    updateNotifBadge();
    requestNotifPermission();

    // Comprobar recordatorios cada vez que se carga la página
    setTimeout(checkReminders, 3000);

    // Escuchar cambios de storage (otras pestañas)
    window.addEventListener('storage', function(e){
      if(e.key === SST_NOTIF_KEY) updateNotifBadge();
    });
  });

  /* ──────────────────────────
     12. API PÚBLICA
  ────────────────────────── */
  window.SST = {
    // Usuario
    getUser: getUser,
    saveUser: saveUser,
    ensureUserRegistered: ensureUserRegistered,
    // Pedidos
    getOrders: getOrders,
    createOrder: createOrder,
    updateOrderStatus: updateOrderStatus,
    generateOrderId: generateOrderId,
    ORDER_STATUSES: ORDER_STATUSES,
    getStatusColor: getStatusColor,
    getStatusIcon: getStatusIcon,
    openReceipt: openReceipt,
    generateReceipt: generateReceipt,
    // Notificaciones
    getNotifications: getNotifications,
    addNotification: addNotification,
    markNotificationRead: markNotificationRead,
    markAllRead: markAllRead,
    getUnreadCount: getUnreadCount,
    updateNotifBadge: updateNotifBadge,
    // Cookies
    hasCookieConsent: hasCookieConsent,
    acceptCookies: acceptCookies,
    // Export
    exportToExcel: exportToExcel,
    // Recordatorios
    checkReminders: checkReminders
  };

})();
