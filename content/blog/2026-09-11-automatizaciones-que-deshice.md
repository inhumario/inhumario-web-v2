---
title: Tres automatizaciones que monté, funcionaron, y deshice
description: Las tres cosas que automaticé en mi propio negocio, que hacían exactamente lo que les pedí, y que acabé apagando. Qué me costó cada una, qué me quedé de ellas y la regla que saqué para no repetirlo.
date: 2026-09-11
slug: automatizaciones-que-deshice
cover: /assets/atras_1_li.png
---

La semana pasada conté [lo que no automatizo](/blog/lo-que-no-automatizo) y dónde pongo la línea. Hoy va la otra mitad de la historia, que es menos cómoda de contar: **las tres cosas que sí automaticé, que funcionaron, y que acabé apagando.**

Ninguna de las tres falló. Eso es lo importante. No hubo un error de código, ni una integración caída, ni un dato mal leído. Las tres hacían exactamente lo que les pedí. El problema era lo que les pedí.

## El problema: una automatización que funciona puede seguir siendo mala idea

Cuando algo se rompe, lo ves. Sale un error, alguien se queja, se para la cadena y lo arreglas.

Lo que no se ve es una automatización que funciona al 90 % y te quita el sitio desde el que mirabas ese 10 %. No da error. No se queja nadie. Simplemente, tres meses después, te has quedado sin criterio sobre una parte de tu negocio y no sabes cuándo lo perdiste.

Las tres que deshice eran de ese tipo.

## 1. Contestar a clientes enfadados

**Qué monté.** El sistema que me responde las reseñas ya llevaba miles de respuestas publicadas sin que yo escribiera ninguna. El siguiente paso parecía obvio: que contestara también los correos de clientes con un problema. Tono de la marca, disculpa, solución propuesta, todo redactado en segundos.

**Qué pasó.** Salía correcto. Y salía frío. Un cliente enfadado no se calma con un texto correcto; se calma cuando nota que al otro lado hay alguien que sabe qué le prometió y qué le va a cumplir. Y eso no está en los datos del pedido. Las respuestas automáticas cerraban la incidencia y no recuperaban a la persona: el ticket quedaba resuelto y el cliente no volvía.

**Qué me quedé.** El aviso. Ahora la máquina detecta el correo enfadado, me lo pone delante con el pedido, el histórico y qué ha fallado, y contesto yo en cinco minutos. Sigo tardando lo mismo en escribir — pero ya no tardo en enterarme, que era el verdadero problema.

## 2. Pedir género al proveedor por stock mínimo

**Qué monté.** Regla clásica de manual: cuando un producto baja del umbral, se genera el pedido al proveedor y sale. Cero intervención.

**Qué pasó.** La regla no sabía leer el calendario. En agosto no se vende, en septiembre se dispara y en diciembre se dispara de otra manera. Pedí de más dos veces —dinero parado en una estantería durante meses— y de menos una, que es peor: se agotó lo que más rotaba justo en la semana que más rotaba.

Un umbral fijo es una foto. La demanda es una película.

**Qué me quedé.** La propuesta. El sistema calcula el pedido mirando la rotación real de las últimas semanas y el mismo mes del año anterior, me lo presenta montado y lo firmo yo. Tardo dos minutos al día y he dejado de comprar a ciegas. Que la máquina prepare y la persona confirme es, de largo, [la regla que más me ha ahorrado](/blog/la-maquina-prepara-la-persona-confirma).

## 3. Clasificar el correo en carpetas

**Qué monté.** Clasificación automática de todo el correo entrante por carpetas: proveedores, clientes, bancos, administración, ruido.

**Qué pasó.** Acertaba el 90 % de las veces. El 10 % restante era, sistemáticamente, el correo importante: el que no se parecía a nada anterior, el que venía de alguien nuevo, el aviso raro. Justo lo que hay que ver es lo que peor clasifica un sistema que aprende de lo que ya ha visto.

Y hubo un efecto secundario peor que los fallos: **dejé de mirar la bandeja**, porque "ya estaba ordenada". Bajé la guardia sobre la única cosa que había automatizado para vigilar mejor.

**Qué me quedé.** El resumen de las siete de la mañana: un correo al día con lo que ha entrado y qué necesita respuesta. No mueve nada de sitio, no decide nada. Solo me cuenta. Es la automatización que más uso de todo lo que tengo montado.

## Los números

<div class="stats-grid">
  <div class="stat"><div class="big">3 de 3</div><div class="lbl">automatizaciones apagadas que funcionaban sin errores</div></div>
  <div class="stat"><div class="big">0</div><div class="lbl">fallos técnicos: todas hacían lo que les pedí</div></div>
  <div class="stat"><div class="big">3 de 3</div><div class="lbl">sustituidas por un aviso o una propuesta, no por trabajo manual</div></div>
  <div class="stat"><div class="big">2 min</div><div class="lbl">al día para firmar el pedido a proveedor que antes salía solo</div></div>
</div>

Fíjate en el patrón, porque es lo único que hay que llevarse de este artículo: en los tres casos **no volví al trabajo manual de antes**. Volví un paso atrás, no al principio. La máquina siguió haciendo la parte pesada —detectar, calcular, resumir— y le quité solo la decisión final.

## La regla que saqué

Antes de automatizar una tarea entera, me hago una pregunta que no me hacía hace un año:

> **¿Esta tarea la hago porque hay que ejecutarla, o porque al hacerla me entero de algo?**

Si es lo primero, adelante: que corra sola y no volvamos a hablar de ella. Si es lo segundo, automatizar la ejecución te deja sin la información, y eso lo pagas tarde y en silencio. Ahí lo que se automatiza es **enterarse**, no decidir.

Las tres que deshice eran tareas del segundo tipo disfrazadas de tareas del primero. Contestar a un cliente enfadado es cómo te enteras de qué estás haciendo mal. Pedir a proveedor es cómo te enteras de qué se está vendiendo. Ordenar el correo es cómo te enteras de lo que te viene. Automaticé la ejecución y me quedé sin el enterarme — hasta que lo puse al revés.

Si te están vendiendo que se automatiza todo, esta parte no te la están contando.
