
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const status = document.getElementById('status');
    status.textContent='Đang gửi...';
    try{
      const data = new FormData(form);
      const res = await fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});
      if(res.ok){ status.textContent='Đã gửi! Cảm ơn bạn.'; form.reset(); }
      else { status.textContent='Gửi thất bại. Kiểm tra cấu hình Formspree.'; }
    }catch(err){
      status.textContent='Lỗi mạng hoặc cấu hình.';
    }
  });
});
