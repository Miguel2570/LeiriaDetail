<!-- src/portaladmin/page/portfolio/PortfolioManager.vue -->
<template>
  <div class="backdrop-blur-[30px] p-8 flex flex-col h-full overflow-y-auto card-admin">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-3xl font-bold text-[#000000]">Portfolio Manager</h3>
        <p class="text-[#334155] font-medium mt-1">Gerir trabalhos do portfólio</p>
      </div>
      <button @click="openModal()" class="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl shadow-md flex items-center gap-2">
        <Plus class="w-4 h-4" /> Novo Trabalho
      </button>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">A carregar...</div>

    <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
  <div v-for="item in items" :key="item.id" 
    class="group relative overflow-hidden rounded-lg bg-[#0A0A0F] aspect-square border border-white/5 cursor-pointer"
    @click="openModal(item)">
    
    <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
    <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent opacity-60"></div>
    
    <!-- Badge destaque -->
    <div v-if="item.isFeatured" class="absolute top-1 right-1 w-2 h-2 bg-[#00D8FF] rounded-full shadow-[0_0_6px_#00D8FF]"></div>
    
    <div class="absolute bottom-0 left-0 p-1.5 w-full">
      <p class="text-[#00D8FF] text-[6px] font-black uppercase tracking-wider truncate">{{ item.category }}</p>
      <h3 class="text-white text-[9px] font-black uppercase italic truncate">{{ item.title }}</h3>
    </div>
    
    <!-- Overlay com botões no hover -->
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
      <button @click.stop="openModal(item)" class="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg">
        <Pencil class="w-3.5 h-3.5 text-gray-700" />
      </button>
      <button @click.stop="handleDelete(item.id)" class="w-8 h-8 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-all shadow-lg">
        <Trash2 class="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  </div>
</div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[16px]">
      <div class="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">{{ editingItem ? 'Editar' : 'Novo' }} Trabalho</h3>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-full"><X class="w-5 h-5 text-gray-600" /></button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Título</label>
            <input required v-model="form.title" class="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-900 focus:border-[#06B6D4] outline-none" />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Categoria (Serviço)</label>
            <select required v-model="form.category" class="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-900 focus:border-[#06B6D4] outline-none">
              <option value="">Selecionar serviço...</option>
              <optgroup v-for="pack in packs" :key="pack" :label="pack">
                <option v-for="s in services.filter(s => s.packType === pack)" :key="s.name" :value="`${s.name} (${pack})`">
                  {{ s.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
            <textarea v-model="form.description" rows="4" class="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-900 focus:border-[#06B6D4] outline-none"></textarea>
          </div>

          <!-- GALERIA DE IMAGENS -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Galeria de Imagens ({{ galleryImages.length }})</label>
            <div class="grid grid-cols-3 gap-3 mb-3">
              <div v-for="(img, idx) in galleryImages" :key="idx" class="relative group">
                <img :src="img.url" class="w-full h-24 object-cover rounded-lg border" />
                <select v-model="img.type" class="absolute top-1 left-1 text-[10px] bg-black/70 text-white rounded px-1 py-0.5 border-0">
                  <option value="gallery">Galeria</option>
                  <option value="before">Antes</option>
                  <option value="after">Depois</option>
                </select>
                <button @click="removeGalleryImage(idx)" class="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X class="w-3 h-3 text-white" />
                </button>
              </div>
              <!-- Botão de adicionar -->
              <div class="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#06B6D4] transition-colors" @click="triggerGalleryUpload">
                <Plus class="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="form.isFeatured" class="w-4 h-4" />
            <label class="text-sm text-gray-700">Destacar no portfólio</label>
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold disabled:opacity-50">
            {{ isSubmitting ? 'A guardar...' : editingItem ? 'Atualizar' : 'Adicionar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, X, Pencil, Trash2 } from 'lucide-vue-next'
import { graphql } from '@/graphql'
import { Cache } from '@/services/cachemanager'

interface PortfolioItem {
  id: string; title: string; description: string; category: string;
  imageUrl: string; beforeImageUrl?: string; afterImageUrl?: string; isFeatured: boolean;
}

interface GalleryImage {
  url: string
  type: 'gallery' | 'before' | 'after'
}

const items = ref<PortfolioItem[]>([])
const services = ref<{ name: string; packType: string }[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingItem = ref<PortfolioItem | null>(null)
const galleryImages = ref<GalleryImage[]>([])
const form = ref({ title: '', description: '', category: '', isFeatured: false })

const packs = computed(() => [...new Set(services.value.map(s => s.packType))])

const fetchServices = async () => {
  try {
    const query = `query { services { services { name packType } } }`
    const data = await graphql<{ services: { services: { name: string; packType: string }[] } }>(query)
    if (data.services?.services) services.value = data.services.services
  } catch (e) { console.error(e) }
}

const triggerGalleryUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxSize = 800
          const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)
          canvas.width = img.width * ratio
          canvas.height = img.height * ratio
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
          galleryImages.value.push({ url: canvas.toDataURL('image/jpeg', 0.6), type: 'gallery' })
        }
        img.src = ev.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }
  input.click()
}

const removeGalleryImage = (idx: number) => { galleryImages.value.splice(idx, 1) }

const fetchItems = async () => {
  try {
    const query = `query { portfolio { items { id title description category imageUrl beforeImageUrl afterImageUrl isFeatured galleryImages } } }`
    const data = await graphql<{ portfolio: { items: (PortfolioItem & { galleryImages?: string })[] } }>(query)
    if (data.portfolio?.items) items.value = data.portfolio.items
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

const openModal = (item?: PortfolioItem) => {
  galleryImages.value = []
  if (item) {
    editingItem.value = item
    form.value = { title: item.title, description: item.description || '', category: item.category, isFeatured: item.isFeatured }
    
    // ✅ Carregar TODAS as imagens da galeria
    if (item.imageUrl) galleryImages.value.push({ url: item.imageUrl, type: 'gallery' })
    if (item.beforeImageUrl) galleryImages.value.push({ url: item.beforeImageUrl, type: 'before' })
    if (item.afterImageUrl) galleryImages.value.push({ url: item.afterImageUrl, type: 'after' })
    
    // ✅ Carregar imagens extras do gallery_images (JSON)
    if ((item as any).gallery_images) {
      try {
        const extraImages = typeof (item as any).gallery_images === 'string' 
          ? JSON.parse((item as any).gallery_images) 
          : (item as any).gallery_images
        if (Array.isArray(extraImages)) {
          extraImages.forEach((img: any) => {
            // Evitar duplicados
            if (!galleryImages.value.find(g => g.url === img.url)) {
              galleryImages.value.push({ url: img.url, type: img.type || 'gallery' })
            }
          })
        }
      } catch (e) {}
    }
  } else {
    editingItem.value = null
    form.value = { title: '', description: '', category: '', isFeatured: false }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false; editingItem.value = null }

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const mainImage = galleryImages.value.find(i => i.type === 'gallery')?.url || galleryImages.value[0]?.url || ''
    const beforeImage = galleryImages.value.find(i => i.type === 'before')?.url || ''
    const afterImage = galleryImages.value.find(i => i.type === 'after')?.url || ''

    const payload = {
      ...form.value,
      imageUrl: mainImage,
      beforeImageUrl: beforeImage,
      afterImageUrl: afterImage,
      galleryImages: JSON.stringify(galleryImages.value)
    }

    const url = editingItem.value ? `/Portfolio/${editingItem.value.id}` : '/Portfolio/Add'
    const method = editingItem.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Session-Key': Cache.Session?.value || '' },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    if (!data.HasError) { await fetchItems(); closeModal() }
  } catch (e) { console.error(e) }
  finally { isSubmitting.value = false }
}

const handleDelete = async (id: string) => {
  if (!confirm('Remover?')) return
  try {
    await graphql(`mutation { deletePortfolioItem(id: "${id}") { hasError } }`)
    items.value = items.value.filter(i => i.id !== id)
  } catch (e) { console.error(e) }
}

onMounted(() => { fetchItems(); fetchServices() })
</script>