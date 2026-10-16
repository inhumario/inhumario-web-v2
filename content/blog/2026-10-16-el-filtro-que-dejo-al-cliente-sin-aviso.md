---
title: El día que mi propio filtro dejó al cliente sin aviso
description: Monté una validación para que un dato basura no llegara nunca al cliente. Dos días después, esa misma validación tiró un dato bueno y el cliente se quedó sin su mensaje. Cuento los dos fallos con horas y números, y las tres capas que uso ahora para que el silencio signifique de verdad que todo va bien.
date: 2026-10-16
slug: el-filtro-que-dejo-al-cliente-sin-aviso
cover: /assets/avisa_1_li.png
meta_description: Un filtro que protege un aviso automático puede ser el que lo calle. Los dos fallos reales, con horas, y las tres capas para arreglarlo.
---

Lo repito mucho: **una automatización bien hecha es la que solo habla cuando hay algo que decir**. Si no suena nada en tres días, son tres días que no has tenido que mirar. Lo escribí hace unas semanas contando [cómo te enteras de que algo ha dejado de funcionar](/blog/como-te-enteras-de-que-algo-ha-dejado-de-funcionar), que me pasó a mí con una parada de siete días laborables.

Pues hay una vuelta de tuerca a eso, y la aprendí hace diez días de la peor manera: **el guardia que pones para que no salga basura puede ser justo el que te deja mudo**. Y cuando el sistema está diseñado para que el silencio sea buena noticia, un silencio por error es indistinguible de que todo va bien.

## El problema: un dato válido en la forma y basura en el contenido

El montaje es sencillo. Cada tarde, a las 20:45, un proceso descarga de la fuente oficial el precio de la luz del día siguiente, dibuja cuatro imágenes con las horas caras y baratas y las manda al cliente por WhatsApp. Él las publica para los suyos. No hay nadie mirando: se manda solo, todos los días, incluidos domingos.

El 7 de octubre, a las 20:45, la fuente devolvió el fichero **perfecto**: las 24 horas del día siguiente, la fecha correcta, el formato correcto. Y todos los precios a **0,00**. No era un error de la fuente: es lo que publica mientras aún no ha calculado el precio real, un relleno a cero que se queda ahí hasta que termina el cálculo.

Mi validación comprobaba que vinieran 24 filas y que la fecha fuera la de mañana. Las dos cosas se cumplían. Así que el proceso hizo lo que le tocaba: dibujó cuatro imágenes impecables anunciando que mañana la luz es gratis a todas horas y se las mandó al cliente.

Él lo vio al minuto: *«Ostras, qué raro, hoy ha salido mal»*. La fuente oficial no publicó el precio de verdad hasta las **23:39**, casi tres horas tarde. Mientras, tres portales de comparación de tarifas mostraban esos mismos ceros como si fueran definitivos, así que el fallo no era mío solo: era de cualquiera que hubiera dado por bueno el fichero por tener la forma correcta.

## La automatización: validar el contenido, no el formato

El arreglo del mismo día fue el obvio y es el que repetiría: **que la validación mire lo que dice el dato, no cómo viene empaquetado**. Veinticuatro precios, mayores que cero, por debajo de un techo razonable y, sobre todo, **no todos iguales** — un dato real de precios por horas nunca es plano. Si no pasa el examen, el proceso no manda nada y se corta. Y el programador que lo lanza pasó de 4 intentos cada cuarto de hora a **10 intentos cada 10 minutos**, con un aviso a mi móvil al cuarto fallo diciendo que la fuente va con retraso.

Esa noche funcionó: el reenvío con el precio bueno salió solo, en el **intento número 34** del bucle de recuperación, con una disculpa delante.

## El segundo fallo: el filtro tira un dato bueno

Dos días después, el 9 de octubre, el cliente no recibió nada. Ni mensaje malo ni mensaje bueno. Nada.

