<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Note' : 'Create New Note' }}</h3>
        <button @click="close" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="note-form">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Brief description of the work done"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="content">Content *</label>
          <textarea
            id="content"
            v-model="formData.content"
            required
            placeholder="Detailed description of the work performed..."
            rows="6"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.billable"
                type="checkbox"
                class="form-checkbox"
              />
              <span class="checkmark"></span>
              Billable Work
            </label>
          </div>

          <div class="form-group">
            <label for="duration">Duration (minutes)</label>
            <input
              id="duration"
              v-model.number="formData.duration"
              type="number"
              min="0"
              step="15"
              placeholder="e.g., 60"
              class="form-input"
            />
          </div>
        </div>

        <div v-if="isEditing" class="form-group">
          <label for="billStatus">Billing Status</label>
          <select
            id="billStatus"
            v-model="formData.billStatus"
            class="form-select"
          >
            <option value="open">Open</option>
            <option value="billed">Billed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" @click="close" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="isSubmitting" class="btn-primary">
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Note' : 'Create Note') }}
          </button>
        </div>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useConvexMutation } from 'convex-vue'
import { api } from '../../convex/_generated/api'

// Props
const props = defineProps<{
  note?: any
}>()

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// Reactive state
const isSubmitting = ref(false)
const error = ref('')

const formData = reactive({
  title: '',
  content: '',
  billable: false,
  duration: undefined as number | undefined,
  billStatus: 'open' as 'open' | 'billed' | 'canceled'
})

// Computed
const isEditing = computed(() => !!props.note)

// Mutations
const { mutate: createNote } = useConvexMutation(api.notes.createNote)
const { mutate: updateNote } = useConvexMutation(api.notes.updateNote)

// Methods
const initializeForm = () => {
  if (props.note) {
    formData.title = props.note.title
    formData.content = props.note.content
    formData.billable = props.note.billable
    formData.duration = props.note.duration
    formData.billStatus = props.note.billStatus
  } else {
    // Reset form for new note
    formData.title = ''
    formData.content = ''
    formData.billable = false
    formData.duration = undefined
    formData.billStatus = 'open'
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  error.value = ''
  isSubmitting.value = true

  try {
    if (isEditing.value) {
      // Update existing note
      await updateNote({
        id: props.note._id,
        title: formData.title,
        content: formData.content,
        billable: formData.billable,
        duration: formData.duration,
        billStatus: formData.billStatus
      })
    } else {
      // Create new note
      await createNote({
        title: formData.title,
        content: formData.content,
        billable: formData.billable,
        duration: formData.duration
      })
    }
    
    emit('saved')
  } catch (err) {
    console.error('Failed to save note:', err)
    error.value = 'Failed to save note. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const close = () => {
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

// Initialize form when component mounts or note changes
onMounted(() => {
  initializeForm()
})

// Watch for prop changes
// Note: In Vue 3 composition API, we need to watch props manually if needed
import { watch } from 'vue'
watch(() => props.note, () => {
  initializeForm()
}, { immediate: true })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.note-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0;
}

.form-checkbox {
  width: auto;
  margin-right: 8px;
  transform: scale(1.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #545b62;
}

.error-message {
  padding: 15px 20px;
  background: #f8d7da;
  color: #721c24;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>