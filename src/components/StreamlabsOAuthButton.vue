<template>
  <div
    class="oauth-button-container"
  >
    <a
      class="oauth-button"
      :href="oauthURL">
      Auth wth Streamlabs
    </a>
    <div>
      <input
        type="text"
        v-model="lastAccessToken"
        placeholder="or paste your token here..."
      >
      <button
        v-text="'Submit'"
        @click="$emit('access-token', lastAccessToken)"
      />
    </div>
    <p
      class="under-text"
    >
      Do not share this, it's secret!
    </p>
  </div>
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
  data() {
    return {
      lastAccessToken: ''
    };
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
      if(window.location.href.indexOf('?') !== -1) {
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
        this.lastAccessToken = json.access_token;
        this.$emit('access-token', this.lastAccessToken);
      }
    }
  },
  created() {
    this.tryCode();
  }
}
</script>

<style lang="scss" scoped>
.oauth-button-container {
  display: flex;
  align-items: center;
  flex-direction: column;

  .oauth-button {
    color: #FFF;
    background-color: #32C3A2;
    border-radius: 5px;
    text-decoration: none;
    padding: 4px 10px;
    margin-bottom: 10px;

    &:hover {
      background-color: lighten(#32C3A2,10%);
    }

    &.disabled {
      background-color: #72968E;
      pointer-events: none;
    }
  }

  .under-text {
    font-size: 10px;
  }
}
</style>