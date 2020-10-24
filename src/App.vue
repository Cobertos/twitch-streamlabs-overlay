<template>
  <div id="app">
    <twitch-oauth-button
      v-if="!chatClient"
      clientID="e7g44jusrmcfqyl59kzxe2j4c7ud9g"
      :redirectURI="uri"
      scope="chat:read chat:edit user_read"
      @access-token="createClient"
      />
    <div
      v-else>
      Authed!
    </div>
    <horizontal-twitch-chat-scroller
      :chatMessages="chatMessages"/>
  </div>
</template>

<script>
import { ChatClient } from 'twitch-chat-client';
import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';

import HorizontalTwitchChatScroller from "./components/HorizontalTwitchChatScroller.vue";
import TwitchOauthButton from "./components/TwitchOAuthButton.vue";

const twitchClientId = 'e7g44jusrmcfqyl59kzxe2j4c7ud9g';

export default {
  name: "App",
  data() {
    return {
      chatClient: undefined,
      chatMessages: []
    }
  },
  components: {
    HorizontalTwitchChatScroller, TwitchOauthButton
  },
  computed: {
    uri() {
      let href = window.location.protocol + '//' + window.location.host;
      href = href.replace(/\/$/, ''); // Remove trailing / if present
      return href;
    }
  },
  methods: {
    async createClient(token) {
      if(this.chatClient) {
        this.destroyClient();
      }
      
      const authProvider = new StaticAuthProvider(twitchClientId, token);
      const apiClient = new ApiClient({ authProvider });
      const cheermotes = await apiClient.kraken.bits.getCheermotes();
      const me = await apiClient.kraken.users.getMe();
      const chatClient = new ChatClient(authProvider, { channels: [me.name] });
      await chatClient.connect();
      console.log("Connected to Twitch chat");
      chatClient.onMessage((channel, user, message, msgObj) => {
        this.chatMessages = [
          {
            id: ''+Math.random(),
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
          ...this.chatMessages.slice(0,10)
        ];
      });
      this.chatClient = chatClient;
    },
    destroyClient() {
      if(this.chatClient) {
        this.chatClient.quit();
        console.log("Disconnected from Twitch chat");
      }
    }
  },
  beforeDestroy() {
    if(this.chatClient) {
      this.destroyClient();
    }
  }
};
</script>

<style>
body, html {
  background-color: #000;
  color: #FFF;
  padding: 0;
  margin: 0;
}
#app {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
