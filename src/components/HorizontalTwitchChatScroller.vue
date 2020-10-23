<template>
  <div class="chat-messages">
    <template
      v-for="(m, idx) in chatMessagesReversed"
    >
      <span
        class="chat-name"
        :style="{ color: m.color }"
        :key="'1'+random()+m.user"
      >
        {{m.user}}:
      </span>
      <!-- Shitty hack for .a to get linter off my back -->
      <span
        class="chat-message"
        v-for="part in m.message"
        :key="'22'+random()+part.a"
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
        :key="'3'+random()+m.user">
        ⬩
      </span>
    </template>
  </div>
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
  },
  methods: {
    random(){
      return Math.random();
    }
  },
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
</style>
