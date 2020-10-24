<template>
  <a
    class="oauth-button"
    :href="oauthURL">
    Streamlabs OAuth
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

      return `https://streamlabs.com/api/v1.0/authorize?client_id=${this.clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scopeEncoded}`;
    }
  },
  methods: {
    async tryCode() {
      if(window.location.href.indexOf('?') !== -1 &&
        this.clientSecret) {
        let params;
        try {
          params = window.location.href
            .split('?')[1].split('#')[0] // Just query string
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
        // Code obtained, do the second part of the query
        const code = params['code'];
        const resp = await fetch(`https://twitch-streamlabs-overlay.vercel.app/api/codeToToken?code=${code}`);
        const json = await resp.json();
        this.$emit('access-token', json.access_token);
      }
    }
  },
  created() {
    this.tryCode();
  }
}
</script>

<style lang="scss" scoped>
.oauth-button {
  color: #FFF;
  background-color: #32C3A2;
  border-radius: 5px;
  text-decoration: none;
  padding: 4px 10px;

  &:hover {
    background-color: lighten(#32C3A2,10%);
  }

  &.disabled {
    background-color: #72968E;
    pointer-events: none;
  }
}
</style>