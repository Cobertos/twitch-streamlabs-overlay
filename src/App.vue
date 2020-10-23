<template>
  <div id="app">
    <twitch-oauth-button
      v-if="!token"
      clientID="e7g44jusrmcfqyl59kzxe2j4c7ud9g"
      :redirectURI="uri"
      scope="chat:read chat:edit"
      @access-token="token = $event"
      />
    <div
      v-else>
      Authed!
    </div>
    <horizontal-twitch-chat-scroller
      :token="token"/>
  </div>
</template>

<script>
import HorizontalTwitchChatScroller from "./components/HorizontalTwitchChatScroller.vue";
import TwitchOauthButton from "./components/TwitchOAuthButton.vue";

export default {
  name: "App",
  data() {
    return {
      token: undefined
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
