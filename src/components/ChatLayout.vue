<template>
  <div class="chat-layout">
    <aside class="sidebar">
      <div class="sidebar-header">Rooms</div>
      <div class="room-search">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search rooms..."
        />
      </div>
      <ul class="room-list">
        <li
          v-for="room in rooms"
          :key="room.room_id"
          @click="selectRoom(room)"
          :class="{
            'active-room':
              selectedRoom && selectedRoom.room_id === room.room_id,
          }"
        >
          <img :src="room.user_avatar_url" class="avatar" />
          <div class="room-info">
            <div class="room-name">{{ room.name }}</div>
            <div class="room-last-message">
              {{ room.last_comment_text || 'No messages yet' }}
            </div>
          </div>
        </li>
      </ul>
    </aside>
    <main class="chat-main">
      <header class="chat-header">
        <img :src="selectedRoom?.user_avatar_url" class="avatar" v-if="selectedRoom" />
        <span v-if="selectedRoom">{{ selectedRoom.name }}</span>
      </header>
      <section class="chat-messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.senderType]"
          :style="
            msg.senderType === 'sent'
              ? 'align-self: flex-end;'
              : msg.senderType === 'received'
              ? 'align-self: flex-start;'
              : ''
          "
        >
          <template v-if="msg.type === 'product'">
            <div class="product-bubble">
              <img :src="msg.image" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ msg.name }}</div>
                <div class="product-price">{{ msg.price }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <span>{{ msg.text }}</span>
          </template>
        </div>
      </section>
      <footer class="chat-input">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage">Send</button>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoomsStore } from '../stores/rooms'
import { useRoute, useRouter } from 'vue-router'
import roomsData from '../../list_rooms.json'

const store = useRoomsStore()
store.setRooms(roomsData.data.customer_rooms)

const rooms = computed(() => {
  if (!searchTerm.value.trim()) return store.rooms
  return store.rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})
const selectedRoom = ref(null)
const messages = ref([])
const input = ref('')
const searchTerm = ref('')
const route = useRoute()
const router = useRouter()

function loadRoomById(roomId) {
  const room = rooms.value.find(r => r.room_id == roomId)
  if (room) {
    selectRoom(room)
  } else {
    selectedRoom.value = null
    messages.value = []
  }
}

function selectRoom(room) {
  selectedRoom.value = room
  router.push({ name: 'ChatRoom', params: { roomId: room.room_id } })
  // Example: hardcoded messages for demo
  messages.value = [
    {
      id: 1,
      text: room.last_comment_text,
      senderType: room.last_comment_sender_type === 'customer'  ? 'received' : 'sent'
    },
    {
      id: 2,
      text: 'Hello, how can I help you?',
      senderType: 'sent'
    },
    {
      id: 3,
      text: 'I want to know more about your product.',
      senderType: 'received'
    },
    {
      id: 4,
      type: 'product',
      image: 'https://placehold.co/60',
      name: 'Sample Product',
      price: '$19.99',
      senderType: 'sent'
    }
  ]
}

function sendMessage() {
  if (!input.value.trim() || !selectedRoom.value) return
  messages.value.push({
    id: Date.now(),
    text: input.value,
    senderType: 'sent'
  })
  input.value = ''
}

// Watch for route changes to load the correct room
watch(() => route.params.roomId, (roomId) => {
  if (roomId) {
    loadRoomById(roomId)
  }
})

onMounted(() => {
  if (route.params.roomId) {
    loadRoomById(route.params.roomId)
  }
})
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 90vh;
}
.sidebar {
  width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 20px;
  font-weight: bold;
  background: #27b199;
  color: #fff;
  border-bottom: 1px solid #15695c;
}

.room-search {
    padding: 12px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #eee;
  }
  .room-search input {
    width: 90%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
  }
  .room-list {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;
    max-height: calc(100vh - 56px); /* 56px = sidebar-header height */
  }
  .room-list li {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
  }
  .room-list li:hover {
    background: #eaeaea;
  }
  .room-list li.active-room {
    background: #15695c;
    color: #fff;
  }
  .room-list li.active-room .room-name,
  .room-list li.active-room .room-last-message {
    color: #fff;
  }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
  }
  .room-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .room-name {
    font-weight: 500;
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .room-last-message {
    font-size: 0.95em;
    color: #888;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
.chat-main {
  width: 800px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #15695c;
  color: #fff;
  background: #27b199;
}
  .chat-messages {
    flex: 1;
    padding: 24px 32px 24px 32px;
    overflow-y: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .message {
    margin-bottom: 0;
    padding: 10px 18px;
    border-radius: 16px;
    max-width: 320px;
    display: inline-block;
    word-break: break-word;
    font-size: 1em;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .message.sent {
    background: #e0f7fa;
    color: #222;
  }
  .message.received {
    background: #fce4ec;
    color: #222;
  }
  .message.system {
    background: #eee;
    color: #888;
    margin: 0 auto;
  }
  .product-bubble {
    display: flex;
    align-items: center;
    background: #fffde7;
    border: 1px solid #ffe082;
    border-radius: 16px;
    padding: 8px 12px;
    max-width: 300px;
  }
  .product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 12px;
  }
  .product-info {
    display: flex;
    flex-direction: column;
  }
  .product-name {
    font-weight: bold;
    margin-bottom: 4px;
  }
  .product-price {
    color: #ff9800;
    font-weight: 500;
  }
.chat-input {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #ddd;
  background: #fafafa;
}
.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
}
.chat-input button {
  padding: 8px 16px;
  border: none;
  background: #27b199;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.chat-input button:hover {
  background: #15695c;
}
</style>
