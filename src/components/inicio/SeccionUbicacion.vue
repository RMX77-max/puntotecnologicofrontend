<template>
  <section v-revelar="{ efecto: 'subir' }" class="seccion-ubicacion">
    <div class="seccion-ubicacion__contenido">
      <div v-revelar="{ efecto: 'izquierda', retraso: 90 }" class="seccion-ubicacion__info">
        <p>Visitanos</p>
        <h2>Atencion directa en tienda y por WhatsApp</h2>
        <span>Coordina tu compra, consulta disponibilidad o solicita asesoria para armar tu setup.</span>

        <div class="seccion-ubicacion__datos">
          <article>
            <q-icon name="place" />
            <div>
              <strong>{{ ubicacion.ciudad }}</strong>
              <span>{{ ubicacion.direccion }}</span>
              <small>{{ ubicacion.referencia }}</small>
            </div>
          </article>

          <article>
            <q-icon name="schedule" />
            <div>
              <strong>Horarios</strong>
              <span v-for="horario in ubicacion.horarios" :key="horario.dias">
                {{ horario.dias }} · {{ horario.horas }}
              </span>
            </div>
          </article>

          <article>
            <q-icon name="chat" />
            <div>
              <strong>WhatsApp</strong>
              <span>{{ configuracion?.whatsapp_principal }}</span>
            </div>
          </article>
        </div>

        <div class="seccion-ubicacion__acciones">
          <q-btn
            unelevated
            color="primary"
            icon="map"
            label="Como llegar"
            :href="ubicacion.enlace_mapa"
            target="_blank"
          />
          <q-btn
            outline
            color="positive"
            icon="chat"
            label="Escribir por WhatsApp"
            :href="`https://wa.me/${configuracion?.whatsapp_principal || ''}`"
            target="_blank"
          />
        </div>
      </div>

      <div v-revelar="{ efecto: 'derecha', retraso: 160 }" class="seccion-ubicacion__mapa">
        <iframe
          v-if="ubicacion.mapa_embed_url"
          :src="ubicacion.mapa_embed_url"
          title="Mapa de ubicacion"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
        <div v-else class="seccion-ubicacion__mapa-placeholder">
          <q-icon name="location_on" size="64px" />
          <strong>{{ ubicacion.ciudad }}</strong>
          <span>Mapa preparado para conectar con Google Maps.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import 'src/css/components/ubicacion.css'

const props = defineProps({
  configuracion: { type: Object, default: null },
})

const ubicacion = computed(
  () =>
    props.configuracion?.ubicacion || {
      ciudad: 'Cochabamba, Bolivia',
      direccion: 'Direccion pendiente de configurar',
      referencia: '',
      horarios: [],
      enlace_mapa: 'https://www.google.com/maps',
      mapa_embed_url: '',
    },
)
</script>
