(() => {
 const article=document.querySelector('#article-body'); if(!article)return;
 const progress=document.querySelector('.bma-reading-progress span');
 const links=[...document.querySelectorAll('.bma-contents nav a')];
 const headings=links.map(link=>({link,target:document.getElementById(decodeURIComponent(link.hash.slice(1)))})).filter(item=>item.target);
 let pending=false;
 const update=()=>{pending=false;const rect=article.getBoundingClientRect();const range=Math.max(1,article.offsetHeight-innerHeight);progress.style.width=`${Math.max(0,Math.min(100,-rect.top/range*100))}%`;let active=headings[0];headings.forEach(item=>{if(item.target.getBoundingClientRect().top<160)active=item});headings.forEach(item=>{if(item===active)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current')})};
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
 const contents=document.querySelector('.bma-contents details');if(matchMedia('(max-width:820px)').matches)contents.open=false;
 const dialog=document.querySelector('.bma-image-dialog');let opener;
 article.querySelectorAll('figure img').forEach(img=>{const button=document.createElement('button');button.type='button';button.className='bma-image-button';button.setAttribute('aria-label',`Enlarge: ${img.alt}`);img.before(button);button.append(img);button.addEventListener('click',()=>{opener=button;dialog.querySelector('img').src=img.currentSrc||img.src;dialog.querySelector('img').alt=img.alt;dialog.querySelector('p').textContent=img.closest('figure').querySelector('figcaption')?.textContent||'';dialog.showModal()})});
 dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
})();
