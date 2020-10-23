<template>
  <div id="app">
    <twitch-oauth-button
      clientID="e7g44jusrmcfqyl59kzxe2j4c7ud9g"
      :redirectURI="uri"
      scope="chat:read chat:edit"
      @access-token="token = $event"
      />
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
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
