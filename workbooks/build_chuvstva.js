// Гайд «Мои чувства» -> PDF (A4). node build_chuvstva.js <fonts_dir> <photo.jpg> <out.pdf>
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const [FD,PH,OUT]=process.argv.slice(2);
const fcss=fs.readFileSync(path.join(FD,'fonts.css'),'utf8').replace(/url\((f\d+\.woff2)\)/g,(_,f)=>`url(file://${path.join(path.resolve(FD),f)})`);
const photo='file://'+path.resolve(PH);
const N='#1F2836',G='#D9A35F',GL='#9A6A2F',CR='#F6F1E9',LN='#D9CFC2';
const css=`${fcss}@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Manrope',sans-serif;color:${N};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:20mm 18mm 18mm;position:relative;overflow:hidden;page-break-after:always;background:${CR}}
.pg.dark{background:${N};color:#F3EEE6}
.eb{font-size:9pt;letter-spacing:2.5pt;text-transform:uppercase;font-weight:600;color:${GL}}
.dark .eb{color:${G}}
h1{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:60pt;line-height:1;color:#F5EFE6}
h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:30pt;line-height:1.05;margin-top:3mm}
.q{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;color:${GL};font-size:15pt;line-height:1.3}
.dark .q{color:${G}}
p.t{font-size:10.5pt;line-height:1.6;margin-top:3.5mm;color:#3A4150}
.dark p.t{color:#C9C2B6}
.num{display:flex;gap:4mm;margin-top:3mm;font-size:10.5pt;line-height:1.55;color:#3A4150}
.num b{font-size:12pt;font-weight:500;color:${GL};width:5mm;flex-shrink:0;line-height:1.3}
.lab{font-size:10.5pt;font-weight:600;margin-top:6mm;color:${N};line-height:1.5}
.ln{border-bottom:1px solid ${LN};height:9mm}
.inkbox{background:${N};color:#F3EEE6;border-radius:3mm;padding:6mm 7mm;margin-top:6mm}
.inkbox .q{color:${G}}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font-size:8pt;letter-spacing:1pt;color:#9C9184}
.dark .foot{color:#8E95A3}
table{border-collapse:collapse;width:100%}
.ft th{font-size:8.5pt;letter-spacing:1.5pt;text-transform:uppercase;font-weight:600;color:${GL};text-align:left;padding:0 3mm 2.5mm;border-bottom:1.5px solid ${GL}}
.ft td{padding:5mm 3mm;border-bottom:1px solid ${LN};vertical-align:top;font-size:11pt;line-height:1.45;color:#3A4150}
.ft td.f{font-family:'Cormorant Garamond',serif;font-size:19pt;font-weight:600;color:${N};line-height:1.1;width:38mm}
.ft tr:nth-child(even) td{background:#FBF8F3}
.wt th{font-size:8pt;letter-spacing:1pt;text-transform:uppercase;font-weight:600;color:${GL};text-align:left;padding:2mm 2.5mm;border:1px solid ${LN};background:#FBF8F3}
.wt td{border:1px solid ${LN};height:17mm}
.fan td{font-size:8.8pt;padding:0.95mm 2mm;border:1px solid ${LN};color:#2C3442;line-height:1.25;width:25%;background:#FBF8F3}
.fan td.b{font-weight:700;color:${N};background:#F1E4CF}
`;
const foot=(n)=>`<div class="foot"><span>Мои чувства · гайд</span><span>${n}</span></div>`;
const lines=k=>Array(k).fill('<div class="ln"></div>').join('');
const feel=[['Страх','Есть угроза.','Сохранить безопасность: «не ходи, не делай».'],
['Обида','Со мной поступают неправильно, нечестно.','Восстановить справедливость по отношению к себе.'],
['Вина','Ощущение, что я с кем-то поступил(а) неправильно.','Попросить прощения.'],
['Скука','Ощущение, что нет изменений.','Сделать значимые изменения.'],
['Грусть','Ощущение потери.','Компенсировать потерю, восстановить то, что потерял(а).'],
['Одиночество','Ощущение, что нет значимых отношений.','Создать значимые отношения.'],
['Стыд','Ощущение, что со мной что-то не так, я какой-то/какая-то не такой/не такая, я недостоин/недостойна.','Почувствовать, что я достоин/достойна.'],
['Злость','Кто-то причинил боль.','Убрать источник боли и простить.'],
['Разочарование','То, что я делаю, не работает: что-то сделано не так на уровне тактики.','Найти то, что сработает. Когда это найдётся, разочарование уйдёт.']];
const fanRows=`Уверенность|Спокойствие|Чувство полёта|Безразличие
Тревога|Стыд|Нежность|Блаженство
Недоверие|Зажатость|Ясность|Возбуждение
Неприязнь|Веселье|Подавленность|Достоинство
Обида|Гордость|Покорность|Грусть
Ответственность|Высокомерие|Нужность|Зависть
Красота|Настороженность|Искренность|Злость
Уязвимость|Интерес|Предательство|Спокойная совесть
Постоянство|Захваченность желанием|Принятие|Лень
Привязанность|Любовь|Растерянность|Недоумение
Равнодушие|Ужас|Смелость|Уважение
Скука|Энтузиазм|Безмятежность|Язвительность
Правильность|Холодность|Активность|Неполноценность
Бережность|Отвержение|Бессмысленность|Лукавство
Беспомощность|Унижение|Вина|Одиночество
Вдохновение|Обман|Восторг|Ярость
Двойственность|Отвращение|Гнев|Отчаяние
Суета|Тоска|Женственность|Подлинность
Доверие|Удивление|Горе|Презрение
Запутанность|Соперничество|Недовольство собой|Радость
Спокойное созерцание|Смущение|Мужественность|Свобода
Угрызения совести|Разочарование|Укор|Сочувствие
Несправедливость|Беспокойство|Тяжесть|Ступор
Теплота|Стабильность|Энергичность|Лёгкость
Усталость|Счастье|Удовольствие|Боль
Уединение|Страх|Неуверенность|Жадность
Нерешительность|Надёжность|Огорчение|Восхищение
Облегчение|Возмущение|Отстранённость|Доброжелательность
Ненависть|Закрытость|Ожидание|Замешательство
Открытость|Досада|Печаль|Напряжение
Очарование|Мнительность|Сожаление|Лёгкая ирония
Превосходство|Ощущение ловушки, тупика|Пустота|Безысходность
Признательность|Мелочность|Ревность|
Раздражение|Осуждение|Сомнение|
Уныние|Тупость|Страсть|`.split('\n').map(r=>r.split('|'));
const base=new Set(feel.map(x=>x[0]));
const P=[
`<div class="pg dark"><img src="${photo}" style="position:absolute;right:0;top:0;width:92mm;height:297mm;object-fit:cover;object-position:50% 30%">
<div style="position:absolute;left:18mm;top:24mm;width:92mm">
<div class="eb" style="line-height:1.8">Гайд<br>к курсу «Кто ведёт поезд?»</div>
<h1 style="margin-top:14mm">Мои чувства</h1>
<div style="height:1px;background:#3A4458;margin:12mm 0 10mm;width:80mm"></div>
<div class="q" style="font-size:19pt">Таблица базовых чувств и веер эмоций</div>
<p class="t" style="margin-top:8mm">Чтобы назвать то, что происходит внутри, точным словом и понять, о чём это чувство сигналит.</p></div>
<div style="position:absolute;left:18mm;bottom:20mm;width:90mm"><div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18pt;color:${G}">Виктория Валуева</div><div style="font-size:9.5pt;color:#C9C2B6;margin-top:1.5mm">психолог, гипнолог, регрессолог</div></div></div>`,
`<div class="pg"><div class="eb">Зачем называть чувство</div><h2>У всех базовых чувств одна задача: чтобы мы оказались в безопасности</h2>
<p class="t">Чтобы лучше понять себя, полезно знать, за что отвечает каждое чувство. Когда понятно, о чём сигналит чувство, с ним легче договориться, и оно перестаёт управлять нами из глубины.</p>
<p class="t">Когда получается сказать только «мне плохо» или «я устал(а)», эмоция остаётся без имени и продолжает давить изнутри. Точно названное чувство теряет часть силы: когда человек называет эмоцию словом, миндалина, центр тревоги в мозге, успокаивается. Поэтому сначала мы находим напряжение в теле, потом даём ему имя.</p>
<div class="eb" style="margin-top:9mm">Как пользоваться гайдом</div>
<div class="num"><b>1</b><span>Закройте глаза и пройдитесь вниманием по телу сверху вниз. Где есть напряжение: челюсть, горло, плечи, грудь, живот, спина, руки?</span></div>
<div class="num"><b>2</b><span>Какое оно по качеству: тяжесть, жар, холод, сжатие, комок, пустота? На что похоже, если придать ему форму: камень, огонь, туман, узел?</span></div>
<div class="num"><b>3</b><span>Какие чувства и эмоции в нём живут? Найдите слова в веере эмоций и обведите их.</span></div>
<div class="num"><b>4</b><span>Может быть, за этим напряжением стоит конкретная ситуация, которая вызывает эти ощущения и никак не решается. Запишите её в двух-трёх фразах, как есть.</span></div>
<div class="num"><b>5</b><span>Посмотрите в таблицу «Мои чувства»: о чём сигналит это чувство и к чему оно зовёт?</span></div>
<div class="inkbox"><div class="q" style="font-size:14pt">Возвращайтесь к вееру каждый раз, когда внутри «что-то не так», а назвать не получается.</div></div>
${foot(2)}</div>`,
`<div class="pg"><div class="eb">Таблица</div><h2>Мои чувства</h2>
<table class="ft" style="margin-top:7mm"><tr><th>Чувство</th><th>О чём сигналит</th><th>К чему зовёт</th></tr>
${feel.map(([a,b,c])=>`<tr><td class="f">${a}</td><td>${b}</td><td>${c}</td></tr>`).join('')}</table>
${foot(3)}</div>`,
`<div class="pg"><div class="eb">Рабочая страница</div><h2>Что со мной сейчас</h2>
<div class="lab">Какие из этих чувств сейчас есть у меня? Что они пытаются для меня сделать?</div>${lines(3)}
<table class="wt" style="margin-top:6mm"><tr><th style="width:22%">Где в теле</th><th style="width:24%">Какое ощущение</th><th style="width:27%">Какие чувства (слова из веера)</th><th>Ситуация</th></tr>
${Array(3).fill('<tr><td></td><td></td><td></td><td></td></tr>').join('')}</table>
<div class="lab">Какое чувство здесь главное и к чему оно меня зовёт?</div>${lines(3)}
<div class="lab">Что я могу сделать для себя уже сегодня? Иногда ответ простой: выдохнуть, выпить воды, выйти на пять минут на улицу, сказать кому-то «нет».</div>${lines(3)}
${foot(4)}</div>`,
`<div class="pg" style="padding-top:16mm"><div class="eb">Найдите точное слово</div><h2>Веер эмоций</h2>
<p class="t" style="margin-top:2mm;font-size:9.5pt">Обведите слова, которые откликаются сейчас. Цветом выделены девять чувств из таблицы «Мои чувства».</p>
<table class="fan" style="margin-top:4mm">${fanRows.map(r=>`<tr>${r.map(w=>`<td class="${base.has(w)?'b':''}">${w}</td>`).join('')}</tr>`).join('')}</table>
${foot(5)}</div>`,
`<div class="pg dark"><svg style="position:absolute;top:-75mm;right:-55mm" width="140mm" height="140mm" viewBox="0 0 500 500"><circle cx="250" cy="250" r="205" fill="none" stroke="#B88A55" stroke-width="2"/></svg>
<div style="position:absolute;left:18mm;right:18mm;top:70mm">
<div class="eb">Если чувство возвращается</div>
<h2 style="color:#F5EFE6;font-size:32pt;margin-top:5mm">Разные люди, разные обстоятельства, а эмоция внутри одна и та же</h2>
<p class="t" style="font-size:11pt;margin-top:7mm">Повторяющаяся эмоция указывает на место, с которым предстоит поработать. Подробнее об этом в курсе «Кто ведёт поезд?». А разобрать свою историю лично можно на консультации.</p>
<div class="q" style="margin-top:12mm;font-size:16pt">Первая консультация диагностическая и бесплатная</div>
<div style="font-size:20pt;font-weight:600;color:${G};margin-top:4mm">Telegram @Victory_Valueva</div>
<div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18pt;color:${G};margin-top:22mm">Виктория Валуева</div></div>
${foot(6)}</div>`];
(async()=>{const b=await chromium.launch();const p=await b.newPage();const hp=path.join(path.dirname(path.resolve(OUT)),'_g.html');
fs.writeFileSync(hp,`<html><head><meta charset="utf-8"><style>${css}</style></head><body>${P.join('')}</body></html>`);
await p.goto('file://'+hp);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
const ov=await p.evaluate(()=>[...document.querySelectorAll('.pg')].map((g,i)=>{const r=g.getBoundingClientRect();let m=0;g.querySelectorAll('*').forEach(e=>{if(e.closest('.foot')||e.tagName==='IMG'||e.tagName==='svg'||e.closest('svg'))return;const q=e.getBoundingClientRect();m=Math.max(m,q.bottom-r.top)});return Math.round(m/3.78)}));console.log('content bottom mm',ov);
await p.pdf({path:OUT,format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});fs.unlinkSync(hp);await b.close();console.log('ok',P.length);})();
