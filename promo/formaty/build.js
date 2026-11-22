const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const dir=__dirname;const fcss=fs.readFileSync(path.join(dir,'fonts','fonts.css'),'utf8').replace(/url\((f\d+\.woff2)\)/g,(_,f)=>`url(file://${path.join(dir,'fonts',f)})`);
const photo='file://'+path.join(dir,'photo','art2.jpg');
const N='#1F2836',G='#D9A35F',GL='#9A6A2F',CR='#F6F1E9';const T=13;
const css=`${fcss}*{margin:0;padding:0;box-sizing:border-box}
.f{position:relative;overflow:hidden;width:1080px;height:1350px;font-family:'Manrope',sans-serif}
.d{background:${N};color:#F3EEE6}.l{background:${CR};color:${N}}.a{background:${G};color:${N}}
.eb{letter-spacing:5px;text-transform:uppercase;font-weight:600;font-size:24px;position:absolute;top:110px;left:90px}
.d .eb{color:${G}}.l .eb{color:${GL}}.a .eb{color:${N}}
.h{font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.05}
.d .h{color:#F5EFE6}
.q{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;line-height:1.18}
.d .q{color:${G}}.l .q{color:${GL}}.a .q{color:${N}}
.t{font-size:36px;line-height:1.5}.d .t{color:#C9C2B6}.l .t{color:#4A5160}.a .t{color:${N}}
.num{font-family:'Cormorant Garamond',serif;font-feature-settings:'lnum' 1;font-variant-numeric:lining-nums;font-weight:600;line-height:1}
.rub{font-family:'Manrope',sans-serif;font-weight:500}
.pg{position:absolute;right:80px;bottom:70px;font-size:24px;letter-spacing:3px}
.d .pg{color:#8E95A3}.l .pg{color:#9C9184}.a .pg{color:#5A4A33}
.body{position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.pills{display:flex;flex-wrap:wrap;gap:14px;margin-top:34px}
.pill{font-size:28px;font-weight:500;border-radius:40px;padding:12px 28px}
.l .pill{background:#E8DFD2;color:${N}}.d .pill{background:#2E3A4E;color:#E8DFD2}.a .pill{background:${N};color:${G}}
.rule{height:1px;margin:46px 0 40px}.l .rule{background:#DDD2C4}.d .rule{background:#3A4458}.a .rule{background:#B8864A}
.row{display:flex;gap:34px;align-items:baseline;padding:30px 0;border-bottom:1px solid #3A4458}
.sig{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:40px}`;
const arc=`<svg style="position:absolute;top:-170px;right:-200px" width="500" height="500" viewBox="0 0 500 500"><circle cx="250" cy="250" r="205" fill="none" stroke="#B88A55" stroke-width="3"/></svg>`;
const pg=i=>`<div class="pg">${i} / ${T}</div>`;
const price=(p,c)=>`<div class="num" style="font-size:128px;color:${c}">${p}<span class="rub" style="font-size:72px;margin-left:16px">₽</span></div>`;
const fmt=(i,k,eb,name,pills,pr,text,note)=>`<div class="f ${k}">${k==='d'?arc:''}<div class="eb">${eb}</div><div class="body">
<div class="h" style="font-size:${name.length>26?76:92}px">${name}</div>
<div class="pills">${pills.map(x=>`<span class="pill">${x}</span>`).join('')}</div>
<div class="rule"></div>
${pr?price(pr,k==='d'?G:GL):''}${note?`<div class="t" style="margin-top:14px;font-size:30px">${note}</div>`:''}
<div class="t" style="margin-top:${pr?44:0}px">${text}</div></div>${pg(i)}</div>`;
const slides=[
`<div class="f d"><img src="${photo}" style="position:absolute;right:0;top:0;width:520px;height:1350px;object-fit:cover;object-position:30% 30%">
<div style="position:absolute;left:72px;top:110px;width:460px">
<div style="color:${G};letter-spacing:5px;text-transform:uppercase;font-weight:600;font-size:22px;line-height:1.7">Психолог, гипнолог,<br>регрессолог</div>
<div class="h" style="font-size:100px;margin-top:44px">Чем я могу быть полезна</div>
<div style="height:1px;background:#3A4458;margin:52px 0 44px;width:400px"></div>
<div class="q" style="font-size:50px">Форматы работы и их стоимость</div></div>
<div style="position:absolute;left:72px;bottom:90px;width:440px"><div style="font-size:28px">От бесплатной<br>диагностики до программы</div><div class="sig" style="color:${G};margin-top:18px">Виктория Валуева</div></div></div>`,
`<div class="f l"><div class="eb">С чем приходят</div><div class="body">
<div class="h" style="font-size:88px">Жизнью будто управляет кто-то другой</div>
<div class="t" style="margin-top:40px">Вы знаете, как правильно, а реагируете по-старому: сжимаетесь, срываетесь, тянете всё на себе. Снаружи всё сложилось, работа, семья, дети, а внутри усталость и пустота.</div>
<div class="q" style="font-size:46px;margin-top:40px">Часто ко мне приходят после многих разговоров со специалистами: в голове всё разложено по полочкам, а в теле и в жизни ничего не поменялось</div></div>${pg(2)}</div>`,
`<div class="f d">${arc}<div class="eb">Как я работаю</div><div class="body">
<div class="h" style="font-size:84px">Детский вывод до сих пор ведёт поезд</div>
<div class="t" style="margin-top:40px">За каждой реакцией, которая мешает жить сегодня, стоит история. Чаще всего из детства: когда-то маленький человек сделал вывод о себе и о мире. Работаю через тело, гипноз и регрессию, бережно и в вашем темпе.</div>
<div class="q" style="font-size:52px;margin-top:44px">Нахожу, что скрыто за симптомом, чтобы вы жили легче и свободнее</div></div>${pg(3)}</div>`,
`<div class="f l"><div class="eb">Как всё устроено</div><div class="body">
${[['1','Бесплатная диагностика','Тридцать минут. Вместе смотрим, откуда растёт причина'],['2','Формат под ваш запрос','Я предлагаю, решение остаётся за вами'],['3','Работа и поддержка','Между встречами я на связи, если нужна поддержка']].map(([n,a,b],j)=>`<div style="display:flex;gap:40px;align-items:flex-start;padding:38px 0;${j<2?'border-bottom:1px solid #DDD2C4':''}"><div class="num" style="font-size:110px;color:${GL};width:70px">${n}</div><div><div class="h" style="font-size:60px">${a}</div><div class="t" style="margin-top:12px;font-size:32px">${b}</div></div></div>`).join('')}
</div>${pg(4)}</div>`,
`<div class="f a"><div class="eb">Начало</div><div class="body">
<div class="h" style="font-size:96px;font-weight:600">Диагностика</div>
<div class="pills"><span class="pill">30 минут</span></div>
<div class="rule"></div>
<div class="num" style="font-size:128px">Бесплатно</div>
<div class="t" style="margin-top:44px">Смотрим на ваше состояние, эмоции и тело. Становится видно, откуда растёт причина и с чего начать. Сама работа с причиной идёт уже на сеансе.</div></div>${pg(5)}</div>`,
fmt(6,'d','Курс в записи','«Кто ведёт поезд?»',['5 видеоуроков','В своём ритме'],'5 000','Пять вагонов из детства: фундамент, травма, дефициты детства, перезагрузка, осознанность. Чтобы понять, какие детские выводы ведут ваш поезд, и вернуться в кабину машиниста.','Сейчас записываю, о старте расскажу в канале'),
fmt(7,'l','Разовый сеанс','Сеанс гипноза',['3 часа','Один запрос'],'15 000','Работа с одним конкретным запросом. Находим событие, которое держит реакцию, и проживаем его заново, уже с опорой. Обычно приходит облегчение и ощущение, что управление снова у вас.'),
fmt(8,'d','Регрессия','«Путешествие<br>к Истоку»',['4,5 часа'],'22 500','Для боли, у которой нет объяснения: там, где логика и обычная терапия упираются в стену. Работаем со сценариями, которые повторяются в роду из поколения в поколение.'),
fmt(9,'l','Программа','«Фундамент силы»',['3 сессии по 3 часа','Поддержка между встречами'],'37 500','Детская травма, отношения с родителями, старые реакции. Цель: внутренняя опора, на которую можно встать в любой ситуации.','12 500 ₽ за сессию'),
fmt(10,'d','Программа','«Полная пересборка<br>вашей души»',['6 сессий по 3 часа'],'72 000','Продолжение «Фундамента силы». Тревога и гнев, родовые программы, страх, который становится ресурсом, выход из сценария жертвы, карта жизни и финальная настройка.','12 000 ₽ за сессию'),
fmt(11,'l','Групповой формат','«Живая картина»',['4–5 часов','Дата и стоимость в анонсе'],null,'Выросла из «Рисунка Души». Транс, встреча с эмоцией внутри образа-комнаты, рисунок с открытыми глазами без выхода из транса. Потом разбор и дорисовка изменений.'),
`<div class="f d">${arc}<div class="eb">Честно</div><div class="body">
<div class="h" style="font-size:92px">Чего я не делаю</div><div style="margin-top:30px">
${['Не принимаю решений за вас и не беру ответственность за вашу жизнь','Не заменяю врача: если есть медицинский диагноз, наша работа идёт рядом с лечением','Не обещаю быстрых изменений: тело меняется в своём темпе'].map((x,j)=>`<div class="row" style="${j==2?'border-bottom:none':''}"><div class="num" style="font-size:72px;color:${G};width:50px">${j+1}</div><div class="t" style="color:#F3EEE6">${x}</div></div>`).join('')}</div></div>${pg(12)}</div>`,
`<div class="f d">${arc}<div class="body">
<div class="h" style="font-size:96px">Подходящий формат подскажу на бесплатной диагностике</div>
<div class="t" style="margin-top:48px">Пишите мне в Telegram</div>
<div style="font-size:56px;font-weight:600;color:${G};margin-top:12px">@Victory_Valueva</div>
<div class="sig" style="color:${G};margin-top:90px">Виктория Валуева</div></div>${pg(13)}</div>`];
(async()=>{const b=await chromium.launch();const out=path.join(dir,'out_usl');fs.mkdirSync(out,{recursive:true});
for(let i=0;i<slides.length;i++){const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});const hp=path.join(dir,'usl.html');
fs.writeFileSync(hp,`<html><head><meta charset="utf-8"><style>${css}</style></head><body>${slides[i]}</body></html>`);await p.goto('file://'+hp);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);
const ov=await p.evaluate(()=>{const b=document.querySelector('.body');if(!b)return 0;const r=[...b.children].map(c=>c.getBoundingClientRect());return [Math.round(Math.min(...r.map(x=>x.top))),Math.round(Math.max(...r.map(x=>x.bottom)))]});
console.log(i+1,JSON.stringify(ov));await p.screenshot({path:path.join(out,String(i+1).padStart(2,'0')+'.png')});await p.close();}
const p=await b.newPage({viewport:{width:1640,height:1640}});const fl=fs.readdirSync(out).filter(x=>x.endsWith('.png')).sort();
fs.writeFileSync(path.join(dir,'su.html'),`<body style="margin:0;display:grid;grid-template-columns:repeat(5,324px);gap:4px">${fl.map(x=>`<img src="file://${out}/${x}" style="width:324px">`).join('')}</body>`);
await p.goto('file://'+path.join(dir,'su.html'));await p.waitForTimeout(600);await p.screenshot({path:path.join(dir,'sheet_usl.png')});await b.close();})();
