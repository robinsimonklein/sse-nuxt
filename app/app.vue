<template>
  <UApp>
    <UContainer>
      <div class="min-h-screen flex items-center justify-center">
        <div>
          <div ref="messagesBox" class="w-lg max-w-full h-[320px] overflow-y-auto border border-default rounded p-4">
            <template v-if="messages.length">
              <div v-for="(message, index) in messages" :key="index"
                   class="flex gap-2 my-2 first:mt-0 last:mb-0 text-sm ">
                <pre class="text-muted text-xs mt-0.5">{{
                    message.date.toLocaleDateString()
                  }} - {{ message.date.toLocaleTimeString() }}</pre>
                <p>{{ message.text }}</p>
              </div>
            </template>
            <template v-else>
              <p class="text-sm italic text-muted">Messages will appear here...</p>
            </template>
          </div>
          <form class="flex items-center gap-2 mt-4" @submit.prevent="sendMessage">
            <UInput v-model="userMessage" placeholder="Type a message..." :ui="{root: 'w-full'}"/>
            <UButton type="submit" color="neutral" :disabled="!userMessage.length" :ui="{base: 'shrink-0'}">Send
            </UButton>
          </form>
        </div>
      </div>
    </UContainer>
  </UApp>
</template>

<script lang="ts" setup>
const eventSource = shallowRef<EventSource | null>(null)

const userMessage = ref('')
const messages = ref<{ date: Date, text: string }[]>([])

const messagesBox = useTemplateRef('messagesBox')

const sendMessage = async () => {
  if (!userMessage.value.length) return

  await $fetch('/api/messages/send', {
    method: 'POST',
    body: {
      message: userMessage.value
    }
  })
  userMessage.value = ''
}

const handleNewMessage = (event: MessageEvent) => {
  const {date, text} = JSON.parse(event.data || '{}')
  if (!date || !text) return

  messages.value.push({date: new Date(date), text})

  nextTick(() => {
    if (messagesBox.value) messagesBox.value.scrollTo({top: messagesBox.value.scrollHeight})
  })
}

onMounted(() => {
  eventSource.value = new EventSource('/api/messages/subscribe')

  eventSource.value.addEventListener('message', handleNewMessage)
})

onUnmounted(() => {
  if (eventSource.value) eventSource.value.close()
})
</script>
