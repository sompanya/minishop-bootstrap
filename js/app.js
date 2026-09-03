// Simple cart logic for MiniShop
(function(){
  const cartKey = 'minishop_cart_v1';
  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');

  function loadCart(){
    try{
      const raw = localStorage.getItem(cartKey);
      return raw ? JSON.parse(raw) : {};
    }catch(e){
      return {};
    }
  }

  function saveCart(cart){
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCartCount(cart);
  }

  function renderCartCount(cart){
    const count = Object.values(cart).reduce((s,i)=>s + i.qty, 0);
    if(cartCountEl) cartCountEl.textContent = count;
  }

  function renderCartModal(cart){
    if(!cartItemsEl || !cartTotalEl) return;
    cartItemsEl.innerHTML = '';
    let total = 0;
    for(const id in cart){
      const item = cart[id];
      const row = document.createElement('div');
      row.className = 'd-flex align-items-center justify-content-between border-bottom py-2';
      row.innerHTML = `<div><strong>${item.name}</strong><div class="text-muted">ราคา ${item.price} บาท x ${item.qty}</div></div><div><strong>${item.price * item.qty}</strong></div>`;
      cartItemsEl.appendChild(row);
      total += item.price * item.qty;
    }
    cartTotalEl.textContent = total;
  }

  function addToCart(id, name, price){
    const cart = loadCart();
    if(cart[id]) cart[id].qty += 1;
    else cart[id] = { id, name, price: Number(price), qty: 1 };
    saveCart(cart);
  }

  // Attach event listeners to buttons
  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('.add-to-cart');
    if(btn){
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addToCart(id, name, price);
    }
  });

  // When cart modal shown, render items
  const cartModalEl = document.getElementById('cartModal');
  if(cartModalEl){
    cartModalEl.addEventListener('show.bs.modal', function(){
      const cart = loadCart();
      renderCartModal(cart);
    });
  }

  if(clearBtn){
    clearBtn.addEventListener('click', function(){
      localStorage.removeItem(cartKey);
      renderCartModal({});
      renderCartCount({});
      // update badge
      if(cartCountEl) cartCountEl.textContent = '0';
    });
  }

  if(checkoutBtn){
    checkoutBtn.addEventListener('click', function(){
      // Simple demo checkout
      alert('ขอบคุณสำหรับการสั่งซื้อ! (จำลอง)');
      localStorage.removeItem(cartKey);
      renderCartModal({});
      renderCartCount({});
      if(cartCountEl) cartCountEl.textContent = '0';
      // close modal
      const modal = bootstrap.Modal.getInstance(cartModalEl);
      if(modal) modal.hide();
    });
  }

  // initial render
  document.addEventListener('DOMContentLoaded', function(){
    const cart = loadCart();
    renderCartCount(cart);
  });
})();
