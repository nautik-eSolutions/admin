<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  ports: {
    type: Array,
    required: true
  },
  admin: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'save'])
const dialogModel = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const formRef = ref(null)
const form = ref({
  username: '',
  password: '',
  portId: null
})

const required = (v) => !!v || 'Campo obligatorio'
const min3 = (v) => (v && v.length >= 3) || 'Mínimo 3 caracteres'

watch(
  () => props.admin,
  (val) => {
    if (val) {
      form.value = {
        username: val.username,
        password: '',
        portId: val.portId
      }
    } else {
      form.value = {
        username: '',
        password: '',
        portId: null
      }
    }
    formRef.value?.resetValidation()
  },
  { immediate: true }
)

function close() {
  dialogModel.value = false
}

async function submit() {
  const valid = await formRef.value.validate()
  if (!valid) return

  emit('save', { ...form.value })
  dialogModel.value = false
}
</script>

<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card style="min-width: 420px">
      <q-card-section>
        <div class="text-h6">
          {{ admin ? 'Editar Administrador' : 'Crear Administrador' }}
        </div>
      </q-card-section>

      <q-form ref="formRef" @submit.prevent="submit">
        <q-card-section class="column q-gutter-md">

          <q-input
            v-model="form.username"
            label="Username"
            outlined
            dense
            :rules="[required, min3]"
            lazy-rules
          />

          <q-input
            v-if="!admin"
            v-model="form.password"
            type="password"
            label="Password"
            outlined
            dense
            :rules="[required, min3]"
            lazy-rules
          />

          <q-select
            v-model="form.portId"
            :options="ports.map(p => ({ label: p.name, value: p.id }))"
            label="Puerto"
            outlined
            dense
            emit-value
            map-options
            :rules="[required]"
            lazy-rules
          />

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="close" />
          <q-btn
            color="primary"
            label="Guardar"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
