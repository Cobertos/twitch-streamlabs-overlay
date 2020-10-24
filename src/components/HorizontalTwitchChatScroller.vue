<template>
  <transition-group
    class="chat-messages"
    name="chat-message-items"
    tag="div">
    <template
      v-for="(m, idx) in chatMessagesReversed"
    >
      <span
        class="chat-name"
        :style="{ color: m.color }"
        :key="'0'+m.id"
      >
        {{m.user}}:
      </span>
      <!-- Shitty hack for .a to get linter off my back -->
      <span
        class="chat-message"
        v-for="part in m.message"
        :key="'1'+m.id+part.a"
      >
        <span
          v-if="part.text"
          v-text="part.text"
        />
        <span
          v-if="part.html"
          v-html="part.html"
        />
      </span>
      <span
        v-if="idx !== chatMessagesReversed.length - 1"
        class="chat-separator"
        :key="'2'+m.id">
        ⬩
      </span>
    </template>
  </transition-group>
</template>

<script>
export default {
  props: {
    chatMessages: Array
  },
  computed: {
    chatMessagesReversed(){
      return this.chatMessages.slice().reverse();
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');

.chat-messages {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  position: absolute;
  width: 100%;
  right: 0;
  bottom: 0;
  padding: 2px 5px;
  font-family: 'Roboto', Arial, sans-serif;
  font-weight: 300;

  > * {
    flex: 0 0 auto;
  }

  .chat-name {
    margin-right: 10px;
    font-weight: 500;
  }
  .chat-separator {
    margin: 0 15px;
  }
  .chat-message {
    display: flex;
    align-items: center;

    img {
      margin: 0 3px;
    }
  }
}

.chat-message-items-enter-active, .chat-message-items-leave-active, .chat-message-items-move {
  transition: transform 0.5s;
}
</style>
