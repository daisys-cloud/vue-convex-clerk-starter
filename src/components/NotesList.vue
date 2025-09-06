<template>
  <div class="notes-container">
    <div class="notes-header">
      <h2>Work Notes</h2>
      <div class="header-controls">
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            v-model="showOnlyMyNotes" 
          />
          Nur eigene Notes
        </label>
        <button @click="showCreateForm = true" class="btn-primary">
          + New Note
        </button>
      </div>
    </div>


    <!-- Loading state -->
    <div v-if="isLoading" class="loading">
      Loading notes...
    </div>

    <!-- Notes list -->
    <div v-else-if="allNotes && allNotes.length > 0" class="notes-grid">
      <div 
        v-for="note in allNotes" 
        :key="note._id"
        class="note-card"
      >
        <div class="note-header">
          <h3>{{ note.title }}</h3>
          <div class="note-actions">
            <button @click="editNote(note)" class="btn-edit">Edit</button>
            <button @click="deleteNote(note._id)" class="btn-delete">Delete</button>
          </div>
        </div>
        <p class="note-content">{{ note.content }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <p>No notes found. Create your first work note!</p>
      <button @click="showCreateForm = true" class="btn-primary">
        Create your first note
      </button>
    </div>

    <!-- Form Modal -->
    <NotesForm 
      v-if="showCreateForm || editingNote"
      :note="editingNote"
      @close="closeForm"
      @saved="onNoteSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConvexQuery, useConvexMutation } from 'convex-vue'
import { api } from '../../convex/_generated/api'
import NotesForm from './NotesForm.vue'

// Reactive state
const showCreateForm = ref(false)
const editingNote = ref(null)
const showOnlyMyNotes = ref(false)

// --- CONDITIONAL QUERIES ---
const { data: allNotesData, isPending: allNotesLoading } = useConvexQuery(api.notes.getAllNotes)
const { data: userNotesData, isPending: userNotesLoading } = useConvexQuery(api.notes.getUserNotes)

// --- COMPUTED PROPERTIES ---
const allNotes = computed(() => {
  return showOnlyMyNotes.value ? userNotesData.value : allNotesData.value
})

const isLoading = computed(() => {
  return showOnlyMyNotes.value ? userNotesLoading.value : allNotesLoading.value
})

// --- MUTATIONS ---
const { mutate: deleteNoteMutation } = useConvexMutation(api.notes.deleteNote)

// --- METHODS ---
const editNote = (note: any) => {
  editingNote.value = note
}

const deleteNote = async (noteId: string) => {
  if (confirm('Are you sure?')) {
    await deleteNoteMutation({ id: noteId })
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingNote.value = null
}

const onNoteSaved = () => {
  closeForm()
}
</script>

<style scoped>
/* Styles are omitted for brevity */
.notes-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-controls { display: flex; align-items: center; gap: 20px; }
.filter-checkbox { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
.loading { text-align: center; padding: 40px; }
.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
.note-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; }
.empty-state { text-align: center; padding: 60px 20px; }
.btn-primary { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-edit, .btn-delete { border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; color: white; }
.btn-edit { background: #28a745; }
.btn-delete { background: #dc3545; }
</style>