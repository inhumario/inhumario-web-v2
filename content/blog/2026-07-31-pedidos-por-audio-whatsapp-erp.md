---
title: Mis clientes mandan el pedido por audio de WhatsApp y entra solo en el ERP
description: El caso real de cómo convertimos audios, fotos de listas y mensajes sueltos de WhatsApp en pedidos correctos dentro de Odoo, sin teclear ni una línea.
date: 2026-07-31
slug: pedidos-por-audio-whatsapp-erp
cover: /assets/audio_1_li.png
---

Este tampoco es el caso de un cliente: es el nuestro. En [Aromas de Té](https://www.aromasdete.com) tenemos clientes profesionales que llevan años comprándonos, y ninguno pide de la misma manera. Lo que sigue es cómo dejamos de teclear sus pedidos a mano.

## El problema: cada cliente pide como quiere (y hace bien)

Un cliente habitual no rellena formularios. Coge el móvil y manda lo que tiene a mano:

- Un **audio de WhatsApp** de tres minutos con la lista dictada mientras conduce, con nombres de andar por casa: "de la de tila ponme cuatro, y del arcoíris lo de siempre".
- Una **foto de una lista escrita a mano** en el mostrador.
- Un **email** donde el pedido va a mitad de una conversación sobre otra cosa.

Y ahí no acaba. Cada uno de esos clientes tiene, además, su propia configuración en el ERP: **su tarifa, su descuento fijo, su almacén de salida, su forma de pago, su formato de producto** y, en algunos casos, referencias fabricadas solo para él. Seis clientes habituales son seis maneras de pedir y seis configuraciones distintas que alguien tiene que recordar sin equivocarse.

Ese alguien era yo. Escuchar el audio, apuntar, buscar el producto, acordarme de que a este cliente le va la tarifa 141 con un 25 % adicional y sale del almacén 5, y copiarlo línea a línea en Odoo. Un pedido de veinte líneas se va a media hora larga. Y si te equivocas en un SKU, no has perdido cinco minutos: has generado una incidencia logística que cuesta mucho más que el rato que ahorraste.

**Pedirle al cliente que cambie no era una opción.** El cliente pide como le resulta cómodo, y su comodidad es parte de por qué sigue comprándonos. El que tenía que adaptarse era el sistema.

## La solución: que el pedido se monte solo

Montamos un flujo que hace exactamente lo que hacía yo, en este orden:

1. **Transcribe el audio entero antes de interpretar nada.** Nada de escuchar a medias y adivinar. El audio pasa a texto completo y solo entonces empieza el trabajo.
2. **Identifica al cliente**, aunque el nombre venga incompleto o abreviado, contrastándolo con su historial de pedidos.
3. **Traduce sus palabras a tus referencias.** "Lo de siempre", "los de 100 gramos" o el nombre coloquial de un producto se resuelven mirando lo que ese cliente compró antes — incluidas las referencias que existen solo para él.
4. **Aplica su configuración sin que nadie la recuerde**: tarifa, descuento, almacén, forma de pago, formato. Es el dato del ERP el que manda, no mi memoria.
5. **Deja el pedido preparado en Odoo** y me lo pone delante. Yo lo miro y confirmo.
6. **Y cuando algo no cuadra, pregunta.** Una cantidad fuera de lo normal, un producto que ese cliente no ha comprado nunca o un nombre que no resuelve el historial no se inventan: se consultan antes de confirmar.

## Los números

Este caso no va de un porcentaje espectacular. Va de tres cifras muy concretas:

<div class="stats-grid">
  <div class="stat"><div class="big">0</div><div class="lbl">pedidos que tecleo a mano</div></div>
  <div class="stat"><div class="big">1</div><div class="lbl">clic para confirmar lo que ya está montado</div></div>
  <div class="stat"><div class="big">100 %</div><div class="lbl">de las reglas de cada cliente aplicadas siempre</div></div>
</div>

La tercera es la que de verdad importa. La automatización no solo me quita el rato de teclear: **quita los fallos que venían de acordarme o no de la excepción de cada cliente**. El descuento que se olvidaba, el almacén equivocado, el formato de 20 pirámides en lugar del de 100 gramos. Eso es lo que costaba dinero de verdad.

## Qué puedes copiar de este caso

Si tus clientes te piden por WhatsApp, por teléfono o por email y alguien de tu equipo lo pasa a mano a un ERP, esto es replicable casi tal cual:

1. **No cambies al cliente, cambia el sistema.** El canal por el que te piden es el que a ellos les funciona. Lo que hay que automatizar es lo que pasa después.
2. **El historial es el diccionario.** La mayor parte de la ambigüedad de un pedido ("lo de siempre") se resuelve sola en cuanto el sistema puede mirar lo que ese cliente compró antes.
3. **La excepción de cada cliente va en el sistema, no en la cabeza de nadie.** Tarifas, descuentos, almacenes: si están en el dato, se aplican siempre; si están en la memoria de una persona, fallan el día que esa persona libra.
4. **Automatiza el montaje, no la decisión.** El pedido se monta solo; confirmarlo sigue siendo humano. Ese reparto es el que hace que puedas fiarte.

Lo montamos para nuestra propia tienda y funciona a diario. Si quieres verlo aplicado a tus pedidos y a tu ERP, escríbeme por [WhatsApp](https://wa.me/34650012448) y lo miramos — la primera conversación es gratis.
