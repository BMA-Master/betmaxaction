(() => {
 const button=document.querySelector('.co-menu-toggle');
 const nav=document.querySelector('.co-navigation');
 if(!button || !nav)return;
 const setOpen=open=>{button.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)};
 button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){setOpen(false);button.focus()}});
 document.addEventListener('click',event=>{if(!event.target.closest('.co-header'))setOpen(false)});
 nav.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
 matchMedia('(min-width: 821px)').addEventListener('change',()=>setOpen(false));
})();

// Industry details stay collapsed until requested; only one panel is open.
(() => {
 const options=[...document.querySelectorAll('.co-industry-option')];
 options.forEach(button=>button.addEventListener('click',()=>{
   const open=button.getAttribute('aria-expanded')!=='true';
   options.forEach(option=>{
     const selected=option===button&&open;
     option.setAttribute('aria-expanded',String(selected));
     option.querySelector('.co-option-plus').textContent=selected?'−':'+';
     document.getElementById(option.getAttribute('aria-controls')).hidden=!selected;
   });
 }));
})();

// Original homepage words, with a quiet crossfade instead of a typing cursor.
(() => {
 const word=document.getElementById('co-hero-word');
 if(!word)return;
 const words=['Scales.','Competes.','Engages.','Converts.','Retains.','Differentiates.','Goes Viral.'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer;
 const stop=()=>{clearTimeout(timer);word.classList.remove('is-changing')};
 const cycle=()=>{
   if(reduced.matches||document.hidden)return;
   timer=setTimeout(()=>{
     word.classList.add('is-changing');
     timer=setTimeout(()=>{
       index=(index+1)%words.length;
       word.textContent=words[index];
       word.classList.remove('is-changing');
       cycle();
     },220);
   },2600);
 };
 const restart=()=>{stop();if(reduced.matches){index=0;word.textContent=words[0]}else cycle()};
 reduced.addEventListener('change',restart);
 document.addEventListener('visibilitychange',restart);
 cycle();
})();
