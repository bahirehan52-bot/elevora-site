(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* mobile menu */
var mb=document.getElementById('menuBtn'),nl=document.getElementById('navLinks');
if(mb){mb.addEventListener('click',function(){var o=nl.classList.toggle('open');mb.setAttribute('aria-expanded',String(o));mb.textContent=o?'×':'☰'});
nl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nl.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.textContent='☰'})})}
var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

/* scroll progress */
var pg=document.getElementById('progress');
function onScroll(){var h=document.documentElement;var p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);if(pg)pg.style.width=(p*100)+'%'}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.reveal').forEach(function(el,i){el.style.transitionDelay=((i%4)*70)+'ms';io.observe(el)});

/* cursor glow */
var glow=document.getElementById('glow');
if(glow&&fine&&!reduce){addEventListener('mousemove',function(e){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true})}else if(glow){glow.remove()}

/* 3D tilt cards with glare */
if(fine&&!reduce){document.querySelectorAll('.tilt').forEach(function(c){
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
c.style.transitionDelay='0ms';c.style.transform='perspective(900px) rotateX('+((.5-py)*12)+'deg) rotateY('+((px-.5)*14)+'deg) translateZ(8px)';
c.style.setProperty('--gx',(px*100)+'%');c.style.setProperty('--gy',(py*100)+'%')});
c.addEventListener('mouseleave',function(){c.style.transform=''})})}
document.querySelectorAll('.tilt').forEach(function(c){if(!c.querySelector('.glare')){var g=document.createElement('i');g.className='glare';c.appendChild(g)}});

/* hero parallax stage */
var scene=document.querySelector('.scene'),stage=document.querySelector('.stage');
if(scene&&stage&&fine&&!reduce){
scene.addEventListener('mousemove',function(e){var r=scene.getBoundingClientRect();var px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;stage.style.transform='rotateY('+(px*22)+'deg) rotateX('+(-py*18)+'deg)'});
scene.addEventListener('mouseleave',function(){stage.style.transform='rotateY(-8deg) rotateX(4deg)'})}
if(stage)stage.style.transform='rotateY(-8deg) rotateX(4deg)';

/* flip cards: tap on touch devices, keyboard accessible */
document.querySelectorAll('.flip').forEach(function(f){
f.addEventListener('click',function(){f.classList.toggle('on')});
f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.classList.toggle('on')}})});

/* 3D particle globe */
function globe(canvas){
var ctx=canvas.getContext('2d'),N=170,pts=[],rotY=0,rotX=.35,tY=0,tX=0,w,h,dpr=Math.min(devicePixelRatio||1,2),run=true;
for(var i=0;i<N;i++){var k=i+.5,phi=Math.acos(1-2*k/N),th=Math.PI*(1+Math.sqrt(5))*k;pts.push([Math.cos(th)*Math.sin(phi),Math.cos(phi),Math.sin(th)*Math.sin(phi)])}
function size(){var r=canvas.getBoundingClientRect();w=r.width;h=r.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener('resize',size);
canvas.parentElement.addEventListener('mousemove',function(e){var r=canvas.getBoundingClientRect();tY=((e.clientX-r.left)/r.width-.5)*1.2;tX=((e.clientY-r.top)/r.height-.5)*.8});
new IntersectionObserver(function(es){run=es[0].isIntersecting;if(run)frame()}).observe(canvas);
function frame(){if(!run)return;
rotY+=reduce?0:.004;var ry=rotY+tY*.6,rx=rotX+tX*.5;var cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx);
var R=Math.min(w,h)*.36,cxp=w/2,cyp=h/2;ctx.clearRect(0,0,w,h);
var pr=pts.map(function(p){var x=p[0]*cy+p[2]*sy,z=-p[0]*sy+p[2]*cy,yy=p[1]*cx-z*sx,zz=p[1]*sx+z*cx;var s=1/(1.8-zz*.5);return{x:cxp+x*R*s*1.5,y:cyp+yy*R*s*1.5,z:zz}});
ctx.lineWidth=.6;
for(var i=0;i<N;i++){for(var j=i+1;j<N;j++){var a=pr[i],b=pr[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<1400){var al=(1-d/1400)*.28*((a.z+b.z)/2+1.2)/2.2;ctx.strokeStyle='rgba(104,231,223,'+al.toFixed(3)+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
for(var k2=0;k2<N;k2++){var q=pr[k2],a2=.25+(q.z+1)*.38;ctx.fillStyle='rgba('+(q.z>0?'145,165,255':'104,231,223')+','+a2.toFixed(2)+')';ctx.beginPath();ctx.arc(q.x,q.y,1.2+(q.z+1)*.9,0,6.283);ctx.fill()}
requestAnimationFrame(frame)}
frame()}
document.querySelectorAll('canvas[data-globe]').forEach(globe);

/* contact form -> WhatsApp */
var f=document.getElementById('contactForm');
if(f){f.addEventListener('submit',function(e){e.preventDefault();if(f.querySelector('.hp').value)return;
var v=function(id){return document.getElementById(id).value.trim()};
var t='Hi Elevora!\n\nMy name: '+v('name')+'\nBusiness: '+(v('business')||'Not specified')+'\nService: '+v('service')+'\nBudget: '+(v('budget')||'Not specified')+'\nProject details: '+v('message');
var url='https://wa.me/923397300404?text='+encodeURIComponent(t),w=window.open(url,'_blank','noopener'),s=document.getElementById('formStatus');
s.innerHTML=w?'Opening WhatsApp — review and press send.':'Popup blocked. <a href="'+url+'" target="_blank" rel="noopener">Tap here to open WhatsApp</a> or email us.'})}
})();
