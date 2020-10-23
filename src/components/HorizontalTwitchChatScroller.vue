<template>
  <div class="chat-messages">
    <div
      class="chat-message"
      v-for="m in chatMessages"
      :key="''+random()+m.user">
      <span>{{m.user}}: </span>
      <span>{{m.message}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chatMessages: Array
  },
  methods: {
    random(){
      return Math.random();
    }
  }
};
</script>

<style lang="scss">
.chat-messages {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row-reverse;
  position: absolute;
  width: 100%;
  right: 0;
  bottom: 0;
  padding: 2px 5px;
  background-color: #444;

  > * {
    flex: 0 0 auto;
  }

  .chat-message {
    margin-right: 15px;
  }
}
</style>
