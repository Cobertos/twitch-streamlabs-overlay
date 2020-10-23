<template>
  <a
    class="oauth-button"
    :href="oauthURL">
    Twitch OAuth
  </a>
</template>

<script>
export default {
  props: {
    clientID: {
      type: String,
      required: true
    },
    redirectURI: {
      type: String,
      required: true
    },
    scope: {
      type: String,
      required: true
    }
  },
  computed: {
    oauthURL() {
      const redirectURI = window.encodeURIComponent(this.redirectURI);
      const scopeEncoded = window.encodeURIComponent(this.scope);
      return `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientID}&redirect_uri=${redirectURI}&response_type=token&scope=${scopeEncoded}`;
    }
  },
  created() {
    if(window.location.hash) {
      let params;
      try {
        params = window.location.hash
          .slice(1) // Remove leading #
          .split('&')
          .map(s => s.split('='))
          .map(([k,v]) => ({
            [k]: window.decodeURIComponent(v)
          }))
          .reduce((acc, itm) => ({ ...acc, ...itm }), {});
      }
      catch(e) {
        console.error('Couldnt parse OAuth response');
        console.error(e);
        return;
      }
      this.$emit('access-token', params['access_token']);
    }
  }
}
</script>

<style lang="scss">
.oauth-button {
  color: #FFF;
  background-color: #6441a5;
  border-radius: 5px;
  text-decoration: none;
  padding: 4px 10px;

  &:hover {
    background-color: lighten(#6441a5,10%);
  }
}
</style>