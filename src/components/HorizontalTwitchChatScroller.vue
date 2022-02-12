<template>
  <horizontal-scroller>
    <template
      v-for="(m, idx) in messages.slice().reverse()"
    >
      <span
        class="chat-name"
        :style="{ color: m.color }"
        :key="'0'+m.id"
      >
        {{m.user}}:
      </span>
      <!-- Shitty hack for .a to get linter off my back -->
      <template
        class="chat-message"
        v-for="part in m.message"
      >
        <span
          v-if="part.text"
          v-text="part.text"
          :key="'1'+m.id+part.id"
        />
        <span
          v-if="part.html"
          v-html="part.html"
          :key="'1'+m.id+part.id"
        />
      </template>
      <span
        v-if="idx !== messages.length - 1"
        class="chat-separator"
        :key="'2'+m.id">
        ⬩
      </span>
    </template>
  </horizontal-scroller>
</template>

<script>
import { ChatClient } from '@twurple/chat';
import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';

import HorizontalScroller from './HorizontalScroller.vue';
export default {
  components: { HorizontalScroller },
  props: {
    accessToken: {
      type: String,
      required: true
    },
    clientID: {
      type: String,
      required: true
    },
    channel: {
      type: String,
      required: true
    },
    blocked: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      client: undefined,
      messages: []
    }
  },
  watch: {
    accessToken(token){
      this.createClient(token);
    }
  },
  methods: {
    async createClient(token) {
      if(this.client) {
        this.destroyClient();
      }
      const authProvider = new StaticAuthProvider(this.clientID, token);
      const apiClient = new ApiClient({ authProvider });
      // Get cheer emotes so we can display bits
      const cheermotes = await apiClient.bits.getCheermotes();

      const chatClient = new ChatClient(authProvider, { channels: [this.channel] });
      chatClient.onMessage((channel, user, message, msgObj) => {
        if(this.blocked.includes(user)) {
          return; // Blocked user
        }
        console.log(channel, user, message, msgObj);

        this.messages = [
          {
            id: msgObj._tags.get('id'),
            user,
            message: msgObj.parseEmotesAndBits(cheermotes)
              .map((m, id) => {
                if(m.type === 'text') {
                  return {
                    id,
                    text: m.text
                  };
                }
                else if(m.type === 'emote') {
                  return {
                    id,
                    html: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${m.id}/1.0"></img>`
                  };
                }
                else if(m.type === 'cheer') {
                  return {
                    id,
                    html: `<img src="${m.displayInfo.url}"></img>`
                  };
                }
                else {
                  console.error(`Unknown message type, '${m.type}'`);
                }
              }),
            color: msgObj.userInfo.color || '#FFF'
          },
          ...this.messages.slice(0,20)
        ];
      });
      // This only gets called when it doesn't happen from a ban
      chatClient.onChatClear((/*channel*/) => {
        this.messages = [];
      });
      // This gets called when a chat clear has a user and duration
      const removeUserMessages = (channel, user) => {
        console.log(`Remove user messages for ${user}`);
        this.messages = this.messages
          .filter(m => m.user !== user);
      };
      chatClient.onBan(removeUserMessages);
      chatClient.onTimeout(removeUserMessages);
      // I've never actually seen this called so idk if this will work...
      chatClient.onMessageRemove((channel, messageId/*, msg*/) => {
        // Remove any deleted messages
        this.messages = this.messages
          .filter(m => m.id !== messageId);
      });
      await chatClient.connect();
      console.log("Connected to Twitch chat");
      this.client = chatClient;
    },
    destroyClient() {
      if(this.client) {
        this.client.quit();
        this.client = undefined;
        console.log("Disconnected from Twitch chat");
      }
    }
  },
  created() {
    if(this.accessToken) {
      this.createClient(this.accessToken);
    }
  },
  beforeDestroy() {
    if(this.client) {
      this.destroyClient();
    }
  }
};
</script>

<style lang="scss">
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
</style>
