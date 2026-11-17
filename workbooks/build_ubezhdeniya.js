// Тетрадь «Мои убеждения» -> PDF (A4). node build_ubezhdeniya.js <fonts_dir> <out.pdf>
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const [FD,OUT]=process.argv.slice(2);
const fcss=fs.readFileSync(path.join(FD,'fonts.css'),'utf8').replace(/url\((f\d+\.woff2)\)/g,(_,f)=>`url(file://${path.join(path.resolve(FD),f)})`);
const N='#1F2836',G='#D9A35F',GL='#9A6A2F',CR='#F6F1E9',LN='#D9CFC2';
const css=`${fcss}@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Manrope',sans-serif;color:${N};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:20mm 18mm 18mm;position:relative;overflow:hidden;page-break-after:always;background:${CR}}
.pg.dark{background:${N};color:#F3EEE6}
.eb{font-size:9pt;letter-spacing:2.5pt;text-transform:uppercase;font-weight:600;color:${GL}}
.dark .eb{color:${G}}
h1{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:54pt;line-height:1;color:#F5EFE6}
h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:30pt;line-height:1.05;margin-top:4mm}
.q{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;color:${GL};font-size:15pt;line-height:1.3}
.dark .q{color:${G}}
p.t{font-size:10.5pt;line-height:1.6;margin-top:3.5mm;color:#3A4150}
.dark p.t{color:#C9C2B6}
.num{display:flex;gap:4mm;margin-top:3mm;font-size:10.5pt;line-height:1.55;color:#3A4150}
.num b{font-family:'Cormorant Garamond',serif;font-size:16pt;color:${GL};width:6mm;flex-shrink:0;line-height:1.1}
.lab{font-size:10pt;font-weight:600;margin-top:6mm;color:${N}}
.ln{border-bottom:1px solid ${LN};height:9mm}
.box{background:#FBF8F3;border:1px solid #DDD2C4;border-radius:3mm;padding:5mm 6mm;margin-top:5mm}
.inkbox{background:${N};color:#F3EEE6;border-radius:3mm;padding:6mm;margin-top:6mm}
.inkbox .q{color:${G}}
.grp{margin-top:8mm}.grp .gt{font-family:'Cormorant Garamond',serif;font-size:18pt;color:${GL};font-weight:600}
.ck{display:flex;gap:3.5mm;align-items:flex-start;font-size:12pt;line-height:1.45;margin-top:3.5mm}
.ck i{display:inline-block;width:4mm;height:4mm;border:1.2px solid ${GL};border-radius:1mm;flex-shrink:0;margin-top:.7mm}
.scale{display:flex;gap:2.2mm;margin-top:3mm}.scale span{width:9mm;height:9mm;border:1.2px solid ${GL};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9pt;color:${GL}}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font-size:8pt;color:#9C9184;letter-spacing:1pt}
.dark .foot{color:#8E95A3}
table.fold{width:100%;border-collapse:collapse;margin-top:6mm}
table.fold th{font-family:'Cormorant Garamond',serif;font-size:15pt;font-weight:600;color:${GL};text-align:left;padding-bottom:2mm}
table.fold td{height:16mm;border-bottom:1px solid ${LN};width:50%}
table.fold td.l{border-right:1.5px dashed ${GL}}
.tr{display:grid;grid-template-columns:repeat(10,1fr);gap:2mm;margin-top:5mm}
.tr span{aspect-ratio:1;border:1.2px solid ${GL};border-radius:2mm;display:flex;align-items:flex-start;justify-content:flex-start;padding:1mm 1.4mm;font-size:7pt;color:#9C9184}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:8mm}`;
const lines=n=>Array.from({length:n},()=>'<div class="ln"></div>').join('');
let pageNo=0;const foot=()=>`<div class="foot"><span>МОИ УБЕЖДЕНИЯ</span><span>${++pageNo}</span></div>`;
const silhouette=`<svg width="62mm" height="118mm" viewBox="0 0 120 230"><g fill="none" stroke="${GL}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
<circle cx="60" cy="22" r="15"/><path d="M52 37 L52 46 Q30 50 26 62 L18 112 Q16 120 22 121 L27 120 L34 72"/><path d="M68 37 L68 46 Q90 50 94 62 L102 112 Q104 120 98 121 L93 120 L86 72"/>
<path d="M34 72 L36 118 Q38 126 34 132 L36 218 Q36 224 44 224 L52 224 L56 140 L60 132 L64 140 L68 224 L76 224 Q84 224 84 218 L86 132 Q82 126 84 118 L86 72"/></g></svg>`;
const groups=[
['Ценность',['Я нужна, пока я полезна','Меня любят за то, что я делаю','Я недостойна того, чтобы для меня старались','Хвалить себя нескромно']],
['Контроль и ответственность',['Если я не сделаю, никто не сделает','Если я остановлюсь, всё развалится','Я должна справляться сама','Всё должно быть идеально']],
['Отдых и тело',['Отдых надо заслужить','Расслабляться опасно','Плакать стыдно']],
['Просьбы и границы',['Просить значит быть обузой','Отказать значит обидеть','Сначала другие, потом я']],
['Желания и радость',['Хотеть для себя эгоистично','Моё «хочу» опасно','Радоваться просто так нельзя, потом будет плохо']],
['Видимость и деньги',['Высовываться опасно','Деньги достаются только тяжёлым трудом']]];
const pairs=[['Я нужна, пока я полезна','Я ценна просто потому, что я есть'],['Если я не сделаю, никто не сделает','Я могу доверять и делить ответственность'],['Я должна справляться сама','Мне можно просить о помощи'],['Отдых надо заслужить','Мне можно отдыхать, когда я устала'],['Просить значит быть обузой','Моя просьба даёт близким возможность быть рядом'],['Отказать значит обидеть','Моё «нет» бережёт и меня, и отношения'],['Хотеть для себя эгоистично','Мои желания важны'],['Всё должно быть идеально','Достаточно хорошо уже хорошо']];
const P=[];
// 1 cover
P.push(`<div class="pg dark" style="display:flex;flex-direction:column;justify-content:space-between;padding:26mm 20mm">
<svg style="position:absolute;right:-30mm;top:-30mm" width="130mm" height="130mm" viewBox="0 0 400 400"><circle cx="200" cy="200" r="160" fill="none" stroke="#C9964F" stroke-width="2"/><circle cx="200" cy="200" r="120" fill="none" stroke="#C9964F" stroke-width="1.2" opacity=".6"/></svg>
<div class="eb">Рабочая тетрадь · чат «С тобой всё так»</div>
<div><h1>Мои<br>убеждения</h1><p class="q" style="font-size:20pt;margin-top:8mm;width:140mm">Увидеть, поблагодарить и переписать то, что когда-то решило за меня</p></div>
<div><div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17pt;color:${G}">Виктория Валуева и Екатерина Куликова</div><div style="font-size:10pt;color:#C9C2B6;margin-top:2mm">@Victory_Valueva · @ekaterinakulikova_2606</div></div></div>`);
// 2 intro
P.push(`<div class="pg"><div class="eb">Перед началом</div><h2>Что такое убеждение</h2>
<p class="t">Убеждения это выводы о себе и о мире, которые мы когда-то сделали, чаще всего в детстве. Тогда они помогали выжить: защищали от боли, стыда, одиночества. Мы выросли, а выводы остались и продолжают решать за нас: как реагировать, что себе разрешать, сколько отдыхать.</p>
<p class="t">Убеждение можно увидеть, поблагодарить и переписать. Для этого и нужна эта тетрадь.</p>
<div class="lab" style="font-size:12pt;margin-top:8mm">Как работать</div>
<div class="num"><b>1</b><span>Выберите одно убеждение на неделю. Одного достаточно.</span></div>
<div class="num"><b>2</b><span>Пройдите страницы по порядку: найдите его в теле, вспомните, откуда оно, поблагодарите за защиту и перепишите.</span></div>
<div class="num"><b>3</b><span>Запишите новое убеждение своим голосом и слушайте каждый день.</span></div>
<div class="num"><b>4</b><span>Отмечайте в дневнике, где новое уже начинает работать.</span></div>
<div class="num"><b>5</b><span>Делитесь в чате «С тобой всё так». Так поддержка рядом.</span></div>
<div class="inkbox"><p class="q" style="font-size:14pt">Бережно к себе</p><p class="t" style="color:#C9C2B6;margin-top:2mm">Если поднимается слишком много, остановитесь, положите ладонь на грудь, сделайте три медленных выдоха и скажите себе: «Я в безопасности. Я здесь». И напишите нам.</p></div>
<p class="t" style="margin-top:6mm;font-size:9.5pt">Страницы 4–7 можно распечатать несколько раз, по одному комплекту на каждое убеждение.</p>${foot()}</div>`);
// 3-4 list
const half=Math.ceil(groups.length/2);
[[groups.slice(0,3),'Какие убеждения откликаются вам?','Прочитайте каждое вслух и отметьте те, на которые откликается тело: сжимается, теплеет, появляется ком в горле. Это ваши.'],[groups.slice(3),'Продолжение списка','']].forEach(([gs,title,intro],k)=>{
P.push(`<div class="pg"><div class="eb">Список убеждений</div><h2>${title}</h2>${intro?`<p class="t">${intro}</p>`:''}
${gs.map(([gt,items])=>`<div class="grp"><div class="gt">${gt}</div>${items.map(x=>`<div class="ck"><i></i><span>«${x}»</span></div>`).join('')}</div>`).join('')}
${k===1?`<div class="lab" style="margin-top:9mm">Свои убеждения, которых нет в списке</div>${lines(8)}`:''}${foot()}</div>`)});
// 5 belief of week + body
P.push(`<div class="pg"><div class="eb">Шаг 1 · Найти</div><h2>Моё убеждение недели</h2>
<div class="lab">Убеждение, с которым я работаю</div>${lines(2)}
<div class="lab">Насколько я в это верю сейчас</div><div class="scale">${Array.from({length:11},(_,i)=>`<span>${i}</span>`).join('')}</div>
<div style="display:grid;grid-template-columns:66mm 1fr;gap:8mm;margin-top:6mm;align-items:start">
<div><div class="lab" style="margin-top:0">Где оно живёт в теле? Отметьте</div><div style="margin-top:3mm">${silhouette}</div></div>
<div><div class="lab" style="margin-top:0">Какое это ощущение?</div><p class="t" style="margin-top:1.5mm;font-size:9.5pt">Сжатие, тяжесть, жар, холод, пустота, ком, дрожь</p>${lines(4)}
<div class="lab">На что оно похоже? Форма, цвет, размер</div>${lines(4)}</div></div>${foot()}</div>`);
// 6 origin
P.push(`<div class="pg"><div class="eb">Шаг 2 · Вспомнить</div><h2>Откуда оно</h2>
<p class="t">Закройте глаза, положите ладонь туда, где живёт ощущение, и спросите себя: когда это было впервые? Доверьтесь первой картинке, даже если она кажется случайной.</p>
<div class="lab">Какая сцена приходит первой?</div>${lines(3)}
<div class="lab">Сколько мне там лет? Кто рядом?</div>${lines(3)}
<div class="lab">Что я тогда почувствовала?</div>${lines(3)}
<div class="lab">Какой вывод сделала маленькая я?</div>${lines(3)}
<div class="box"><p class="q" style="font-size:12.5pt">У меня это была пятёрка по математике во втором классе. Родители ответили между делом, а маленькая я решила: «Я недостойна того, чтобы для меня старались». Этот вывод много лет сжимал мне сердце каждый раз, когда я отправляла проект клиенту.</p><p class="t" style="font-size:9pt;margin-top:2mm">Виктория</p></div>${foot()}</div>`);
// 7 what it gave
P.push(`<div class="pg"><div class="eb">Шаг 3 · Поблагодарить</div><h2>Что оно мне давало</h2>
<p class="t">Каждое убеждение когда-то нас защищало. Прежде чем отпустить, важно увидеть его заботу.</p>
<div class="lab">От чего это убеждение меня защищало?</div>${lines(5)}
<div class="lab">Что я получала благодаря ему?</div>${lines(5)}
<div class="lab">Чего оно мне стоит сейчас?</div>${lines(5)}
<div class="inkbox"><p class="eb" style="color:${G}">Скажите ему про себя</p><p class="q" style="font-size:16pt;margin-top:3mm">«Я тебя вижу. Ты защищало меня, когда было трудно, и я благодарна тебе. Теперь это больше не работает для меня, и я знаю, что можно по-другому».</p></div>${foot()}</div>`);
// 8 rewrite
P.push(`<div class="pg"><div class="eb">Шаг 4 · Переписать</div><h2>Старое и новое</h2>
<p class="t">Сложите лист пополам вдоль, по пунктирной линии. Слева запишите старые убеждения, справа, напротив каждого, новое. Пишите новое в настоящем времени, коротко и тепло, так, чтобы тело на него откликалось.</p>
<table class="fold"><tr><th>Старое убеждение</th><th style="padding-left:5mm">Новое убеждение</th></tr>${Array.from({length:9},()=>'<tr><td class="l"></td><td></td></tr>').join('')}</table>${foot()}</div>`);
// 9 examples
P.push(`<div class="pg"><div class="eb">Подсказки</div><h2>Как может звучать новое</h2>
<p class="t">Если трудно найти слова, начните с этих формулировок и поменяйте их так, чтобы они звучали вашим голосом.</p>
<table class="fold" style="margin-top:5mm"><tr><th>Старое</th><th style="padding-left:5mm">Новое</th></tr>${pairs.map(([a,b])=>`<tr><td class="l" style="height:auto;padding:3mm 4mm 3mm 0;font-size:10pt;color:#5A6070">«${a}»</td><td style="height:auto;padding:3mm 0 3mm 5mm;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13.5pt;color:${GL}">«${b}»</td></tr>`).join('')}</table>${foot()}</div>`);
// 10 practice
P.push(`<div class="pg dark"><div class="eb">Практика на 5 минут</div><h2 style="color:#F5EFE6">Встреча с убеждением</h2>
${[['Сядьте удобно и положите ладонь туда, где живёт старое убеждение.'],['Скажите его про себя и заметьте, что откликается в теле.'],['Скажите ему: «Я тебя вижу. Ты защищало меня, когда было трудно. Спасибо. Теперь это больше не работает для меня, и я знаю, что можно по-другому».'],['Сделайте три медленных выдоха, каждый длиннее вдоха.'],['Скажите новое убеждение вслух. Повторите три раза, каждый раз чуть увереннее. Заметьте, что изменилось в теле.']].map(([t],i)=>`<div class="num" style="color:#E6E0D6;margin-top:9mm;font-size:13pt;line-height:1.6"><b style="color:${G};font-size:20pt">${i+1}</b><span>${t}</span></div>`).join('')}
<div class="lab" style="color:#F3EEE6;margin-top:10mm">Насколько я верю в новое после практики</div><div class="scale">${Array.from({length:11},(_,i)=>`<span style="border-color:${G};color:${G}">${i}</span>`).join('')}</div>${foot()}</div>`);
// 11 60 days
P.push(`<div class="pg"><div class="eb">Шаг 5 · Закрепить</div><h2>Моим голосом, 60 дней</h2>
<p class="t">Запишите новые убеждения на диктофон своим голосом: спокойно и тепло, как говорили бы любимому человеку. Слушайте каждый день, утром или перед сном. Новое закрепляется повторением, так же, как когда-то закрепилось старое. Отмечайте каждый день, когда послушали.</p>
<div class="tr">${Array.from({length:60},(_,i)=>`<span>${i+1}</span>`).join('')}</div>
<div class="cols" style="margin-top:6mm"><div><div class="lab">Что я заметила через 30 дней</div>${lines(4)}</div><div><div class="lab">Что я заметила через 60 дней</div>${lines(4)}</div></div>${foot()}</div>`);
// 12 diary
P.push(`<div class="pg"><div class="eb">Шаг 6 · Замечать</div><h2>Где новое уже работает</h2>
<p class="t">Записывайте маленькие моменты, когда вы поступили по-новому: попросили о помощи, отдохнули без чувства вины, сказали «нет». Маленькие победы тоже считаются.</p>
<div class="cols">${Array.from({length:8},(_,i)=>`<div><div class="lab">Дата</div>${lines(4)}</div>`).join('')}</div>${foot()}</div>`);
// 13 final
P.push(`<div class="pg dark" style="display:flex;flex-direction:column;justify-content:center">
<div class="eb">Если убеждение держится крепко</div><h2 style="color:#F5EFE6;font-size:34pt">Некоторые корни уходят глубоко</h2>
<p class="t" style="font-size:11.5pt">Бывает, что убеждение возвращается снова и снова, сколько бы вы его ни переписывали. Значит, оно держится на ранней сцене, до которой голова сама не дотягивается. С такими убеждениями я работаю в гипнозе: на сеансе мы переписываем негативные убеждения в комнате ваших жизненных правил и убеждений.</p>
<p class="q" style="font-size:16pt;margin-top:8mm">Первая консультация диагностическая и бесплатная</p>
<div style="margin-top:12mm;display:grid;grid-template-columns:1fr 1fr;gap:8mm">
<div><div style="font-family:'Cormorant Garamond',serif;font-size:18pt;color:#F5EFE6">Виктория Валуева</div><div style="font-size:10pt;color:${G};margin-top:1mm">@Victory_Valueva</div></div>
<div><div style="font-family:'Cormorant Garamond',serif;font-size:18pt;color:#F5EFE6">Екатерина Куликова</div><div style="font-size:10pt;color:${G};margin-top:1mm">@ekaterinakulikova_2606</div></div></div>
<p class="q" style="margin-top:16mm;font-size:18pt">С тобой всё так</p>${foot()}</div>`);
(async()=>{const b=await chromium.launch();const p=await b.newPage();const hp=path.join(path.dirname(path.resolve(OUT)),'_wb.html');
fs.writeFileSync(hp,`<html><head><meta charset="utf-8"><style>${css}</style></head><body>${P.join('')}</body></html>`);
await p.goto('file://'+hp);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
const ov=await p.evaluate(()=>[...document.querySelectorAll('.pg')].map((pg,i)=>{const r=pg.getBoundingClientRect();let mx=0;pg.querySelectorAll('*').forEach(e=>{if(e.closest('svg')||e.classList.contains('foot')||e.closest('.foot'))return;const q=e.getBoundingClientRect();if(q.height)mx=Math.max(mx,q.bottom-r.top)});return [i+1,Math.round(mx/r.height*297)]}).filter(x=>x[1]>286));
console.log('overflow(mm):',JSON.stringify(ov));
await p.pdf({path:OUT,format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});fs.unlinkSync(hp);await b.close();console.log('ok',P.length);})();