El precio del sábado traía **seis horas ligeramente negativas** — de −0,0003 a −0,0021 €/kWh, entre las once y las cinco de la tarde. Un sábado con todo el consumo en valle y mucho sol: perfectamente real, y cada vez menos raro. Mi filtro flamante exigía que el precio mínimo fuera **mayor que cero**. Así que rechazó el dato bueno diez veces seguidas, entre las 20:45 y las 22:15, y se calló. El cliente se quedó sin sus imágenes y yo me enteré al día siguiente, porque me lo preguntaron.

Lo que más me escuece es que ese mismo error ya lo había cometido **dos días antes, en el mismo parche**: el otro indicador que uso, el del excedente solar, también lo filtraba exigiendo mínimo mayor que cero, y ese día hubo cuatro horas a cero por exceso de sol, así que descartó el dato real y usó una estimación. La lección, escrita ya en letras grandes:

> **Un filtro contra basura no puede dar por supuesto el signo del dato.** Si el dato real puede ser negativo o cero, el filtro tiene que distinguir «dato raro» de «dato ausente», y el relleno a cero se caza por ser plano, no por ser bajo.

## Lo que hay ahora: tres capas y una batería de pruebas

El cliente pidió lo razonable: que no vuelva a pasar. No se arregla con un filtro mejor —el filtro volverá a equivocarse algún día—, se arregla asumiendo que **el proceso puede callarse por error** y poniendo a alguien que lo note.

1. **Marca de entregado.** Cuando el mensaje sale de verdad al cliente, el proceso deja una huella escrita con la fecha del día. No «lo intenté»: «salió».
2. **Rescate a la mañana siguiente.** A las 7:30 un segundo proceso mira si existe la huella de hoy. Si no está, genera el mensaje y lo manda, con tres intentos y un aviso a mi móvil. Es el que convierte «me he quedado mudo» en «llega tarde» — el peor caso pasa de no enterarse nunca a ir unas horas tarde.
3. **El aviso dice el motivo.** Antes me llegaba «ha fallado». Ahora me llega la última línea del registro, que es la que distingue los dos fallos de esta historia: si dice que el precio máximo es normal y aun así no lo acepta, **no es la fuente, soy yo**.

Y una cuarta cosa que no es una capa, es una costumbre: los dos fallos reales —los ceros del día 7 y los negativos del día 9— están guardados como **casos de prueba**. Cada vez que toco el filtro, se pasan antes los dos. Un fallo que te ha costado un disgusto y no dejas convertido en prueba te lo vas a volver a encontrar entero.

<div class="stats-grid">
  <div class="stat"><div class="big">2</div><div class="lbl">fallos en 3 días: uno mandando basura, otro callándose</div></div>
  <div class="stat"><div class="big">2 h 54</div><div class="lbl">tarde publicó la fuente oficial el dato bueno del día 7</div></div>
  <div class="stat"><div class="big">10 → 0</div><div class="lbl">intentos del día 9 y mensajes enviados al cliente</div></div>
  <div class="stat"><div class="big">7:30</div><div class="lbl">hora del proceso de rescate que ahora cubre el silencio</div></div>
</div>

## Las dos preguntas que hago ahora antes de dar algo por montado

Cuando monto un proceso que habla solo con un cliente, antes de dejarlo corriendo me hago dos preguntas que hace un mes no me hacía:

- **Si el dato que me llega es basura con buena forma, ¿lo noto?** No vale comprobar que hay 24 filas. Hay que mirar si dicen algo verosímil.
- **Si mi propio código decide no mandar nada, ¿quién se enfada?** Porque el cliente no se va a enfadar: no sabe que tenía que llegarle algo. Tiene que haber un segundo proceso que eche en falta lo que no llegó.

La segunda es la que casi nadie monta, y es la que separa un aviso que funciona de uno que parece funcionar. Lo mismo vale para [Inhumario Reviews](/resenas), que contesta las reseñas de Google sin que nadie esté delante: su trabajo es no dar guerra, y precisamente por eso lleva dentro quien se da cuenta de que un día no contestó ninguna.

Si tienes algo así corriendo —un informe que sale solo, un pedido que se vuelca de una tienda a otra, un aviso que llega cuando toca—, la pregunta no es si está bien montado. Es **cuánto tardarías en enterarte el día que se calle**.
