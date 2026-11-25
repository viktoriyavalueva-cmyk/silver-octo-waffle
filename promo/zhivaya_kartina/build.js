const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const dir=__dirname;const fcss=fs.readFileSync(path.join(dir,'fonts','fonts.css'),'utf8').replace(/url\((f\d+\.woff2)\)/g,(_,f)=>`url(file://${path.join(dir,'fonts',f)})`);
const P=n=>'file://'+path.join(dir,'photo','mk',n+'.jpg');const N='#1F2836',G='#D9A35F',CR='#F6F1E9';
const css=`${fcss}*{margin:0;padding:0;box-sizing:border-box}img{display:block}
.f{position:relative;overflow:hidden;background:${N};color:#F3EEE6;font-family:'Manrope',sans-serif}
.eb{color:${G};letter-spacing:5px;text-transform:uppercase;font-weight:600}
.h{font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1;color:#F5EFE6}
.q{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;color:${G};line-height:1.2}
.pill{display:inline-block;font-size:24px;font-weight:500;color:${N};background:#E8DFD2;border-radius:40px;padding:10px 22px;white-space:nowrap}
.pg{background:${G};font-weight:600}
.num{font-feature-settings:'lnum' 1}
.sig{font-family:'Cormorant Garamond',serif;font-style:italic;color:${G}}`;
const V={
'mk_anons.png':[1080,1350,`<div class="f" style="width:1080px;height:1350px"><img src="${P('tree')}" style="position:absolute;left:0;top:0;width:1080px;height:900px;object-fit:cover;object-position:50% 56%">
<div style="position:absolute;left:0;top:900px;width:1080px;height:450px;padding:40px 80px">
<div class="eb" style="font-size:22px">Мастер-класс · Москва</div>
<div class="h" style="font-size:100px;margin-top:12px">Живая картина</div>
<div class="q" style="font-size:36px;margin-top:10px">Ваша эмоция в образе и дерево жизни на холсте</div>
<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:22px"><span class="pill num">4–5 часов</span><span class="pill">Какао и чай</span><span class="pill">Уметь рисовать не нужно</span><span class="pill pg num">5 000 ₽</span></div>
<div style="position:absolute;left:80px;right:80px;bottom:34px;display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:24px;color:#C9C2B6">Запись: «пойду» в комментариях</div><div class="sig" style="font-size:34px">@Victory_Valueva</div></div></div></div>`],
'mk_quote.png':[1080,1350,`<div class="f" style="width:1080px;height:1350px"><img src="${P('hand')}" style="position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover;object-position:50% 40%">
<div style="position:absolute;left:0;right:0;bottom:0;height:760px;background:linear-gradient(to bottom,rgba(31,40,54,0),rgba(31,40,54,.88) 38%,${N} 62%)"></div>
<div style="position:absolute;left:80px;right:80px;bottom:90px">
<div class="eb" style="font-size:23px">Мастер-класс «Живая картина»</div>
<div class="h" style="font-size:84px;margin-top:22px;line-height:1.06">Позвольте руке<br>выбирать цвет</div>
<div style="font-size:30px;line-height:1.5;color:#C9C2B6;margin-top:26px">Четыре-пять часов, когда можно выдохнуть и рисовать. Картина рождается из вашего состояния.</div></div></div>`],
'mk_chat.png':[1080,1350,`<div class="f" style="width:1080px;height:1350px"><img src="${P('easels')}" style="position:absolute;left:0;top:0;width:1080px;height:820px;object-fit:cover;object-position:50% 45%">
<div style="position:absolute;left:0;top:820px;width:1080px;height:530px;padding:56px 80px">
<div class="eb" style="font-size:23px">Мастер-класс · Москва · <span class="num">5 000 ₽</span></div>
<div class="h" style="font-size:104px;margin-top:20px">Живая картина</div>
<div class="q" style="font-size:36px;margin-top:16px">Живая встреча: рядом, за одним столом, с красками и какао</div>
<div style="position:absolute;left:80px;right:80px;bottom:52px;display:flex;justify-content:space-between;align-items:center">
<div style="display:inline-flex;align-items:center;gap:20px;background:${G};color:${N};border-radius:60px;padding:16px 36px 16px 18px;font-size:30px;font-weight:600"><span style="display:inline-flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:50%;background:${N};color:${G};font-size:30px">✎</span>Пишите «пойду»</div>
<div class="sig" style="font-size:36px">Виктория</div></div></div></div>`],
'mk_collage.png':[1080,1350,`<div class="f" style="width:1080px;height:1350px;padding:20px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:12px;height:910px">
<img src="${P('tree')}" style="width:600px;height:910px;object-fit:cover;object-position:50% 50%;border-radius:10px">
<div style="display:flex;flex-direction:column;gap:12px"><img src="${P('brush')}" style="width:428px;height:449px;object-fit:cover;object-position:50% 45%;border-radius:10px"><img src="${P('easels')}" style="width:428px;height:449px;object-fit:cover;object-position:60% 50%;border-radius:10px"></div></div>
<div style="flex:1;padding:22px 40px 24px;position:relative">
<div class="eb" style="font-size:22px">Мастер-класс · Москва</div>
<div class="h" style="font-size:84px;margin-top:12px">Живая картина</div>
<div style="font-size:28px;line-height:1.5;color:#C9C2B6;margin-top:12px">Корни: на что вы опираетесь. Ствол: вы сами. Крона: куда вы растёте.</div>
<div style="position:absolute;left:40px;right:40px;bottom:22px;display:flex;justify-content:space-between;align-items:baseline"><div class="num" style="font-size:26px;color:#E8DFD2">4–5 часов · 5 000 ₽</div><div class="sig" style="font-size:34px">@Victory_Valueva</div></div></div></div>`],
'mk_story.png':[1080,1920,`<div class="f" style="width:1080px;height:1920px"><img src="${P('tree')}" style="position:absolute;left:0;top:0;width:1080px;height:1440px;object-fit:cover;object-position:50% 50%">
<div style="position:absolute;left:0;right:0;top:1180px;height:270px;background:linear-gradient(to bottom,rgba(31,40,54,0),${N})"></div>
<div style="position:absolute;left:80px;right:80px;bottom:250px">
<div class="eb" style="font-size:28px">Мастер-класс · Москва</div>
<div class="h" style="font-size:120px;margin-top:22px">Живая картина</div>
<div class="num" style="font-size:36px;color:#E8DFD2;margin-top:28px">4–5 часов · какао и чай · 5 000 ₽</div>
<div class="q" style="font-size:44px;margin-top:22px">Пишите «пойду»</div></div></div>`]};
(async()=>{const b=await chromium.launch();const out=path.join(dir,'out_mk');fs.mkdirSync(out,{recursive:true});
for(const [n,[w,h,html]] of Object.entries(V)){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});const hp=path.join(dir,'mk.html');
fs.writeFileSync(hp,`<html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`);await p.goto('file://'+hp);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:path.join(out,n)});await p.close();}
const p=await b.newPage({viewport:{width:1700,height:700}});fs.writeFileSync(path.join(dir,'smk.html'),`<body style="margin:0;display:flex;gap:6px;align-items:flex-start;background:#888">${Object.keys(V).map(x=>`<img src="file://${out}/${x}" style="height:${x.includes('story')?680:600}px">`).join('')}</body>`);
await p.goto('file://'+path.join(dir,'smk.html'));await p.waitForTimeout(600);await p.screenshot({path:path.join(dir,'sheet_mk.png')});await b.close();})();
