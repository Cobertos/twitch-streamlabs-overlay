<template>
  <div id="app">
    <twitch-oauth-button
      v-if="!chatClient"
      clientID="e7g44jusrmcfqyl59kzxe2j4c7ud9g"
      :redirectURI="uri"
      scope="chat:read chat:edit"
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
//import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';

import HorizontalTwitchChatScroller from "./components/HorizontalTwitchChatScroller.vue";
import TwitchOauthButton from "./components/TwitchOAuthButton.vue";

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
      let href = window.location.href;
      href = href.replace(/\/$/, ''); // Remove trailing / if present
      return href;
    }
  },
  methods: {
    async createClient(token) {
      if(this.chatClient) {
        this.destroyClient();
      }
      const clientId = 'e7g44jusrmcfqyl59kzxe2j4c7ud9g';
      const authProvider = new StaticAuthProvider(clientId, token);
      //const apiClient = new ApiClient({ authProvider });
      const chatClient = new ChatClient(authProvider, { channels: ['robotfrogs3'] });
      await chatClient.connect();
      console.log("Connected to Twitch chat");
      chatClient.onMessage((channel, user, message) => {
        this.chatMessages = [
          { user, message },
          ...this.chatMessages.slice(0,5)
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
