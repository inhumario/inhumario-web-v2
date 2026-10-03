---
title: ¿Cómo te enteras de que una automatización ha dejado de funcionar?
description: Una automatización rota no hace ruido: simplemente deja de pasar algo. Este mes he tenido una parada siete días laborables sin que saltara nada, y la culpa no era del aviso. Lo cuento con los números y con las tres preguntas que hago ahora antes de dar nada por montado.
date: 2026-09-25
slug: como-te-enteras-de-que-algo-ha-dejado-de-funcionar
cover: /assets/enterar_1_li.png
---

Cuando una automatización falla no suena nada. No se cae una estantería ni se enfada un cliente. Simplemente **deja de pasar algo** — y lo que deja de pasar es precisamente lo que habías dejado de mirar, porque para eso lo automatizaste.

Este mes me ha tocado a mí, en casa, con una de las mías. La cuento entera porque es más útil que cualquier ejemplo de cliente.

## El problema: el silencio se parece demasiado a que todo va bien

Tengo un publicador que saca un post en LinkedIn de lunes a viernes a las 08:30. Lleva funcionando desde julio. Usa un permiso de LinkedIn que **caduca cada 60 días** y que solo puedo renovar yo, tecleando mi contraseña.

Caducó un miércoles. El jueves por la mañana el proceso arrancó a su hora, pidió publicar, recibió un «tu permiso ha expirado» y murió. Escribió el error en un fichero de log. Y ya.

Lo que yo vi ese jueves fue: nada. Exactamente lo mismo que veo un día en que todo va bien. Ni un correo, ni un aviso, ni una pantalla en rojo. La cola de posts seguía diciendo «aprobado», que es lo que dice un post sano que espera su turno y también lo que dice un post que lleva una semana sin poder salir. **El estado no distinguía entre las dos cosas.**

<div class="stats-grid">
  <div class="stat"><div class="big">7</div><div class="lbl">días laborables parado</div></div>
  <div class="stat"><div class="big">6</div><div class="lbl">publicaciones perdidas en el canal principal</div></div>
  <div class="stat"><div class="big">0</div><div class="lbl">errores visibles en pantalla</div></div>
</div>

Seis piezas de un canal que tiene 894 seguidores del público al que me dirijo. No es una catástrofe. Es peor que eso: es una pérdida pequeña, constante y silenciosa, del tipo que puede durar meses si nadie lleva la cuenta.

## Las tres formas en que se rompen las cosas sin avisar

No es un caso raro. Cuando repaso lo que se me ha roto este año, casi todo cae en uno de estos tres cajones:

**1. Un permiso que caduca.** Tokens, contraseñas de aplicación, certificados, claves de API. Todos tienen fecha y ninguno avisa. Es la más frecuente con diferencia, y la más tonta: el día que caduca no hay ningún cambio en tu negocio que lo explique.

**2. La máquina no estaba.** El ordenador dormido a la hora de la tarea programada, el contenedor que no arrancó tras un reinicio, la conexión caída justo esos diez minutos. La tarea no falló: no llegó a existir. Y una tarea que no se ejecuta no deja ni el rastro de un error.

**3. El arranque que dice que sí demasiado rápido.** Esta me costó dos correos duplicados hace tres días. Lancé un proceso largo en segundo plano, el sistema me contestó «hecho» al instante — porque había conseguido *lanzarlo*, no *terminarlo* —, yo lo interpreté como que había acabado y lo volví a lanzar. Dos clientes recibieron el mismo mensaje dos veces. La señal existía, pero no significaba lo que yo creía.

## La automatización: el aviso, no más automatización

La reacción natural cuando algo se rompe es blindarlo: reintentos, redundancia, un segundo sistema por si acaso. Casi siempre es la respuesta cara y equivocada.

Lo que funciona es mucho más humilde: **vigilar el resultado esperado, no el error**.

La diferencia es toda. Si vigilas errores, dependes de que el sistema roto tenga fuerzas para avisarte — y un sistema que no se ha llegado a ejecutar no avisa de nada. Si vigilas el resultado, la pregunta es otra y no depende de nadie: *¿ha salido hoy el post de las 08:30? ¿Ha entrado hoy algún pedido? ¿Se generó ayer el fichero del banco?* Si a las diez la respuesta es no, aviso, sin que importe el motivo.

Es la misma idea que el interruptor de hombre muerto de un tren: no hace falta detectar qué le ha pasado al maquinista. Basta con que deje de apretar.

Y es barato. Un aviso así son unas líneas y media hora, frente a los días que cuesta automatizar el proceso que vigila. Por eso, cuando entro en un negocio y pregunto cómo se enteran de que algo ha ido mal, si la respuesta es «mirándolo», ahí hay trabajo que se paga solo antes que cualquier otra cosa de la lista.

## El matiz honesto: el aviso no era el problema

Aquí viene la parte incómoda de mi caso, y es la razón por la que he querido escribirlo.

**Yo sí tenía el aviso.** Todas las mañanas me llegaba un correo diciéndome que el permiso estaba caducado y que hacían falta dos minutos míos para arreglarlo. Me llegó siete días seguidos. Y el post siguió sin salir siete días seguidos.

No falló la vigilancia. Falló lo que venía después: un aviso que llega cada día, siempre igual, deja de leerse al tercero. Se convierte en paisaje. Y un aviso que no tiene dueño con nombre ni fecha de arreglo no es un aviso: es un diario de lo que te va pasando.

De ahí salieron las dos reglas que ahora aplico a cualquier vigilancia que monto, mía o de un cliente:

- **Si se repite, escala.** Al tercer día el aviso cambia de sitio y de tono: deja de ser una línea en el resumen diario y pasa a la lista de cosas bloqueadas, con responsable y con fecha. Lo que no escala, se normaliza.
- **Avisa a quien puede arreglarlo.** Un aviso que le llega a alguien que no tiene la contraseña, el permiso o la autoridad para actuar es ruido, aunque sea información correcta.

## Las tres preguntas

Si tienes algo funcionando solo — una tarea programada, una integración, un informe que se manda a alguien —, haz esta prueba antes de seguir leyendo cualquier otra cosa:

1. **Si mañana dejara de funcionar, ¿cuánto tardarías en enterarte?** Si la respuesta es «cuando alguien se queje», tienes un problema, no una automatización.
2. **¿Lo que vigilas es que no haya errores, o que sí haya resultado?** Solo la segunda pregunta detecta las cosas que no llegan a ejecutarse.
3. **¿Alguna de sus piezas tiene fecha de caducidad?** Apúntala hoy en el calendario, con diez días de aviso. Es lo único de esta lista que se arregla en un minuto.

No hace falta montar nada sofisticado. La mayoría de estos avisos son un correo condicional que alguien lee de verdad. Lo caro nunca es vigilar: es la semana que tardaste en enterarte (a mí me pasó con [un producto seis días agotado](/blog/seis-dias-agotado-ni-una-queja)).
