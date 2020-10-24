<template>
  <div id="app">
    <div class="auth-container">
      <twitch-oauth-button
        v-if="!twitchAccessToken"
        clientID="e7g44jusrmcfqyl59kzxe2j4c7ud9g"
        :redirectURI="uri"
        scope="chat:read chat:edit user_read"
        @access-token="setTwitchAccessToken"
        />
      <div
        v-else>
        Twitch Authed >:3!<br>
        Chat for channel <span style="color:#F0F">#{{twitchChatChannelName || 'loading...'}}</span>
      </div>
      <streamlabs-oauth-button
        v-if="!streamlabsAccessToken"
        clientID="tKjGdvsJGyCIhN2jZ19bYgsClHs8UFgwIidstmFk"
        redirectURI="https://twitch-streamlabs-overlay.vercel.app"
        scope="socket.token"
        @access-token="streamlabsAccessToken = $event"
      />
      <div
        v-else>
        Streamlabs Authed :O!
      </div>
    </div>
    <div class="scroller-container">
      <horizontal-streamlabs-scroller
        v-if="streamlabsAccessToken"
        :accessToken="streamlabsAccessToken"
        />
      <horizontal-twitch-chat-scroller
        v-if="twitchAccessToken && twitchChatChannelName"
        clientID="e7g44jusrmcfqyl59kzxe2j4c7ud9g"
        :accessToken="twitchAccessToken"
        :channel="twitchChatChannelName"/>
    </div>
  </div>
</template>

<script>
import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';

import HorizontalTwitchChatScroller from "./components/HorizontalTwitchChatScroller.vue";
import HorizontalStreamlabsScroller from "./components/HorizontalStreamlabsScroller.vue";
import TwitchOauthButton from "./components/TwitchOAuthButton.vue";
import StreamlabsOauthButton from "./components/StreamlabsOAuthButton.vue";

const twitchClientID = 'e7g44jusrmcfqyl59kzxe2j4c7ud9g';

export default {
  name: "App",
  data() {
    return {
      twitchAccessToken: undefined,
      twitchChatChannelName: '',
      streamlabsAccessToken: undefined
    }
  },
  components: {
    HorizontalTwitchChatScroller, HorizontalStreamlabsScroller,
    TwitchOauthButton, StreamlabsOauthButton
  },
  computed: {
    uri() {
      let href = window.location.origin;
      href = href.replace(/\/$/, ''); // Remove trailing / if present
      return href;
    },
  },
  methods:{
    async setTwitchAccessToken(token) {
      this.twitchAccessToken = token;
      const authProvider = new StaticAuthProvider(twitchClientID, this.twitchAccessToken);
      const apiClient = new ApiClient({ authProvider });
      const me = await apiClient.kraken.users.getMe();
      this.twitchChatChannelName = me.name;
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');

body, html {
  background-color: #000;
  color: #FFF;
  padding: 0;
  margin: 0;
  font-family: 'Roboto', Arial, sans-serif;
  width: 100%;
  height: 100%;
}
.auth-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
  text-align: center;

  > *:nth-child(n+2) {
    margin-left: 10px;
  }
}
.scroller-container {
  width: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
* {
  box-sizing: border-box;
}
</style>
