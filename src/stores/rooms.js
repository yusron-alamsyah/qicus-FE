import { defineStore } from 'pinia'

export const useRoomsStore = defineStore('rooms', {
  state: () => ({
    rooms: []
  }),
  actions: {
    setRooms(rooms) {
      this.rooms = rooms
    }
  }
})
