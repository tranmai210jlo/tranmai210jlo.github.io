
const PASS='mxd6686';const $=s=>document.querySelector(s);const j=o=>JSON.stringify(o,null,2);
function show(id,on=true){const e=document.getElementById(id);if(e)e.style.display=on?'':'none'}
function getLocal(){try{return JSON.parse(localStorage.getItem('mxd_links')||'{}')}catch{return{}}}
function setLocal(m){localStorage.setItem('mxd_links',j(m))}
function setStatus(el,msg,ok=true){el.textContent=(ok?'✅ ':'⚠️ ')+msg}
async function loadRepoMap(o,r,b,p){const u=`https://raw.githubusercontent.com/${o}/${r}/${b}/${p}`;const x=await fetch(u,{cache:'no-store'});if(!x.ok)throw new Error(`Không tải được ${u}`);return x.json()}
async function saveRepoMap({owner,repo,branch,path,token,map}){const api=`https://api.github.com/repos/${owner}/${repo}/contents/${path}`;let sha;const h=await fetch(`${api}?ref=${encodeURIComponent(branch)}`,{headers:token?{Authorization:`token ${token}`}:{}});if(h.status===200){sha=(await h.json()).sha}
const payload={message:`update ${path} @ ${new Date().toISOString()}`,content:btoa(unescape(encodeURIComponent(j(map)))),branch,sha};
const res=await fetch(api,{method:'PUT',headers:{'Content-Type':'application/json',...(token?{Authorization:`token ${token}`}:{})},body:JSON.stringify(payload)});if(!res.ok)throw new Error(`Ghi thất bại: ${res.status}`);return res.json()}
function boot(){
  if(localStorage.getItem('mxd_admin_gate')==='1'){show('panel',true)}else{show('gate',true)}
  $('#unlock')?.addEventListener('click',()=>{$('#pass').value.trim()===PASS?(localStorage.setItem('mxd_admin_gate','1'),show('gate',false),show('panel',true)):alert('Sai passphrase')})
  $('#json_area').value=j(getLocal());$('#current_map').textContent=j(getLocal());
  $('#btn_validate')?.addEventListener('click',()=>{try{JSON.parse($('#json_area').value);setStatus($('#edit_status'),'JSON hợp lệ',true)}catch{setStatus($('#edit_status'),'JSON lỗi',false)}})
  $('#btn_save_local')?.addEventListener('click',()=>{try{const o=JSON.parse($('#json_area').value);setLocal(o);$('#current_map').textContent=j(o);setStatus($('#edit_status'),'Đã lưu local',true)}catch{setStatus($('#edit_status'),'Không lưu được',false)}})
  $('#btn_export')?.addEventListener('click',()=>{const b=new Blob([$('#json_area').value],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='links.json';a.click()})
  $('#btn_load_repo')?.addEventListener('click',async()=>{const o=$('#gh_owner').value.trim(),r=$('#gh_repo').value.trim(),b=$('#gh_branch').value.trim(),p=$('#gh_path').value.trim();try{const repoMap=await loadRepoMap(o,r,b,p);const merged={...repoMap,...getLocal()};$('#json_area').value=j(merged);$('#current_map').textContent=j(merged);setStatus($('#repo_status'),`Đã tải ${p}`,true)}catch(e){setStatus($('#repo_status'),e.message,false)}})
  $('#btn_save_repo')?.addEventListener('click',async()=>{const o=$('#gh_owner').value.trim(),r=$('#gh_repo').value.trim(),b=$('#gh_branch').value.trim(),p=$('#gh_path').value.trim(),t=$('#gh_token').value.trim();if(!t)return setStatus($('#repo_status'),'Thiếu PAT',false);try{const map=JSON.parse($('#json_area').value);await saveRepoMap({owner:o,repo:r,branch:b,path:p,token:t,map});setStatus($('#repo_status'),`Đã ghi ${p}`,true)}catch(e){setStatus($('#repo_status'),e.message,false)}})
  $('#btn_set_subid')?.addEventListener('click',()=>{const v=$('#subid').value.trim();if(v){localStorage.setItem('mxd_subid',v);alert('Đã set SUBID')}})
  $('#btn_clear_subid')?.addEventListener('click',()=>{localStorage.removeItem('mxd_subid');alert('Đã xoá SUBID')})
}
document.addEventListener('DOMContentLoaded',boot);
