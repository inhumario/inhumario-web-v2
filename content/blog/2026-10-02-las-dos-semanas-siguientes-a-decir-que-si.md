---
title: Las dos semanas siguientes a decir que sí
description: Se habla mucho de decidir automatizar algo y muy poco de lo que pasa justo después. Cuento las dos primeras semanas tal como son: la primera no se programa, se mira; la segunda funciona en paralelo con lo manual. Con las horas reales que le cuesta al cliente y los 14 requisitos que aparecieron en una implantación cuando ya estaba «todo definido».
date: 2026-10-02
slug: las-dos-semanas-siguientes-a-decir-que-si
cover: /assets/sidices_1_li.png
---

Cuando alguien decide automatizar una parte de su trabajo, la conversación suele acabar ahí: se decide, se acuerda y cada uno se va a su sitio. Lo que casi nunca se cuenta es **lo que pasa las dos semanas siguientes**, que es justo donde un proyecto se salva o se pierde.

Lo escribo porque es la pregunta que más me hacen antes de empezar y la que peor contesto cuando improviso: *«¿y esto cuánto tiempo mío me va a costar?»*.

## El problema: la primera reunión siempre miente, y no por mala fe

En la primera reunión te cuentan el proceso como **debería** ser. Limpio, con tres pasos, sin excepciones. Nadie miente: es que así es como uno se recuerda su propio trabajo.

Luego te sientas a mirarlo de verdad y aparece el cliente que siempre pide por teléfono, el proveedor que factura distinto a todos los demás, el albarán que se firma en papel porque aquel almacén no tiene cobertura, y el apaño que alguien montó hace cuatro años y del que ya nadie se acuerda pero del que depende media contabilidad.

Tengo un número para esto, de una implantación de este mismo septiembre. El concepto estaba validado por el cliente — con estas palabras: *«está bien definido»*. Dos días después me llegó su organigrama en papel, con cinco áreas, y de ahí salieron **14 requisitos que no estaban en ninguna de nuestras conversaciones anteriores**. Ninguno era un capricho: dos de ellos (el control de calidad y la gestión de seguros) eran de los más grandes de todo el proyecto.

<div class="stats-grid">
  <div class="stat"><div class="big">14</div><div class="lbl">requisitos que aparecieron cuando ya estaba «todo definido»</div></div>
  <div class="stat"><div class="big">11</div><div class="lbl">dudas que el cliente mandó por audio, de una tacada</div></div>
  <div class="stat"><div class="big">2</div><div class="lbl">de ellos eran los módulos más grandes del proyecto</div></div>
</div>

Si eso aparece en la semana uno, es información. Si aparece en la cinco, con medio sistema construido, es un rehacer.

## La semana uno: no se programa, se mira

La primera semana no escribo casi código. Se recoge **cómo lo hacéis hoy**, no cómo debería hacerse. Me siento al lado de quien lo hace, le pido que lo haga como siempre y voy preguntando por lo raro: *¿y cuando no viene así? ¿y si falta ese dato? ¿esto quién lo decide?*

Media conversación de esa semana se va en decidir **qué queda fuera**. Y esa media conversación es la que salva el proyecto: un proceso con tres excepciones automatizadas al 90 % funciona; el mismo proceso automatizado al 100 % con las excepciones metidas a presión se cae el primer martes raro.

De aquí sale una lista corta y aburrida: lo que se automatiza, lo que sigue a mano, y quién decide en los casos que no están claros.

## La semana dos: funciona, pero en paralelo

La semana dos ya hay algo que corre. Y lo primero que hace es **no servir para nada a propósito**: la automatización trabaja a la vez que el proceso manual, sin tocar nada de verdad.

Se comparan los dos resultados unos días. Si no coinciden, se ajusta — y casi nunca falla el programa: falla una regla que nos contamos mal en la semana uno. Nadie apaga lo viejo hasta que lo nuevo acierta **varios días seguidos**.

Es la parte que más impaciencia da y la que más disgustos ahorra. Yo mismo la he saltado por confianza y he pagado el peaje: un proceso mío de envío de correos me mandó dos mensajes duplicados a dos clientes porque interpreté una señal de «lanzado» como «terminado». Diez días de rodaje en paralelo habrían cazado eso por 0 €.

## Los números: lo que cuesta de tu tiempo

Esta es la parte que nadie te dice y la que de verdad quieres saber:

<div class="stats-grid">
  <div class="stat"><div class="big">2-3 h</div><div class="lbl">tuyas la primera semana, contando cómo trabajáis</div></div>
  <div class="stat"><div class="big">15 min</div><div class="lbl">al día la segunda, revisando lo que sale en paralelo</div></div>
  <div class="stat"><div class="big">0 h</div><div class="lbl">a partir de la tercera</div></div>
</div>

Ese cero es exactamente el objetivo. Si a la quinta semana sigues dedicándole quince minutos diarios a vigilar la automatización, no está terminada: te has cambiado una tarea por otra.

Y conviene decir la otra cara: esas dos o tres horas de la primera semana **no son negociables**. Tienen que ser de alguien que conozca el proceso de verdad, no de quien tenga el hueco libre en la agenda.

## Cuando sale mal, casi siempre es por lo mismo

De todo lo que he visto fallar, tres causas se repiten y ninguna es técnica:

**Que nadie del negocio tenga esas horas la primera semana.** Se sustituye por una llamada de media hora y un «ya lo irás viendo». Lo que se construye entonces es el proceso ideal de la primera reunión, que no existe.

**Que se apague lo manual demasiado pronto.** Funciona tres días, da confianza, se apaga lo viejo, y el caso raro llega el día nueve cuando ya no hay red.

**Que se automatice un proceso que había que cambiar antes.** Es la peor de las tres, porque el resultado es un proceso malo pero más rápido. Y si un proceso malo va rápido, cuesta mucho más volver a tocarlo: ya «funciona».

## Las dos horas

Si tuviera que resumirlo en una frase: automatizar algo cuesta **dos o tres horas tuyas y dos semanas de paciencia**, y el 90 % de lo que sale mal se decide en la primera de esas dos semanas.

Esas dos horas son también lo que hace falta para saber si lo tuyo se automatiza o no — aunque la respuesta sea que no compensa, que pasa más veces de las que parece y que es una respuesta perfectamente buena.
